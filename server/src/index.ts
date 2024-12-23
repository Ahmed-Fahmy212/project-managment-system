import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import 'express-async-errors';
import AppRoutes from './api';
import errorHandlerMiddleware from './middleware/errorHandlerMiddleware';
import { WinstonLogger } from './util/logger';

// Configs
dotenv.config();
const app = express();
app.use(express.json());
app.use(cors());
app.use(helmet.crossOriginResourcePolicy({ policy: 'cross-origin' }));

//hanndle this 
app.use(morgan((tokens, req, res) => {
  return [
    `${tokens.status(req, res)}`,
    `${tokens.method(req, res)}${tokens.url(req, res)}`,
    `${tokens['response-time'](req, res)} ms`,
  ].join(' | ');
}));

app.use(WinstonLogger);

app.use(AppRoutes)

app.get('*', (req, res) => {
  res.status(404).json({
    errors: {
      name: 'Not Found',
      message: 'Not Found Route',
    },
  });
})
// will add email alert
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  errorHandlerMiddleware(err, req, res, next);
});

const port = parseInt(process.env.PORT || "8000");

app.listen(port, () => {
  console.log(`\x1b[32mServer running on port ${port}\x1b[0m`);
  console.log(`\x1b[32mdatabase running on port : 5432\x1b[0m`);
});