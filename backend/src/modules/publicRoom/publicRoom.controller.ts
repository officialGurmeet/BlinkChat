import { Request, Response } from "express";
import { publicRoomService } from "./publicRoom.service";
import { asyncHandler } from "../../utils/asyncHandler";

export class PublicRoomController {
    getRooms = asyncHandler(async (req: Request, res: Response) => {
        const rooms = await publicRoomService.getPublicRooms();
        res.status(200).json({
            success: true,
            data: rooms
        });
    });

    join = asyncHandler(async (req: Request, res: Response) => {
        const { roomId, alias } = req.body;

        if (!roomId || !alias) {
            return res.status(400).json({
                success: false,
                message: "roomId and alias are required",
            });
        }

        const result = await publicRoomService.joinPublicRoom(roomId, alias);

        res.status(200).json({
            success: true,
            data: result
        });
    });
}

export const publicRoomController = new PublicRoomController();
