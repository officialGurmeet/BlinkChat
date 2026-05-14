import { Request, Response } from "express";
import { roomService } from "./room.service";
import { asyncHandler } from "../../utils/asyncHandler";

export class RoomController {
    create = asyncHandler(async (req: Request, res: Response) => {
        const { alias } = req.body;

        if (!alias) {
            return res.status(400).json({
                success: false,
                message: "alias is required",
            });
        }

        const result = await roomService.createRoom(alias);
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

    join = asyncHandler(async (req: Request, res: Response) => {
        const { roomName, alias, roomId } = req.body;

        if ((!roomName && !roomId) || !alias) {
            return res.status(400).json({
                success: false,
                message: "roomName/roomId and alias are required",
            });
        }

        const result = await roomService.joinRoom(roomName, alias, roomId);
        const participants = await roomService.getRoomParticipants(result.room.id);

        res.status(200).json({
            success: true,
            data: {
                ...result,
                participantCount: participants.length
            },
        });
    });

    endChat = asyncHandler(async (req: Request, res: Response) => {
        const { roomId } = req.params;

        await roomService.endChat(roomId as string);

        res.status(200).json({
            success: true,
            message: "Chat ended and room deleted",
        });
    });

    getMessages = asyncHandler(async (req: Request, res: Response) => {
        const { roomId } = req.params;
        const { cursor, limit } = req.query;

        const result = await roomService.getMessages(
            roomId as string,
            limit ? parseInt(limit as string) : 20,
            cursor as string
        );

        res.status(200).json({
            success: true,
            data: result
        });
    });
}

export const roomController = new RoomController();
