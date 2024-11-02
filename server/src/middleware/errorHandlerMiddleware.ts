import { Request, Response, NextFunction } from 'express';

import { HttpException } from '../exceptions/HttpExceptions';
const errorHandlerMiddleware = (err: HttpException, req: Request, res: Response, next: NextFunction) => {
    const error = err instanceof HttpException ? err : new HttpException('Internal Server Error', 500);

    res.status(error.statusCode || 500).json({
        error: {
            name: error.name,
            message: error.message,
            stack: process.env.NODE_ENV === 'development' ? error.stack : undefined,
        },
    });
    
};
export default errorHandlerMiddleware;
