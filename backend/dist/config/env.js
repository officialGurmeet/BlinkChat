"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.env = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
const envFile = process.env.NODE_ENV === "production"
    ? ".env.production"
    : ".env.development";
dotenv_1.default.config({ path: envFile });
exports.env = {
    PORT: process.env.PORT || 5000,
    DATABASE_URL: process.env.DATABASE_URL || ""
};
