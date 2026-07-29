import express from 'express';
import cors from 'cors';
import authRouter from './modules/auth/authRoutes.js';
import tripRouter from './modules/trips/tripRoutes.js';

const app = express();

app.use(cors());
app.use(express.json());

app.use('/auth', authRouter);
app.use('/trip', tripRouter);

export default app;