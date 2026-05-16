"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.publicRoomRepository = exports.PublicRoomRepository = void 0;
const prisma_1 = require("../../generated/prisma");
const prisma = new prisma_1.PrismaClient();
class PublicRoomRepository {
    async findAll() {
        return prisma.room.findMany({
            where: {
                type: prisma_1.RoomType.PUBLIC,
            },
            include: {
                _count: {
                    select: { participants: true }
                }
            }
        });
    }
    async findById(id) {
        return prisma.room.findUnique({
            where: {
                id,
                type: prisma_1.RoomType.PUBLIC,
            },
            include: {
                participants: true,
                _count: {
                    select: { participants: true }
                }
            }
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
    async findParticipant(roomId, alias) {
        return prisma.participant.findFirst({
            where: {
                roomId,
                alias,
            },
        });
    }
    async countParticipants(roomId) {
        return prisma.participant.count({
            where: { roomId },
        });
    }
    async removeParticipant(roomId, alias) {
        return prisma.participant.deleteMany({
            where: {
                roomId,
                alias,
            },
        });
    }
}
exports.PublicRoomRepository = PublicRoomRepository;
exports.publicRoomRepository = new PublicRoomRepository();
