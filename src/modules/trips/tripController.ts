import { tripService } from "./tripService.js";
import { TripSchema, UpdateTripSchema } from "./tripsSchema.js";
import z from "zod";

export async function CreateTrip(input: unknown, userId: string){
    const parsed = TripSchema.safeParse(input);
    if(!parsed.success) return { error: z.treeifyError(parsed.error) }

    try{
        const result = await tripService.create(parsed.data, userId);    
        return { data: result }
    }catch(err){
        if(err instanceof Error) return { error: err.message };
        return { error: 'Error creating trip'};
    }
}

export async function GetTripById(tripId: string){
    try{
        const result = await tripService.getById(tripId);
        return { data: result }
    }catch(err){
        if(err instanceof Error) return {error: err.message};
        return { error: 'Error getting your trip'}
    }
}

export async function UpdateTrip(input: unknown, tripId: string){
    const parsed = UpdateTripSchema.safeParse(input);
    if(!parsed.success) return { error: z.treeifyError(parsed.error) }

    try{
        const result = await tripService.update(parsed.data, tripId);
        return { data: result }
    }catch(err){
        if ( err instanceof Error ) return { error: err.message }
        return { error: 'Error updating trip'}
    }
}

export async function DeleteTrip(tripId: string){
    try{
        await tripService.delete(tripId);
        return { data: { message: 'Trip deleted successfully' } };
    }catch(err){
        if(err instanceof Error) return { error: err.message }
        return { error: 'Error deleting trip'}
    }
}

export async function GetMyTrips(userId: string){
  try{
    const trips = await tripService.getMyTrips(userId);
    return { data: trips };
  }catch(err){
    if(err instanceof Error) return { error: err.message };
    return { error: 'Error fetching trips' };
  }
}