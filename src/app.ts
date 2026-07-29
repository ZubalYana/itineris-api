import express from 'express';
import cors from 'cors';
import authRouter from './modules/auth/authRoutes.js';
import tripRouter from './modules/trips/tripRoutes.js';
import placeRouter from './modules/places/placeRoutes.js';
import inviteRouter from './modules/invites/inviteRoutes.js';

const app = express();

app.use(cors());
app.use(express.json());

app.use('/auth', authRouter);
app.use('/trip', tripRouter);
app.use('/place', placeRouter);
app.use('/invite', inviteRouter);

export default app;