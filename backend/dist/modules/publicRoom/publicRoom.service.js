"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.publicRoomService = exports.PublicRoomService = void 0;
const publicRoom_repository_1 = require("./publicRoom.repository");
const httpError_1 = require("../../common/httpError");
class PublicRoomService {
    async getPublicRooms() {
        const rooms = await publicRoom_repository_1.publicRoomRepository.findAll();
        return rooms.map(room => ({
            id: room.id,
            name: room.name,
            activeUsers: room._count.participants
        }));
    }
    async joinPublicRoom(roomId, alias) {
        const room = await publicRoom_repository_1.publicRoomRepository.findById(roomId);
        if (!room) {
            throw new httpError_1.HttpError(404, "Public room not found");
        }
        const currentParticipants = await publicRoom_repository_1.publicRoomRepository.countParticipants(roomId);
        if (currentParticipants >= 100) {
            throw new httpError_1.HttpError(400, "Room is full (max 100 users)");
        }
        let participant = await publicRoom_repository_1.publicRoomRepository.findParticipant(roomId, alias);
        if (!participant) {
            participant = await publicRoom_repository_1.publicRoomRepository.addParticipant(roomId, alias);
        }
        return {
            room,
            participant,
        };
    }
}
exports.PublicRoomService = PublicRoomService;
exports.publicRoomService = new PublicRoomService();
