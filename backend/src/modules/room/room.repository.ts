import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export class RoomRepository {
    async findByName(name: string) {
        return prisma.room.findUnique({
            where: { name },
            include: {
                participants: true,
            },
        });
    }

    async findById(id: string) {
        return prisma.room.findUnique({
            where: { id },
            include: {
                participants: true,
            },
        });
    }

    async create(name: string) {
        return prisma.room.create({
            data: { name },
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

    async addParticipant(roomId: string, alias: string, socketId?: string) {
        return prisma.participant.create({
            data: {
                roomId,
                alias,
                socketId,
            },
        });
    }

    async countParticipants(roomId: string) {
        return prisma.participant.count({
            where: { roomId },
        });
    }

    async deleteRoom(roomId: string) {
        return prisma.room.delete({
            where: { id: roomId },
        });
    }

    async getParticipants(roomId: string) {
        return prisma.participant.findMany({
            where: { roomId },
        });
    }

    async createMessage(data: {
        roomId: string;
        senderId: string;
        senderAlias: string;
        content: string;
        iv: string;
    }) {
        return prisma.message.create({
            data,
        });
    }

    async findMessagesByRoom(roomId: string, limit: number, cursor?: string) {
        return prisma.message.findMany({
            where: { roomId },
            take: limit,
            skip: cursor ? 1 : 0,
            cursor: cursor ? { id: cursor } : undefined,
            orderBy: { createdAt: "desc" },
        });
    }
}

export const roomRepository = new RoomRepository();
