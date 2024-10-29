import { HttpException } from './HttpExceptions';

export class NotFoundException extends HttpException {
    constructor(message = 'Not Found') {
        super(message, 404);
    }
}

