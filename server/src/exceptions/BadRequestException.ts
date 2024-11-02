import { HttpException } from './HttpExceptions';

export class BadRequestException extends HttpException {
    constructor(message: string) {
        super(message, 400);
        this.name = 'Bad Request';
    }
}
