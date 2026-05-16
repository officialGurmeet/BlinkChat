"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorMiddleware = void 0;
const httpError_1 = require("../common/httpError");
const errorMiddleware = (err, req, res, next) => {
    if (err instanceof httpError_1.HttpError) {
        return res.status(err.statusCode).json({
            success: false,
            message: err.message
        });
    }
    return res.status(500).json({
        success: false,
        message: "Internal server error"
    });
};
exports.errorMiddleware = errorMiddleware;
