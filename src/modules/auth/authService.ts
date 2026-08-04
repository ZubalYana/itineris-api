import { authRepository } from "./authRepository.js";
import type { RegistrationDTO, LoginDTO } from "./authSchema.js";
import prisma from "../../config/db.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { env } from "../../config/env.js";
import crypto from "crypto";
import getResend from "../../config/resend.js";
import { streamUpload } from "../../utils/cloudinaryUpload.js";

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

    const safeUser = {
      id: user.id,
      name: user.name,
      email: user.email,
      avatar: user.avatar,
      emailVerified: user.emailVerified,
    };
    return { token, user: safeUser };  },

  async findByEmail(email: string){
    const user = await authRepository.findByEmail(email);
    if(!user) throw new Error('User not found')
    const safeUser = {
      id: user.id,
      name: user.name,
      email: user.email,
      avatar: user.avatar,
      emailVerified: user.emailVerified,
      sentInvites: user.sentInvites,
    };
    return { user: safeUser }; 
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

  async confirmedEmail(token: string) {
    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");
    const user = await authRepository.findByVerifyToken(hashedToken);

    if (!user) throw new Error("Invalid token");
    if (user.emailVerifyExpiry! < new Date(Date.now()))
      throw new Error("Expired link");

    return await authRepository.confirmedEmail(user.email);
  },

  async forgotPassword(userEmail: string) {
    const user = await authRepository.findByEmail(userEmail);
    if (!user) return;

    const resend = getResend();
    const rawToken = crypto.randomBytes(32).toString("hex");
    const hashedToken = crypto
      .createHash("sha256")
      .update(rawToken)
      .digest("hex");
    const tokenExpiry = new Date(Date.now() + 30 * 60 * 1000);
    const link = `${env.FRONTEND_URL}/reset-password?token=${rawToken}`;

    await resend.emails.send({
      from: "Itineris <forgotPassword@librex.pictureboooks.homes>",
      to: userEmail,
      subject: "Reset password",
      html: `
      <p>We received a request to reset your password.</p>
      <p><a href="${link}">Click here to set a new password</a></p>
      <p>This link expires in 30 minutes. If that was not you - ignore the link.</p>
    `,
    });

    return await authRepository.forgotPassword(
      hashedToken,
      tokenExpiry,
      userEmail
    );
  },

  async resetPassword(token: string, newRawPassword: string) {
    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");
    const user = await authRepository.findByResetToken(hashedToken);

    if (!user) throw new Error("Invalid or expired token");
    if (user.passwordResetExpiry! < new Date(Date.now()))
      throw new Error("Invalid or expired token");

    const newPassword = await bcrypt.hash(newRawPassword, 10);
    return await authRepository.resetPassword(user.email, newPassword);
  },

  async uploadAvatar(avatar: Express.Multer.File, userId: string){
    if(!avatar) throw new Error('File not found');
    if(!userId) throw new Error('Invalid user id');

    const avatarURL = await streamUpload(avatar.buffer)
    return await authRepository.uploadAvatar(userId, avatarURL)
  }
};
