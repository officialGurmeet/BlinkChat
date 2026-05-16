"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.roomRepository = exports.RoomRepository = void 0;
const prisma_1 = require("../../generated/prisma");
const prisma = new prisma_1.PrismaClient();
class RoomRepository {
    async findByName(name) {
        return prisma.room.findUnique({
            where: { name },
            include: {
                participants: true,
            },
        });
    }
    async findById(id) {
        return prisma.room.findUnique({
            where: { id },
            include: {
                participants: true,
            },
        });
    }
    async create(name) {
        return prisma.room.create({
            data: { name },
        });
    }
    async findParticipant(roomId, alias) {
        return prisma.participant.findFirst({
            where: {
                roomId,
                alias,
            },
        });
    }
    async addParticipant(roomId, alias, socketId) {
        return prisma.participant.create({
            data: {
                roomId,
                alias,
                socketId,
            },
        });
    }
    async countParticipants(roomId) {
        return prisma.participant.count({
            where: { roomId },
        });
    }
    async deleteRoom(roomId) {
        return prisma.room.delete({
            where: { id: roomId },
        });
    }
    async getParticipants(roomId) {
        return prisma.participant.findMany({
            where: { roomId },
        });
    }
    async createMessage(data) {
        return prisma.message.create({
            data,
        });
    }
    async findMessagesByRoom(roomId, limit, cursor) {
        return prisma.message.findMany({
            where: { roomId },
            take: limit,
            skip: cursor ? 1 : 0,
            cursor: cursor ? { id: cursor } : undefined,
            orderBy: { createdAt: "desc" },
        });
    }
}
exports.RoomRepository = RoomRepository;
exports.roomRepository = new RoomRepository();
