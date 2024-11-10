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
});