import { Request, Response, NextFunction } from 'express';
import chalk from 'chalk';
import { HttpException } from '../exceptions/HttpExceptions';
const errorHandlerMiddleware = (err: HttpException, req: Request, res: Response, next: NextFunction) => {
    const error = err instanceof HttpException ? err : new HttpException('Internal Server Error', 500);

    // logs
    console.error(chalk.red.bold('Error:'));
    console.error(chalk.red(`Name: ${error.name}`));
    console.error(chalk.red(`Message: ${error.message}`));
    console.error(chalk.red(`Stack: ${error.stack}`));

    res.status(error.statusCode || 500).json({
        data: {
            name: error.name,
            message: error.message,
            stack: process.env.NODE_ENV === 'development' ? error.stack : undefined,
        },
    });
};
export default errorHandlerMiddleware;
