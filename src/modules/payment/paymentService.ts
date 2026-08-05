import Stripe from "stripe";
import { stripe } from "../../config/stripeConfig.js";
import { env } from "../../config/env.js";
import { paymentRepository } from "./paymentRepository.js";

export const paymentService = {
  async createContribution(tripId: string, userId: string, amountCents: number) {
    if (!tripId) throw new Error('Trip id not provided');
    if (!userId) throw new Error('User id not provided');
    if (!amountCents || amountCents <= 0) throw new Error('Invalid amount');

    const paymentIntent = await stripe.paymentIntents.create({
      amount: amountCents,
      currency: 'usd',
      metadata: { tripId, userId },
    });

    const payment = await paymentRepository.create({
      tripId,
      userId,
      amountCents,
      currency: 'usd',
      stripePaymentIntentId: paymentIntent.id,
      status: 'PENDING',
    });

    return { clientSecret: paymentIntent.client_secret, payment };
  },

  async listByTrip(tripId: string) {
    return await paymentRepository.findByTrip(tripId);
  },

  async handleWebhookEvent(rawBody: Buffer, signature: string) {
    const event = stripe.webhooks.constructEvent(
      rawBody,
      signature,
      env.STRIPE_WEBHOOK_SECRET
    );

    switch (event.type) {
      case 'payment_intent.succeeded': {
        const intent = event.data.object as Stripe.PaymentIntent;
        const existing = await paymentRepository.findByPaymentIntentId(intent.id);
        if (existing && existing.status !== 'SUCCEEDED') {
          await paymentRepository.updateStatus(intent.id, 'SUCCEEDED');
        }
        break;
      }
      case 'payment_intent.payment_failed': {
        const intent = event.data.object as Stripe.PaymentIntent;
        await paymentRepository.updateStatus(intent.id, 'FAILED');
        break;
      }
    }
  },
};