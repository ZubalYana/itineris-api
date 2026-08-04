import crypto from "crypto";
import { inviteRepository } from "./inviteRepository.js";
import type { CreateInviteDTO } from "./inviteSchema.js";
import { Prisma } from "@prisma/client";
import getResend from "../../config/resend.js";
import { env } from "../../config/env.js";

export const inviteService = {
  async create(
    data: CreateInviteDTO,
    tripId: string,
    userId: string,
    inviterEmail: string
  ) {
    if (data.invitedEmail === inviterEmail) {
      throw new Error("You can't invite yourself");
    }
    const resend = getResend();
    const token = crypto.randomBytes(32).toString("hex");
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);
    try {
      const invite = await inviteRepository.create(
        data,
        tripId,
        userId,
        token,
        expiresAt
      );

      const link = `${env.FRONTEND_URL}/pending-invite?token=${token}`;

      await resend.emails.send({
        from: "Itineris <invite@librex.pictureboooks.homes>",
        to: data.invitedEmail,
        subject: "You've been invited to collaborate on a trip!",
        html: `
          <p>You've been invited to collaborate on a trip in Itineris.</p>
          <p><a href="${link}">Click here to accept the invite</a></p>
          <p>This link expires in 24 hours.</p>
        `,
      });

      return invite;
    } catch (err) {
      if (
        err instanceof Prisma.PrismaClientKnownRequestError &&
        err.code === "P2002"
      ) {
        throw new Error(
          "An active invite already exists for this email on this trip"
        );
      }
      throw err;
    }
  },

  async decline(token: string){
    if(!token){
        throw new Error('No invite token provided');
    }
    return await inviteRepository.decline(token);
  },

async cancel(id: string, requestingUserId: string) {
  if (!id) throw new Error('Id not provided');

  const invite = await inviteRepository.findById(id);
  if (!invite) throw new Error('Invite not found');
  if (invite.invitedById !== requestingUserId) {
    throw new Error('You do not have permission to cancel this invite');
  }

  return await inviteRepository.cancel(id);
},

async accept(token: string, userId: string, userEmail: string){
  if(!token){
    throw new Error('No invite token provided');
  }

  const invite = await inviteRepository.findInvite(token);
  if(!invite){
    throw new Error('Invite not found');
  }
  if(invite.status !== 'PENDING'){
    throw new Error('Invite is no longer valid');
  }
  if(invite.expiresAt < new Date()){
    throw new Error('Invite has expired');
  }
  if (invite.invitedEmail !== userEmail) {
  throw new Error('This invite was not sent to your account');
   }

  return inviteRepository.accept(invite.tripId, userId, invite.id);
}
};
