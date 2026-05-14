import { Server, Socket } from "socket.io";
import { Server as HttpServer } from "http";
import {
    ClientToServerEvents,
    ServerToClientEvents,
    InterServerEvents,
    SocketData,
} from "../modules/room/socket.types";
import { roomService } from "../modules/room/room.service";
import logger from "./logger";

import { createClient } from "redis";
import { createAdapter } from "@socket.io/redis-adapter";
import { roomRepository } from "../modules/room/room.repository";
import { publicRoomRepository } from "../modules/publicRoom/publicRoom.repository";

interface WaitingUser {
    socketId: string;
    alias: string;
}

const waitingQueue: WaitingUser[] = [];

export const setupSocket = async (server: HttpServer) => {
    const io = new Server<
        ClientToServerEvents,
        ServerToClientEvents,
        InterServerEvents,
        SocketData
    >(server, {
        cors: {
            origin: "*", // Adjust in production
            methods: ["GET", "POST"],
        },
    });

    const pubClient = createClient({ url: process.env.REDIS_URL || "redis://localhost:6379" });
    const subClient = pubClient.duplicate();

    try {
        await Promise.all([pubClient.connect(), subClient.connect()]);
        io.adapter(createAdapter(pubClient, subClient));
        logger.info("Socket.io Redis adapter initialized");
    } catch (err: any) {
        logger.error("Failed to connect to Redis for Socket.io adapter:", err);
    }

    io.on("connection", (socket: Socket) => {
        logger.info(`User connected: ${socket.id}`);

        socket.on("join-room", async ({ roomId, alias, publicKey }) => {
            try {
                const participants = await roomService.getRoomParticipants(roomId);

                const isParticipant = participants.find((p: any) => p.alias === alias);
                if (!isParticipant) {
                    socket.emit("error", { message: "Access denied: Not a participant" });
                    return;
                }

                socket.join(roomId);
                socket.data.alias = alias;
                socket.data.roomId = roomId;

                socket.to(roomId).emit("user-joined", {
                    alias,
                    participantId: isParticipant.id,
                    publicKey,
                });

                logger.info(`User ${alias} joined room: ${roomId}`);
            } catch (error) {
                logger.error(`Error joining room: ${error}`);
                socket.emit("error", { message: "Failed to join room" });
            }
        });

        socket.on("send-message", async ({ roomId, senderId, senderAlias, ciphertext, iv }) => {
            try {
                // Persist the message
                await roomService.saveMessage({
                    roomId,
                    senderId,
                    senderAlias,
                    content: ciphertext,
                    iv,
                });

                // Relay the encrypted payload
                socket.to(roomId).emit("receive-message", {
                    senderId,
                    senderAlias,
                    ciphertext,
                    iv,
                    createdAt: new Date(),
                });
            } catch (error) {
                logger.error(`Error saving message: ${error}`);
            }
        });

        socket.on("request-key-exchange", ({ roomId, publicKey }) => {
            // Relay the sender's public key to the other participant
            socket.to(roomId).emit("key-exchange", { publicKey });
        });

        socket.on("typing", ({ roomId, alias }) => {
            socket.to(roomId).emit("typing", { alias });
        });

        socket.on("stop-typing", ({ roomId }) => {
            socket.to(roomId).emit("stop-typing");
        });

        const handleRandomMatch = async (alias: string) => {
            // Remove from existing room if any
            if (socket.data.roomId) {
                const oldRoomId = socket.data.roomId;
                socket.to(oldRoomId).emit("partner-disconnected");
                socket.leave(oldRoomId);
                socket.data.roomId = undefined;
                socket.data.partnerAlias = undefined;
            }

            // Check if someone is waiting
            const partnerIndex = waitingQueue.findIndex(u => u.socketId !== socket.id);

            if (partnerIndex !== -1) {
                const partner = waitingQueue.splice(partnerIndex, 1)[0];
                const partnerSocket = io.sockets.sockets.get(partner.socketId);

                if (!partnerSocket) {
                    // Partner disappeared, try matching again
                    return handleRandomMatch(alias);
                }

                try {
                    // Create a random room
                    const roomName = `Random-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
                    const room = await roomRepository.create(roomName);
                    const roomId = room.id;

                    // Add participants to DB
                    const p1 = await roomRepository.addParticipant(roomId, alias, socket.id);
                    const p2 = await roomRepository.addParticipant(roomId, partner.alias, partner.socketId);

                    // Setup sockets
                    socket.join(roomId);
                    partnerSocket.join(roomId);

                    socket.data.roomId = roomId;
                    socket.data.alias = alias;
                    socket.data.partnerAlias = partner.alias;

                    partnerSocket.data.roomId = roomId;
                    partnerSocket.data.alias = partner.alias;
                    partnerSocket.data.partnerAlias = alias;

                    // Notify both
                    socket.emit("match-found", { roomId, partnerAlias: partner.alias, partnerId: p2.id });
                    partnerSocket.emit("match-found", { roomId, partnerAlias: alias, partnerId: p1.id });

                    logger.info(`Match found: ${alias} <-> ${partner.alias} in room ${roomId}`);
                } catch (error) {
                    logger.error(`Error creating random match: ${error}`);
                    socket.emit("error", { message: "Failed to create match" });
                }
            } else {
                // No one waiting, join queue
                const alreadyInQueue = waitingQueue.find(u => u.socketId === socket.id);
                if (!alreadyInQueue) {
                    waitingQueue.push({ socketId: socket.id, alias });
                    logger.info(`User ${alias} joined matchmaking queue`);
                }
            }
        };

        socket.on("start-random-chat", ({ alias }) => {
            handleRandomMatch(alias);
        });

        socket.on("skip-user", () => {
            const alias = socket.data.alias;
            if (alias) {
                handleRandomMatch(alias);
            }
        });

        socket.on("end-chat", async ({ roomId }) => {
            try {
                await roomService.endChat(roomId);
                io.to(roomId).emit("chat-ended", {
                    message: "The chat has been ended by a participant.",
                });
                io.in(roomId).socketsLeave(roomId);
                logger.info(`Room ${roomId} ended`);
            } catch (error) {
                logger.error(`Error ending chat: ${error}`);
            }
        });

        socket.on("join-public-room", async ({ roomId, alias }) => {
            try {
                // Ensure the user is a participant (already added via API)
                const participant = await publicRoomRepository.findParticipant(roomId, alias);
                if (!participant) {
                    socket.emit("error", { message: "Access denied: Join room through the lobby first." });
                    return;
                }

                socket.join(roomId);
                socket.data.alias = alias;
                socket.data.roomId = roomId;

                // Broadcast join to others
                socket.to(roomId).emit("user-joined" as any, {
                    alias,
                    participantId: participant.id,
                    system: true // Indicate it's a group join
                });

                // Update everyone on the new user count
                const count = (await io.in(roomId).allSockets()).size;
                io.to(roomId).emit("room-users-update", { count });

                logger.info(`User ${alias} joined public room: ${roomId}`);
            } catch (error) {
                logger.error(`Error joining public room: ${error}`);
                socket.emit("error", { message: "Failed to join public room" });
            }
        });

        socket.on("disconnect", async () => {
            const { roomId, alias } = socket.data;

            // Remove from queue if present
            const qIndex = waitingQueue.findIndex(u => u.socketId === socket.id);
            if (qIndex !== -1) {
                waitingQueue.splice(qIndex, 1);
            }

            if (roomId) {
                // If it's a public room, we might want to notify about user leaving
                socket.to(roomId).emit("user-left", { alias: alias || "Someone" });

                // Update active count for public rooms
                const room = await roomRepository.findById(roomId);
                if (room && (room.type === "PUBLIC" as any)) {
                    // We remove from DB to keep participant list "active" only
                    if (alias) {
                        await publicRoomRepository.removeParticipant(roomId, alias);
                    }

                    // Small delay to let socket.leave happen if not already done by engine.io
                    setTimeout(async () => {
                        const count = (await io.in(roomId).allSockets()).size;
                        io.to(roomId).emit("room-users-update", { count });
                    }, 100);
                }

                socket.to(roomId).emit("partner-disconnected");
                logger.info(`User ${alias} disconnected from room ${roomId}`);
            }
            logger.info(`User disconnected: ${socket.id}`);
        });
    });

    return io;
};
