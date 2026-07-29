import { tripRepository } from "./tripRepository.js";
import type { CreateTripDTO, UpdateTripDTO } from "./tripsSchema.js";

export const tripService = {
  async create(data: CreateTripDTO, userId: string){
    const trip = await tripRepository.create(data);
    await tripRepository.createMember(userId, trip.id, 'OWNER');
    return trip;
  },

  async getById(tripId: string){
    return await tripRepository.findById(tripId);
  },

  async update(data: UpdateTripDTO, tripId: string){
    const trip = await tripRepository.findById(tripId);
    if (!trip) {
      throw new Error('Trip not found');
    }
    return tripRepository.update(data, tripId);
  },

  async delete(tripId: string){
    const trip = await tripRepository.findById(tripId);
    if (!trip) {
      throw new Error('Trip not found');
    }
    return tripRepository.delete(tripId);
  },

  async getMyTrips(userId: string){
   return tripRepository.findAllForUser(userId);
  }
}