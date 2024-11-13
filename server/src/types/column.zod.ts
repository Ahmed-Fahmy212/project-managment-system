import { z } from 'zod';

export const ColumnDataSchema = z.object({
    title: z.string(),
    color: z.string(),
    projectId: z.number(),
});

export const UpdatedColumnData = ColumnDataSchema.partial().extend({
    projectId: z.number(),
    
    previouseColumnId: z.number(),
    targetColumnId: z.number(),
    previoueColumnOrder: z.number(),
});
export const DeleteColumnData = z.object({
    deletedById: z.string(),
});

