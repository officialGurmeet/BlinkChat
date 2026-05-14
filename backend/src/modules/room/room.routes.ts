import { Router } from "express";
import { roomController } from "./room.controller";

const router = Router();

router.post("/create", roomController.create);
router.post("/join", roomController.join);
router.post("/end/:roomId", roomController.endChat);
router.get("/:roomId/messages", roomController.getMessages);

export default router;
