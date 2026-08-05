import express from 'express';
import cors from 'cors';
import authRouter from './modules/auth/authRoutes.js';
import tripRouter from './modules/trips/tripRoutes.js';
import placeRouter from './modules/places/placeRoutes.js';
import inviteRouter from './modules/invites/inviteRoutes.js';
import paymentRouter from './modules/payment/paymentRoutes.js';
import { HandleWebhook } from './modules/payment/paymentController.js';

const app = express();

app.use(cors());

app.post(
  '/webhooks/stripe',
  express.raw({ type: 'application/json' }),
  async (req, res) => {
    const signature = req.headers['stripe-signature'] as string;
    const result = await HandleWebhook(req.body, signature);

    if ('error' in result) {
      return res.status(400).json(result);
    }

    res.status(200).json({ received: true });
  }
);

app.use(express.json());

app.use('/auth', authRouter);
app.use('/trip', tripRouter);
app.use('/place', placeRouter);
app.use('/invite', inviteRouter);
app.use('/payments', paymentRouter);

export default app;