import { CreateInviteSchema } from "./inviteSchema.js";
import { inviteService } from "./inviteService.js";
import z from "zod";

export async function CreateInvite(
  input: unknown,
  userId: string,
  tripId: string,
  userEmail: string
) {
  const parsed = CreateInviteSchema.safeParse(input);

  if (!parsed.success) return { error: z.treeifyError(parsed.error) };

  try {
    const invite = await inviteService.create(
      parsed.data,
      tripId,
      userId,
      userEmail
    );
    return { data: invite };
  } catch (err) {
    if (err instanceof Error) return { error: err.message };
    return { error: "Error creating the invite" };
  }
}

export async function DeclineInvite(token: string) {
  try {
    const result = await inviteService.decline(token);
    return { data: result };
  } catch (err) {
    if (err instanceof Error) return { error: err.message };
    return { error: "Error declining the invite." };
  }
}

export async function CancelInvite(id: string, requestingUserId: string) {
  try {
    const result = await inviteService.cancel(id, requestingUserId);
    return { data: result };
  } catch (err) {
    if (err instanceof Error) return { error: err.message };
    return { error: "Error canceling the invite" };
  }
}

export async function AcceptInvite(
  token: string,
  userId: string,
  userEmail: string
) {
  try {
    const result = await inviteService.accept(token, userId, userEmail);
    return { data: result };
  } catch (err) {
    if (err instanceof Error) return { error: err.message };
    return { error: "Error accepting the invite" };
  }
}
