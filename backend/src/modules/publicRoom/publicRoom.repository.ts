import { PrismaClient, RoomType } from "../../generated/prisma";

const prisma = new PrismaClient();

export class PublicRoomRepository {
    async findAll() {
        return prisma.room.findMany({
            where: {
                type: RoomType.PUBLIC,
            },
            include: {
                _count: {
                    select: { participants: true }
                }
            }
        });
    }

    async findById(id: string) {
        return prisma.room.findUnique({
            where: {
                id,
                type: RoomType.PUBLIC,
            },
            include: {
                participants: true,
                _count: {
                    select: { participants: true }
                }
            }
        });
    }

    async addParticipant(roomId: string, alias: string, socketId?: string) {
        return prisma.participant.create({
            data: {
                roomId,
                alias,
                socketId,
            },
        });
    }

    async findParticipant(roomId: string, alias: string) {
        return prisma.participant.findFirst({
            where: {
                roomId,
                alias,
            },
        });
    }

    async countParticipants(roomId: string) {
        return prisma.participant.count({
            where: { roomId },
        });
    }

    async removeParticipant(roomId: string, alias: string) {
        return prisma.participant.deleteMany({
            where: {
                roomId,
                alias,
            },
        });
    }
}

export const publicRoomRepository = new PublicRoomRepository();
