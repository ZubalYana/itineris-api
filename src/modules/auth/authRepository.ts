import prisma from "../../config/db.js";
import type { RegistrationDTO } from "./authSchema.js";

export const authRepository = {
  async create(data: RegistrationDTO) {
    const user = await prisma.user.create({ data });
    return user;
  },

  async findByEmail(email: string) {
    const user = await prisma.user.findUnique({ where: { email }, include: {sentInvites: true} });
    return user;
  },

  async findByVerifyToken(hashedToken: string) {
    return prisma.user.findUnique({ where: { emailVerifyToken: hashedToken } });
  },

  async findByResetToken(resetToken: string){
    return await prisma.user.findUnique({where: {passwordResetToken: resetToken}})
  },

  async verifyEmail(token: string, tokenExpiry: Date, userEmail: string) {
    return await prisma.user.update({
      where: { email: userEmail },
      data: { emailVerifyToken: token, emailVerifyExpiry: tokenExpiry },
    });
  },

  async confirmedEmail(userEmail: string) {
    return await prisma.user.update({
      where: { email: userEmail },
      data: {
        emailVerifyToken: null,
        emailVerifyExpiry: null,
        emailVerified: new Date(Date.now()),
      },
    });
  },

  async forgotPassword(token: string, tokenExpiry: Date, userEmail: string){
    return await prisma.user.update({
        where: { email: userEmail},
        data: {passwordResetToken: token, passwordResetExpiry: tokenExpiry}
    })
  },

  async resetPassword(userEmail: string, newPassword: string){
    return await prisma.user.update({
        where: { email: userEmail },
        data: {
            passwordResetExpiry: null,
            passwordResetToken: null,
            password: newPassword
        }
    })
  }
};
