"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const http_1 = require("http");
const env_1 = require("./config/env");
const app_1 = __importDefault(require("./app"));
const socket_1 = require("./config/socket");
const logger_1 = __importDefault(require("./config/logger"));
const PORT = env_1.env.PORT;
const server = (0, http_1.createServer)(app_1.default);
// Initialize Socket.io
(0, socket_1.setupSocket)(server).catch((err) => {
    logger_1.default.error("Failed to setup socket:", err);
});
server.listen(PORT, () => {
    logger_1.default.info(`Server running on ${PORT}`);
});
