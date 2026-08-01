import { authService } from "./authService.js";
import { RegistrationSchema, LoginSchema } from "./authSchema.js";
import z from "zod";

export async function Register(input: unknown) {
  const parsed = RegistrationSchema.safeParse(input);
  if (!parsed.success) return { error: z.treeifyError(parsed.error) };

  try {
    const user = await authService.register(parsed.data);
    return { data: { id: user.id, email: user.email, name: user.name } };
  } catch (err) {
    if (err instanceof Error) return { error: err.message };
    return { error: "Registration failure" };
  }
}

export async function Login(input: unknown) {
  const parsed = LoginSchema.safeParse(input);
  if (!parsed.success) return { error: z.treeifyError(parsed.error) };

  try {
    const result = await authService.login(parsed.data);
    return { data: result };
  } catch (err) {
    if (err instanceof Error) return { error: err.message };
    return { error: "Login failure" };
  }
}

export async function VerifyEmail(userEmail: string) {
  try {
    const user = await authService.verifyEmail(userEmail);
    return { data: { id: user.id, email: user.email, name: user.name } };
  } catch (err) {
    if (err instanceof Error) return { error: err.message };
    return { error: "Failed to verify email." };
  }
}

export async function ConfirmEmail(token: string) {
  try {
    const user = await authService.confirmedEmail(token);
    return { data: { id: user.id, email: user.email, name: user.name } };
  } catch (err) {
    if (err instanceof Error) return { error: err.message };
    return { error: "Failed to verify email." };
  }
}

export async function ForgotPassword(userEmail: string) {
  await authService.forgotPassword(userEmail);
  return {
    data: { message: "If that email exists, a reset link has been sent." },
  };
}

export async function ResetPassword(token: string, newPassword: string) {
  try {
    await authService.resetPassword(token, newPassword);
    return { data: { message: "Password reset successful" } };
  } catch (err) {
    if (err instanceof Error) return { error: err.message };
    return { error: "Internal server error" };
  }
}
