import type { CreateInviteDTO } from "./inviteSchema.js";
import prisma from "../../config/db.js";

export const inviteRepository = {
    async create(data: CreateInviteDTO, tripId: string, userId: string, token: string, expiresAt: Date){
        return await prisma.invite.create({data: {...data, tripId, invitedById: userId, token, expiresAt}})
    },

    async findInvite(token: string){
        return await prisma.invite.findUnique({where: {token}})
    },

    async decline(token: string){
        return await prisma.invite.delete({where: {token}})
    },

    async accept(inviteTripId: string, userId: string, inviteId: string){
        return prisma.$transaction([
            prisma.tripMember.create({data: {tripId: inviteTripId, userId, role: 'COLLABORATOR'}}),
            prisma.invite.update({where: {id: inviteId }, data: {status: 'ACCEPTED'}})
        ]) 
    }
}