"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const HttpExceptions_1 = require("../exceptions/HttpExceptions");
const errorHandlerMiddleware = (err, req, res, next) => {
    const error = err instanceof HttpExceptions_1.HttpException ? err : new HttpExceptions_1.HttpException('Internal Server Error', 500);
    res.status(error.statusCode || 500).json({
        data: {
            name: error.name,
            message: error.message,
            stack: process.env.NODE_ENV === 'development' ? error.stack : undefined,
        },
    });
};
exports.default = errorHandlerMiddleware;
