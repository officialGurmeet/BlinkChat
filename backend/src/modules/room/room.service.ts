import { roomRepository } from "./room.repository";
import { HttpError } from "../../common/httpError";

export class RoomService {
    async createRoom(alias: string) {
        const roomName = `Private-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
        const room = await roomRepository.create(roomName);

        if (!room) {
            throw new HttpError(500, "Failed to create room");
        }

        const participant = await roomRepository.addParticipant(room.id, alias);

        return {
            room,
            participant,
        };
    }

    async joinRoom(roomName: string | undefined, alias: string, roomId?: string) {
        let room;

        if (roomId) {
            room = await roomRepository.findById(roomId);
        } else if (roomName) {
            room = await roomRepository.findByName(roomName);
            if (!room) {
                room = await roomRepository.create(roomName) as any;
            }
        }

        if (!room) {
            throw new HttpError(404, "Room not found");
        }

        const existingParticipant = await roomRepository.findParticipant(room.id, alias);
        if (existingParticipant) {
            return {
                room,
                participant: existingParticipant,
            };
        }

        const participantCount = await roomRepository.countParticipants(room.id);

        if (participantCount >= 2) {
            throw new HttpError(400, "Room is full");
        }

        const participant = await roomRepository.addParticipant(room.id, alias);

        return {
            room,
            participant,
        };
    }

    async endChat(roomId: string) {
        // Cascade delete handles messages and participants
        await roomRepository.deleteRoom(roomId);
        return { success: true };
    }

    async getRoomParticipants(roomId: string) {
        return roomRepository.getParticipants(roomId);
    }

    async saveMessage(data: {
        roomId: string;
        senderId: string;
        senderAlias: string;
        content: string;
        iv: string;
    }) {
        return roomRepository.createMessage(data);
    }

    async getMessages(roomId: string, limit: number = 20, cursor?: string) {
        const messages = await roomRepository.findMessagesByRoom(roomId, limit, cursor);
        return {
            messages,
            nextCursor: messages.length === limit ? messages[messages.length - 1].id : null,
        };
    }
}

export const roomService = new RoomService();
