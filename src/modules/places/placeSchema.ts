import z from 'zod';

export const CreatePlaceSchema = z.object({
    locationName: z.string().min(1).max(150),
    notes: z.string().max(500).optional(),
    dayNumber: z.number().int().min(1)
});

export type CreatePlaceDTO = z.infer<typeof CreatePlaceSchema>;
export const UpdatePlaceSchema = CreatePlaceSchema.partial();
export type UpdatePlaceDTO = z.infer<typeof UpdatePlaceSchema>;