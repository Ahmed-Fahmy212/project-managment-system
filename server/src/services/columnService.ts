import { Request, Response } from "express";
import prisma from "../../prisma/client";
import { Cloumn, Project, Task } from "@prisma/client";
import zod from "zod";
import { TaskDataSchema, UpdatedTaskData } from "../types/tasks.zod";
import { NotFoundException } from "../exceptions/NotFoundException";


export const ColumnService = {
    getColumnWithTasks: async (projectId: number): Promise<Cloumn[]> => {
        const data = await prisma.cloumn.findMany({
            where: {
                projectId: projectId,
            },
            include: {
                task: true,
            },
        });
        return data || [];
    },

}