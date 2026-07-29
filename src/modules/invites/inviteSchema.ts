import z from "zod"
export const CreateInviteSchema = z.object({
    invitedEmail: z.email()
}) 

export type CreateInviteDTO = z.infer<typeof CreateInviteSchema>;