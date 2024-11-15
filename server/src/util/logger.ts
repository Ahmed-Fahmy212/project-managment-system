import expressWinston from 'express-winston';
import { transports, format } from 'winston';

export const WinstonLogger = expressWinston.logger({
    transports: [
        new transports.File({
            filename: process.env.API_LOG_FILENAME || 'app.log',
            level: 'info', // Adjust the log level as needed
        }),
    ],
    format: format.combine(
        format.timestamp(),
        format.json(),
        format.prettyPrint(), // Makes the logs more readable
    ),
    meta: true, // Enables metadata logging
    expressFormat: true, // Logs in a concise format for HTTP requests
    colorize: false, // Disable colorizing logs
    requestWhitelist: [
        ...expressWinston.requestWhitelist, 
        'body', // Log request body
    ],
    responseWhitelist: [
        ...expressWinston.responseWhitelist, 
        'body', // Log response body
    ],
    ignoreRoute: (req, res) => false, // Don't ignore any routes
});
