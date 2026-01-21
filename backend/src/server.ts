import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import mongoose from 'mongoose';
import 'dotenv/config';

import Env from './constant/env';
import applyRoutes from './routes';
import globalErrorHandler from './controllers/error.controller';

// Config ENV
const envValidationStatus = Env.validateEnv();
if (envValidationStatus != null) {
  console.log(envValidationStatus);
  process.exit(0);
}

const app = express();

// Middleware
app.use(helmet());
app.use(cors());
app.use(morgan('combined'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Connect to MongoDB
mongoose
  .connect(Env.DATABASE_URL as string)
  .then(() => console.log('DB connections successful'))
  .catch((err) => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });

// Routes
applyRoutes(app);

// Health check
app.get('/api/health', (req: Request, res: Response) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Global error handler
app.use(globalErrorHandler);

const PORT = Env.SERVER_PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});