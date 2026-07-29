import { placeService } from "./placeService.js";
import { CreatePlaceSchema, UpdatePlaceSchema } from "./placeSchema.js";
import z from "zod";

export async function CreatePlace(input: unknown, tripId: string){
    const parsed = CreatePlaceSchema.safeParse(input);

    if(!parsed.success) return { error: z.treeifyError(parsed.error) }

    try{
        const result = await placeService.create(parsed.data, tripId);
        return { data: result }
    }catch(err){
        if(err instanceof Error) return { error: err.message }
        return { error: 'Failed to create place.'}
    }
}

export async function UpdatePlace(input: unknown, placeId: string, tripId: string){
    const parsed = UpdatePlaceSchema.safeParse(input);
    if(!parsed.success) return { error: z.treeifyError(parsed.error) };

    try{
        const result = await placeService.update(parsed.data, placeId, tripId);
        return { data: result };
    }catch(err){
        if(err instanceof Error) return { error: err.message };
        return { error: 'Failed to update place'}
    }
}

export async function DeletePlace(placeId: string, tripId: string){
    try{
        await placeService.delete(placeId, tripId);
        return { data: 'Place deleted successfully' }
    }catch(err){
        if(err instanceof Error) return { error: err.message }
        return { error: 'Failed to delete place'};
    }
}

export async function GetById(placeId: string){
    try{
        const place = await placeService.getById(placeId);
        return { data: place }
    }catch(err){
        if(err instanceof Error) return {error: err.message}
        return { error: 'Failed to find the place'}
    }
}

export async function GetAllByTrip(tripId: string){
    try{
        const places = await placeService.getAllByTrip(tripId);
        return { data: places }
    }catch(err){
        if(err instanceof Error) return {error: err.message};
        return { error: 'Failed to get placed of the trip'}
    }
}