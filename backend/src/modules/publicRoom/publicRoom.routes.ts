import { Router } from "express";
import { publicRoomController } from "./publicRoom.controller";

const router = Router();

router.get("/", publicRoomController.getRooms);
router.post("/join", publicRoomController.join);

export default router;
