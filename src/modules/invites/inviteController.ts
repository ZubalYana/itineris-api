import { CreateInviteSchema } from "./inviteSchema.js";
import { inviteService } from "./inviteService.js";
import z from "zod";

export async function CreateInvite(input: unknown, userId: string, tripId: string, userEmail: string){
    const parsed = CreateInviteSchema.safeParse(input);

    if(!parsed.success) return { error: z.treeifyError(parsed.error)}

    try{
    const invite = await inviteService.create(parsed.data, tripId, userId, userEmail);
    return {data:invite};
    }catch(err){
        if(err instanceof Error) return { error: err.message }
        return { error: 'Error creating the invite'}
    }
}