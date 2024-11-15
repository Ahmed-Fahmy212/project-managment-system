import { z } from 'zod';

export const TaskDataSchema = z.object({
    title: z.string(),
    projectId: z.number(),
    authorUserId: z.number(),
    columnId: z.number(),

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
    columnId: z.number().optional(),
    activeTaskId: z.number().optional(),
    newOrder: z.array(z.object({
        id: z.number(),
        order: z.number(),
    })),
});
