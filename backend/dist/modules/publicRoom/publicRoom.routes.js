"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const publicRoom_controller_1 = require("./publicRoom.controller");
const router = (0, express_1.Router)();
router.get("/", publicRoom_controller_1.publicRoomController.getRooms);
router.post("/join", publicRoom_controller_1.publicRoomController.join);
exports.default = router;
