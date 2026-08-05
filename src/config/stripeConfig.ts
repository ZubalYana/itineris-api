import Stripe from "stripe";
import { env } from "./env.js";

export const stripe = new Stripe(env.STRIPE_SECRET_KEY, {
    apiVersion: '2026-07-29.dahlia'
})