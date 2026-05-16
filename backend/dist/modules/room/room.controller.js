"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.roomController = exports.RoomController = void 0;
const room_service_1 = require("./room.service");
const asyncHandler_1 = require("../../utils/asyncHandler");
class RoomController {
    constructor() {
        this.create = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
            const { alias } = req.body;
            if (!alias) {
                return res.status(400).json({
                    success: false,
                    message: "alias is required",
                });
            }
            const result = await room_service_1.roomService.createRoom(alias);
            const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
            res.status(201).json({
                success: true,
                data: {
                    ...result,
                    shareLink: `${frontendUrl}/r/${result.room.id}`,
                    participantCount: 1
                },
            });
        });
        this.join = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
            const { roomName, alias, roomId } = req.body;
            if ((!roomName && !roomId) || !alias) {
                return res.status(400).json({
                    success: false,
                    message: "roomName/roomId and alias are required",
                });
            }
            const result = await room_service_1.roomService.joinRoom(roomName, alias, roomId);
            const participants = await room_service_1.roomService.getRoomParticipants(result.room.id);
            res.status(200).json({
                success: true,
                data: {
                    ...result,
                    participantCount: participants.length
                },
            });
        });
        this.endChat = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
            const { roomId } = req.params;
            await room_service_1.roomService.endChat(roomId);
            res.status(200).json({
                success: true,
                message: "Chat ended and room deleted",
            });
        });
        this.getMessages = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
            const { roomId } = req.params;
            const { cursor, limit } = req.query;
            const result = await room_service_1.roomService.getMessages(roomId, limit ? parseInt(limit) : 20, cursor);
            res.status(200).json({
                success: true,
                data: result
            });
        });
    }
}
exports.RoomController = RoomController;
exports.roomController = new RoomController();
