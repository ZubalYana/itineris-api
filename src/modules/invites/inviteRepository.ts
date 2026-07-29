import type { CreateInviteDTO } from "./inviteSchema.js";
import prisma from "../../config/db.js";

export const inviteRepository = {
    async create(data: CreateInviteDTO, tripId: string, userId: string, token: string, expiresAt: Date){
        return await prisma.invite.create({data: {...data, tripId, invitedById: userId, token, expiresAt}})
    }
}