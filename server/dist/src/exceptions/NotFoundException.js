"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotFoundException = void 0;
const HttpExceptions_1 = require("./HttpExceptions");
class NotFoundException extends HttpExceptions_1.HttpException {
    constructor(message = 'Not Found') {
        super(message, 404);
    }
}
exports.NotFoundException = NotFoundException;
//# sourceMappingURL=NotFoundException.js.map