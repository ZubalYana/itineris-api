import z from "zod";

export const CreatePaymentSchema = z.object({
  tripId: z.string(),
  userId: z.string(),
  amountCents: z.number().int().positive(),
  currency: z.string(),
  stripePaymentIntentId: z.string(),
  status: z.enum(['PENDING', 'CANCELED', 'FAILED', 'SUCCEEDED']),
});
export type CreatePaymentSchemaDTO = z.infer<typeof CreatePaymentSchema>;

export const ContributeRequestSchema = z.object({
  amountCents: z.number().int().positive(),
});
export type ContributeRequestDTO = z.infer<typeof ContributeRequestSchema>;