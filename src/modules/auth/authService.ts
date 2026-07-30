import { authRepository } from "./authRepository.js";
import type { RegistrationDTO, LoginDTO } from "./authSchema.js";
import prisma from "../../config/db.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { env } from "../../config/env.js";
import crypto from "crypto";
import getResend from "../../config/resend.js";

export const authService = {
  async register(data: RegistrationDTO) {
    const emailExists = await prisma.user.findUnique({
      where: { email: data.email },
    });
    if (emailExists) {
      throw new Error("Email already registered. Try to log in.");
    }

    const hashedPassword = await bcrypt.hash(data.password, 10);

    const newData = { ...data, password: hashedPassword };

    return authRepository.create(newData);
  },

  async login(data: LoginDTO) {
    const user = await authRepository.findByEmail(data.email);
    if (!user) {
      throw new Error("User not found");
    }

    const passwordMatch = await bcrypt.compare(data.password, user.password);
    if (!passwordMatch) {
      throw new Error("Invalid password");
    }

    const token = jwt.sign({ id: user.id, email: user.email }, env.JWT_SECRET, {
      expiresIn: "3h",
    });

    return token;
  },

  async verifyEmail(userEmail: string) {
    const resend = getResend();
    const rawToken = crypto.randomBytes(32).toString("hex");
    const hashedToken = crypto
      .createHash("sha256")
      .update(rawToken)
      .digest("hex");
    const tokenExpiry = new Date(Date.now() + 30 * 60 * 1000);

    const link = `${env.FRONTEND_URL}/verify-email?token=${rawToken}`;

    await resend.emails.send({
      from: "Itineris <verify@librex.pictureboooks.homes>",
      to: userEmail,
      subject: "Confirm your email",
      html: `
      <p>We received a request to confirm this email.</p>
      <p><a href="${link}">Click here to confirm your email</a></p>
      <p>This link expires in 30 minutes. If that was not you - ignore the link.</p>
    `,
    });

    return authRepository.verifyEmail(hashedToken, tokenExpiry, userEmail);
  },

  async confirmedEmail(userEmail: string, token: string) {
    const user = await authRepository.findByEmail(userEmail);
    if (!user) throw new Error("User with such email not found");

    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");
    if (user.emailVerifyToken !== hashedToken) throw new Error("Invalid token");
    if (user.emailVerifyExpiry! < new Date(Date.now()))
      throw new Error("Expired link");

    return await authRepository.confirmedEmail(userEmail);
  },
};
