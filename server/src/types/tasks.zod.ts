import { z } from 'zod';

export const TaskDataSchema = z.object({
    title: z.string(),
    projectId: z.number(),
    authorUserId: z.number(),
    columnId : z.number(),
    
    description: z.string().optional(),
    tags: z.string().optional(),
    startDate: z.coerce.date().optional(),
    dueDate: z.coerce.date().optional(),
    status: z.string().optional(),
    priority: z.string().optional(),
    points: z.number().optional(),
    assignedUserId: z.number().optional(),
});

export const UpdatedTaskData = TaskDataSchema.partial().extend({
    projectId: z.number(),
    targetTaskId: z.number(),
    previouseTaskId: z.number(),
    previouseTaskOrder: z.number(),

    targetColumnId: z.number().optional(),
    previousColumnId: z.number().optional(),
}).refine(data => {
    const allRequired = data.targetTaskId !== undefined && data.previouseTaskId !== undefined && data.previouseTaskOrder !== undefined;
    const allOptional = data.targetTaskId === undefined && data.previouseTaskId === undefined && data.previouseTaskOrder === undefined;
    return allRequired || allOptional;
}, {
    message: "All of targetTaskId, previouseTaskId, and previouseTaskOrder must be either provided or omitted together."
});
