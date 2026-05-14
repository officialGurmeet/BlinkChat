import { publicRoomRepository } from "./publicRoom.repository";
import { HttpError } from "../../common/httpError";

export class PublicRoomService {
    async getPublicRooms() {
        const rooms = await publicRoomRepository.findAll();
        return rooms.map(room => ({
            id: room.id,
            name: room.name,
            activeUsers: room._count.participants
        }));
    }

    async joinPublicRoom(roomId: string, alias: string) {
        const room = await publicRoomRepository.findById(roomId);

        if (!room) {
            throw new HttpError(404, "Public room not found");
        }

        const currentParticipants = await publicRoomRepository.countParticipants(roomId);
        if (currentParticipants >= 100) {
            throw new HttpError(400, "Room is full (max 100 users)");
        }

        let participant = await publicRoomRepository.findParticipant(roomId, alias);

        if (!participant) {
            participant = await publicRoomRepository.addParticipant(roomId, alias);
        }

        return {
            room,
            participant,
        };
    }
}

export const publicRoomService = new PublicRoomService();
