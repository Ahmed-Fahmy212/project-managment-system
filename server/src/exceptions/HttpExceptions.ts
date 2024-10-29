export class HttpException extends Error {
    public statusCode: number;
    constructor(message: string, statusCode: number) {
        super(message);
        this.statusCode = statusCode;
        //TODO 
        //TODO check if this is necessary
        // Error.captureStackTrace(this, this.constructor);
    }
}