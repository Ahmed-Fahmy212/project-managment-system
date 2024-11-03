"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BadRequestException = void 0;
const HttpExceptions_1 = require("./HttpExceptions");
class BadRequestException extends HttpExceptions_1.HttpException {
    constructor(message) {
        super(message, 400);
        this.name = 'Bad Request';
    }
}
exports.BadRequestException = BadRequestException;
