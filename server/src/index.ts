import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import AppRoutes from './modules/routes';
import errorHandlerMiddleware from './middleware/errorHandlerMiddleware';
import 'express-error-handler';
// Configs
dotenv.config();
const app = express();
app.use(express.json());
app.use(cors());
app.use(helmet.crossOriginResourcePolicy({ policy: 'cross-origin' }));
app.use(morgan('common'));

app.use(AppRoutes)

app.use(errorHandlerMiddleware)

const port = parseInt(process.env.PORT || "8000");

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
  console.log(`database running on port : 5432`);
});