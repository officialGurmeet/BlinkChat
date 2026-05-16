"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const compression_1 = __importDefault(require("compression"));
const error_middleware_1 = require("./middleware/error.middleware");
const requestLogger_1 = require("./middleware/requestLogger");
const room_routes_1 = __importDefault(require("./modules/room/room.routes"));
const publicRoom_routes_1 = __importDefault(require("./modules/publicRoom/publicRoom.routes"));
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use((0, helmet_1.default)({
    crossOriginResourcePolicy: false,
}));
app.use((0, compression_1.default)());
app.use(express_1.default.json());
app.use(requestLogger_1.requestLogger);
app.get('/health', (req, res) => {
    res.json({ status: 'ok' });
});
app.use('/api/rooms', room_routes_1.default);
app.use('/api/public-rooms', publicRoom_routes_1.default);
app.use(error_middleware_1.errorMiddleware);
exports.default = app;
