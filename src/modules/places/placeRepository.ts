import type { CreatePlaceDTO, UpdatePlaceDTO } from "./placeSchema.js";
import prisma from "../../config/db.js";

export const placeRepository = {
    async create(data: CreatePlaceDTO, tripId: string){
        return await prisma.place.create({data: {...data, tripId}})
    },

    async update(data: UpdatePlaceDTO, placeId: string){
        return await prisma.place.update({where: {id: placeId}, data});
    },

    async delete(placeId: string){ //is there even a need to pass tripId in here?
        return await prisma.place.delete({where: {id: placeId}});
    },

    async getById(placeId: string){
        return await prisma.place.findUnique({where: {id: placeId}});
    },

    async getAllByTrip(tripId: string){
        return await prisma.place.findMany({where: {tripId}});
    }
}