import { z } from 'zod';

export const TaskDataSchema = z.object({
    title: z.string(),
    projectId: z.number(),
    authorUserId: z.number(),
    
    description: z.string().optional(),
    tags: z.string().optional(),
    startDate: z.coerce.date().optional(),
    dueDate: z.coerce.date().optional(),
    status: z.string().optional(),
    priority: z.string().optional(),
    points: z.number().optional(),
    assignedUserId: z.number().optional(),

    // nextTaskId: z.number().optional(),
    // prevTaskId: z.number().optional(),
});

export const UpdatedTaskData = TaskDataSchema.partial().extend({
    targetPreviousTaskId: z.number().optional(),
    //TODO add upodate in schema
    // updatedBy: z.number().optional()
});
