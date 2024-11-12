import { z } from 'zod';

export const ColumnDataSchema = z.object({
    title: z.string(),
    color: z.string(),
    projectId: z.number(),
});

export const UpdatedColumnData = ColumnDataSchema.partial().extend({
    fromPlace: z.number(),
    toPlace: z.number(),
    updatedBy: z.string(),
});
export const DeleteColumnData = z.object({
    deletedById: z.string(),
});

