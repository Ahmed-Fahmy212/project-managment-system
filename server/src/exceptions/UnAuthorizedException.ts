import { HttpException } from './HttpExceptions';

export class UnauthorizedException extends HttpException {
    constructor(message = 'You Are Not Authorized') {
        super(message, 401);
    }
}

