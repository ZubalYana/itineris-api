import { paymentService } from "./paymentService.js";
import { ContributeRequestSchema } from "./paymentSchema.js";
import z from "zod";

export async function CreateContribution(
  input: unknown,
  userId: string,
  tripId: string
) {
  const parsed = ContributeRequestSchema.safeParse(input);

  if (!parsed.success) return { error: z.treeifyError(parsed.error) };

  try {
    const result = await paymentService.createContribution(tripId, userId, parsed.data.amountCents);
    return { data: result };
  } catch (err) {
    if (err instanceof Error) return { error: err.message };
    return { error: "Error creating contribution" };
  }
}

export async function ListPaymentsByTrip(tripId: string) {
  try {
    const payments = await paymentService.listByTrip(tripId);
    return { data: payments };
  } catch (err) {
    if (err instanceof Error) return { error: err.message };
    return { error: "Error fetching payments" };
  }
}

export async function HandleWebhook(rawBody: Buffer, signature: string) {
  try {
    const result = await paymentService.handleWebhookEvent(rawBody, signature);
    return { data: result };
  } catch (err) {
    if (err instanceof Error) return { error: err.message };
    return { error: "Webhook processing error" };
  }
}