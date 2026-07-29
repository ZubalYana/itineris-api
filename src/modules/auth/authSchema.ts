import { z } from "zod";

export const RegistrationSchema = z.object({
    name: z.string().min(1).max(100),
    email: z.email(),
    password: z.string().min(8)
});

export type RegistrationDTO = z.infer<typeof RegistrationSchema>

export const LoginSchema = z.object({
    email: z.email(),
    password: z.string()
})

export type LoginDTO = z.infer<typeof LoginSchema>