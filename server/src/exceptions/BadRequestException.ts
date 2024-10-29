
import { HttpException } from './HttpExceptions';


export class BadRequestException extends HttpException {
    constructor(message = 'Bad Request') {
        super(message, 400);
    }
}