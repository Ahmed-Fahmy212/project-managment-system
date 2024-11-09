
import z from "zod";
export const ProjectBody = z.object({
    name: z.string(),
    description: z.string().optional(),
    startDate: z.date().optional(),
    endDate: z.date().optional(),
});

export const UpdateProjectBody = ProjectBody.partial().extend({
    updatedBy: z.string(),
});
