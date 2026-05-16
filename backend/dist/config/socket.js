"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.setupSocket = void 0;
const socket_io_1 = require("socket.io");
const room_service_1 = require("../modules/room/room.service");
const logger_1 = __importDefault(require("./logger"));
const redis_1 = require("redis");
const redis_adapter_1 = require("@socket.io/redis-adapter");
const room_repository_1 = require("../modules/room/room.repository");
const publicRoom_repository_1 = require("../modules/publicRoom/publicRoom.repository");
const waitingQueue = [];
const setupSocket = async (server) => {
    const io = new socket_io_1.Server(server, {
        cors: {
            origin: "*", // Adjust in production
            methods: ["GET", "POST"],
        },
    });
    const pubClient = (0, redis_1.createClient)({ url: process.env.REDIS_URL || "redis://localhost:6379" });
    const subClient = pubClient.duplicate();
    try {
        await Promise.all([pubClient.connect(), subClient.connect()]);
        io.adapter((0, redis_adapter_1.createAdapter)(pubClient, subClient));
        logger_1.default.info("Socket.io Redis adapter initialized");
    }
    catch (err) {
        logger_1.default.error("Failed to connect to Redis for Socket.io adapter:", err);
    }
    io.on("connection", (socket) => {
        logger_1.default.info(`User connected: ${socket.id}`);
        socket.on("join-room", async ({ roomId, alias, publicKey }) => {
            try {
                const participants = await room_service_1.roomService.getRoomParticipants(roomId);
                const isParticipant = participants.find((p) => p.alias === alias);
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
                logger_1.default.info(`User ${alias} joined room: ${roomId}`);
            }
            catch (error) {
                logger_1.default.error(`Error joining room: ${error}`);
                socket.emit("error", { message: "Failed to join room" });
            }
        });
        socket.on("send-message", async ({ roomId, senderId, senderAlias, ciphertext, iv }) => {
            try {
                // Persist the message
                await room_service_1.roomService.saveMessage({
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
            }
            catch (error) {
                logger_1.default.error(`Error saving message: ${error}`);
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
        const handleRandomMatch = async (alias) => {
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
                    const room = await room_repository_1.roomRepository.create(roomName);
                    const roomId = room.id;
                    // Add participants to DB
                    const p1 = await room_repository_1.roomRepository.addParticipant(roomId, alias, socket.id);
                    const p2 = await room_repository_1.roomRepository.addParticipant(roomId, partner.alias, partner.socketId);
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
                    logger_1.default.info(`Match found: ${alias} <-> ${partner.alias} in room ${roomId}`);
                }
                catch (error) {
                    logger_1.default.error(`Error creating random match: ${error}`);
                    socket.emit("error", { message: "Failed to create match" });
                }
            }
            else {
                // No one waiting, join queue
                const alreadyInQueue = waitingQueue.find(u => u.socketId === socket.id);
                if (!alreadyInQueue) {
                    waitingQueue.push({ socketId: socket.id, alias });
                    logger_1.default.info(`User ${alias} joined matchmaking queue`);
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
                await room_service_1.roomService.endChat(roomId);
                io.to(roomId).emit("chat-ended", {
                    message: "The chat has been ended by a participant.",
                });
                io.in(roomId).socketsLeave(roomId);
                logger_1.default.info(`Room ${roomId} ended`);
            }
            catch (error) {
                logger_1.default.error(`Error ending chat: ${error}`);
            }
        });
        socket.on("join-public-room", async ({ roomId, alias }) => {
            try {
                // Ensure the user is a participant (already added via API)
                const participant = await publicRoom_repository_1.publicRoomRepository.findParticipant(roomId, alias);
                if (!participant) {
                    socket.emit("error", { message: "Access denied: Join room through the lobby first." });
                    return;
                }
                socket.join(roomId);
                socket.data.alias = alias;
                socket.data.roomId = roomId;
                // Broadcast join to others
                socket.to(roomId).emit("user-joined", {
                    alias,
                    participantId: participant.id,
                    system: true // Indicate it's a group join
                });
                // Update everyone on the new user count
                const count = (await io.in(roomId).allSockets()).size;
                io.to(roomId).emit("room-users-update", { count });
                logger_1.default.info(`User ${alias} joined public room: ${roomId}`);
            }
            catch (error) {
                logger_1.default.error(`Error joining public room: ${error}`);
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
                const room = await room_repository_1.roomRepository.findById(roomId);
                if (room && (room.type === "PUBLIC")) {
                    // We remove from DB to keep participant list "active" only
                    if (alias) {
                        await publicRoom_repository_1.publicRoomRepository.removeParticipant(roomId, alias);
                    }
                    // Small delay to let socket.leave happen if not already done by engine.io
                    setTimeout(async () => {
                        const count = (await io.in(roomId).allSockets()).size;
                        io.to(roomId).emit("room-users-update", { count });
                    }, 100);
                }
                socket.to(roomId).emit("partner-disconnected");
                logger_1.default.info(`User ${alias} disconnected from room ${roomId}`);
            }
            logger_1.default.info(`User disconnected: ${socket.id}`);
        });
    });
    return io;
};
exports.setupSocket = setupSocket;
