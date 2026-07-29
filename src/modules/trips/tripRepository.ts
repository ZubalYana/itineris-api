import prisma from "../../config/db.js";
import type { CreateTripDTO, UpdateTripDTO } from "./tripsSchema.js";
import type { TripRole } from "@prisma/client";

export const tripRepository = {
    async create(data: CreateTripDTO){
        const trip = await prisma.trip.create({data});
        return trip;
    },

    async createMember(userId: string, tripId: string, userRole: TripRole){
      const member = await prisma.tripMember.create({
        data: { tripId, userId, role: userRole }
      });
      return member;
    },

    async update(data: UpdateTripDTO, tripId: string){
        const updatedTrip = await prisma.trip.update({where: {id: tripId}, data})
        return updatedTrip;
    },

    async delete(tripId: string){
        return await prisma.trip.delete({where: {id: tripId}});

    },

    async findById(tripId: string){
        const trip = await prisma.trip.findUnique({where: {id: tripId}});
        return trip;
    }
}