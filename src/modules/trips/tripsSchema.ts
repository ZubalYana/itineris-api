import z from 'zod';

const BaseTripSchema = z.object({
  title: z.string().min(1).max(120),
  description: z.string().max(500).optional(),
  startDate: z.coerce.date().optional(),
  endDate: z.coerce.date().optional(),
});

export const TripSchema = BaseTripSchema.refine(
  (data) => !data.startDate || !data.endDate || data.startDate <= data.endDate,
  { message: 'startDate must be before or equal to endDate', path: ['endDate'] }
);
export type CreateTripDTO = z.infer<typeof TripSchema>;

export const UpdateTripSchema = BaseTripSchema.partial().refine(
  (data) => !data.startDate || !data.endDate || data.startDate <= data.endDate,
  { message: 'startDate must be before or equal to endDate', path: ['endDate'] }
);
export type UpdateTripDTO = z.infer<typeof UpdateTripSchema>;