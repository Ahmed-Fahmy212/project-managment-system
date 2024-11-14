import { z } from 'zod';

export const ColumnDataSchema = z.object({
    title: z.string(),
    color: z.string(),
    projectId: z.number(),
});

export const UpdatedColumnData = ColumnDataSchema.partial().extend({
    newOrder: z.array(z.object({
        id: z.number(),
        order: z.number(),
    })),
    projectId: z.number()
});
export const DeleteColumnData = z.object({
    deletedById: z.string(),
});

