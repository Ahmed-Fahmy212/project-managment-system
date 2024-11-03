"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HttpException = void 0;
class HttpException extends Error {
    constructor(message, statusCode) {
        super(message);
        this.statusCode = statusCode;
        this.name = this.constructor.name;
    }
}
exports.HttpException = HttpException;
