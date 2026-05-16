"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.publicRoomController = exports.PublicRoomController = void 0;
const publicRoom_service_1 = require("./publicRoom.service");
const asyncHandler_1 = require("../../utils/asyncHandler");
class PublicRoomController {
    constructor() {
        this.getRooms = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
            const rooms = await publicRoom_service_1.publicRoomService.getPublicRooms();
            res.status(200).json({
                success: true,
                data: rooms
            });
        });
        this.join = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
            const { roomId, alias } = req.body;
            if (!roomId || !alias) {
                return res.status(400).json({
                    success: false,
                    message: "roomId and alias are required",
                });
            }
            const result = await publicRoom_service_1.publicRoomService.joinPublicRoom(roomId, alias);
            res.status(200).json({
                success: true,
                data: result
            });
        });
    }
}
exports.PublicRoomController = PublicRoomController;
exports.publicRoomController = new PublicRoomController();
