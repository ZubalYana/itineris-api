import prisma from "../../config/db.js";
import type { CreateTripDTO, UpdateTripDTO } from "./tripsSchema.js";

export const tripRepository = {
    async create(data: CreateTripDTO){
        const trip = await prisma.trip.create({data});
        return trip;
    },

    async update(data: UpdateTripDTO, tripId: string){
        const updatedTrip = await prisma.trip.update({where: {id: tripId}, data})
        return updatedTrip;
    },

    async delete(tripId: string){
        return await prisma.trip.delete({where: {id: tripId}});

    }
}