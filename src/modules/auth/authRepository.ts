import prisma from "../../config/db.js";
import type { RegistrationDTO } from "./authSchema.js";

export const authRepository = {
    async create(data: RegistrationDTO){
        const user = await prisma.user.create({data});
        return user;
    },

    async findByEmail(email: string){
        const user = await prisma.user.findUnique({where: {email}});
        return user;
    },

    async verifyEmail(token: string, tokenExpiry: Date, userEmail: string){
        return await prisma.user.update({
            where: {email: userEmail},
            data: { emailVerifyToken: token, emailVerifyExpiry: tokenExpiry }
        })
    }
}