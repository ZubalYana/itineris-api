import { authRepository } from "./authRepository.js";
import type { RegistrationDTO, LoginDTO } from "./authSchema.js";
import prisma from "../../config/db.js";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { env } from "../../config/env.js";

export const authService = {
    async register(data:RegistrationDTO){
        const emailExists = await prisma.user.findUnique({where: {email: data.email}});
        if(emailExists){
            throw new Error("Email already registered. Try to log in.")
        }

        const hashedPassword = await bcrypt.hash(data.password, 10);

        const newData = {...data, password: hashedPassword}

        return authRepository.create(newData);
    },

    async login(data: LoginDTO){
        const user = await authRepository.findByEmail(data.email);
        if(!user){
            throw new Error("User not found");
        }

        const passwordMatch = await bcrypt.compare(data.password, user.password);
        if(!passwordMatch){
            throw new Error("Invalid password");
        }

        const token = jwt.sign(
            {id: user.id, email: user.email}, 
            env.JWT_SECRET,
            {expiresIn: '3h'}
        )

        return token;
    }
}