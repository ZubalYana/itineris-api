import { placeRepository } from "./placeRepository.js";
import type { CreatePlaceDTO, UpdatePlaceDTO } from "./placeSchema.js";

export const placeService = {
  async create(data: CreatePlaceDTO, tripId: string) {
    return placeRepository.create(data, tripId);
  },

  async update(data: UpdatePlaceDTO, placeId: string, tripId: string) {
    const place = await placeRepository.getById(placeId);
    if (!place) {
      throw new Error("Place not found");
    }
    if (place?.tripId !== tripId) {
      throw new Error("Place doesn't belong to that trip");
    }
    return placeRepository.update(data, placeId);
  },

  async delete(placeId: string, tripId: string) {
    const place = await placeRepository.getById(placeId);
    if (!place) {
      throw new Error("Place not found");
    }
    if (place?.tripId !== tripId) {
      throw new Error("Place doesn't belong to that trip");
    }
    return placeRepository.delete(placeId);
  },

  async getById(placeId: string) {
    return await placeRepository.getById(placeId);
  },

  async getAllByTrip(tripId: string) {
    return await placeRepository.getAllByTrip(tripId);
  },
};
