import { Request, Response, NextFunction } from 'express';
import { Prisma } from '@prisma/client';
import { ZodError } from 'zod';
import { HttpException } from '../exceptions/HttpExceptions';

const errorHandlerMiddleware = (
  err: HttpException,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (!res.headersSent) {

    if (err instanceof Prisma.PrismaClientKnownRequestError) {
      let message = 'A database error occurred';
      let statusCode = 500;

      if (err.code === 'P2002') {
        message = 'Unique constraint failed on one or more fields.';
        statusCode = 400;
      } else if (err.code === 'P2025') {
        message = 'Record not found.';
        statusCode = 404;
      } else if (err.code === 'P2003') {
        // this must changed 
        message = `Foreign key constraint failed on field: ${err.meta?.field_name || 'unknown'}.`;
        statusCode = 404;
      } else if (err.code === 'P2014') {
        message = `Invalid ID: ${err.message}`;
        statusCode = 404;
      }

      return res.status(statusCode).json({
        error: {
          message,
          detales: process.env.NODE_ENV === 'development' ? err.stack : undefined,
        },
      });
    }

    if (err instanceof ZodError) {
      const errorDetails = err.errors.map((e) => ({
        item: e.path.join('.'),
        message: e.message,
      }));

      return res.status(400).json({
        error: {
          message: 'Bad Request',
          details: errorDetails,
        },
      });
    }

    // For general HttpException errors
    const error = err instanceof HttpException ? err : new HttpException('Internal Server Error', 500);

    return res.status(error.statusCode || 500).json({
      error: {
        name: error.name,
        message: error.message,
        details: process.env.NODE_ENV === 'development' ? error.stack : undefined,
      },
    });
  } 
  // handle this in better way
  else {
    console.error('Headers already sent:', err);
  }
};

export default errorHandlerMiddleware;
