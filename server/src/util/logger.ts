import expressWinston from 'express-winston';
import { transports, format } from 'winston';

export const WinstonLogger = expressWinston.logger({
    transports: [
        new transports.File({
            filename: process.env.API_LOG_FILENAME || 'app.log',
            level: 'info', 
        }),
    ],
    format: format.combine(
        format.timestamp(),
        format.json(),
        format.prettyPrint(), 
    ),
    meta: true,
    expressFormat: true,
    colorize: false, 
    requestWhitelist: [
        ...expressWinston.requestWhitelist, 
        'body', 
    ],
    responseWhitelist: [
        ...expressWinston.responseWhitelist, 
        'body', 
    ],
    ignoreRoute: (req, res) => false, 
});
