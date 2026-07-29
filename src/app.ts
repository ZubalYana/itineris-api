import express from 'express'
import authRouter from './modules/auth/authRoutes.js';

const app = express();

app.use('/auth', authRouter);