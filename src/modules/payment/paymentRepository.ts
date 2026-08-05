import prisma from "../../config/db.js";
import type { CreatePaymentSchemaDTO } from "./paymentSchema.js";
import type { PaymentStatus } from "@prisma/client";

export const paymentRepository = {
  async create(data: CreatePaymentSchemaDTO) {
    return await prisma.tripPayment.create({ data });
  },

  async findByTrip(tripId: string) {
    return await prisma.tripPayment.findMany({ where: { tripId } });
  },

  async findByPaymentIntentId(stripePaymentIntentId: string) {
    return await prisma.tripPayment.findUnique({ where: { stripePaymentIntentId } });
  },

  async updateStatus(stripePaymentIntentId: string, status: PaymentStatus) {
    return await prisma.tripPayment.update({
      where: { stripePaymentIntentId },
      data: { status },
    });
  },
};