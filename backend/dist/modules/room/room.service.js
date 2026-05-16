"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.roomService = exports.RoomService = void 0;
const room_repository_1 = require("./room.repository");
const httpError_1 = require("../../common/httpError");
class RoomService {
    async createRoom(alias) {
        const roomName = `Private-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
        const room = await room_repository_1.roomRepository.create(roomName);
        if (!room) {
            throw new httpError_1.HttpError(500, "Failed to create room");
        }
        const participant = await room_repository_1.roomRepository.addParticipant(room.id, alias);
        return {
            room,
            participant,
        };
    }
    async joinRoom(roomName, alias, roomId) {
        let room;
        if (roomId) {
            room = await room_repository_1.roomRepository.findById(roomId);
        }
        else if (roomName) {
            room = await room_repository_1.roomRepository.findByName(roomName);
            if (!room) {
                room = await room_repository_1.roomRepository.create(roomName);
            }
        }
        if (!room) {
            throw new httpError_1.HttpError(404, "Room not found");
        }
        const existingParticipant = await room_repository_1.roomRepository.findParticipant(room.id, alias);
        if (existingParticipant) {
            return {
                room,
                participant: existingParticipant,
            };
        }
        const participantCount = await room_repository_1.roomRepository.countParticipants(room.id);
        if (participantCount >= 2) {
            throw new httpError_1.HttpError(400, "Room is full");
        }
        const participant = await room_repository_1.roomRepository.addParticipant(room.id, alias);
        return {
            room,
            participant,
        };
    }
    async endChat(roomId) {
        // Cascade delete handles messages and participants
        await room_repository_1.roomRepository.deleteRoom(roomId);
        return { success: true };
    }
    async getRoomParticipants(roomId) {
        return room_repository_1.roomRepository.getParticipants(roomId);
    }
    async saveMessage(data) {
        return room_repository_1.roomRepository.createMessage(data);
    }
    async getMessages(roomId, limit = 20, cursor) {
        const messages = await room_repository_1.roomRepository.findMessagesByRoom(roomId, limit, cursor);
        return {
            messages,
            nextCursor: messages.length === limit ? messages[messages.length - 1].id : null,
        };
    }
}
exports.RoomService = RoomService;
exports.roomService = new RoomService();
