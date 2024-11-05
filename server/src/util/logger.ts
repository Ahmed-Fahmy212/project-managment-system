import expressWinston from 'express-winston';
import { transports, format } from 'winston';

export const WinstonLogger = expressWinston.logger({
    transports: [
        new transports.File({ filename: process.env.API_LOG_FILENAME || 'app.log' }),
    ],
    format: format.combine(
        format.json(),
        format.timestamp(),
        format.prettyPrint()
    ),
    meta: true,
    expressFormat: true,
    colorize: false,
    requestWhitelist: [...expressWinston.requestWhitelist, 'bodyRequest'],
    responseWhitelist: [...expressWinston.responseWhitelist, 'bodyResponce']
});
