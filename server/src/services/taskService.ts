import { Request, Response } from "express";
import prisma from "../../prisma/client";
import { Project, Task } from "@prisma/client";
import zod from "zod";
import { TaskDataSchema, UpdatedTaskData } from "../types/tasks.zod";
import { NotFoundException } from "../exceptions/NotFoundException";


export const TaskService = {
    getTasks: async (projectId: number): Promise<Task[]> => {
        const tasks = await prisma.task.findMany({
            where: {
                projectId: projectId,
            },
            include: {
                author: true,
                assignee: true,
                comments: true,
                attachments: true,
            },
        });
        return tasks || [];
    },
    getOneTask: async (taskId: number, projectId: number): Promise<Task | null> => {
        const task = await prisma.task.findUnique({
            where: {
                id: Number(taskId), projectId: projectId,

            },
            include: {
                author: true,
                assignee: true,
                comments: true,
                attachments: true,
            },
        });
        return task;
    },
    createTask: async (
        body: zod.infer<typeof TaskDataSchema>
    ) => {
        const newTask = await prisma.task.create({
            data: body
        });
        if (!newTask) {
            throw new NotFoundException("Task didn`t created");
        }
        return newTask;
    },

    updateTaskStatus: async (
        taskId: number,
        body: zod.infer<typeof UpdatedTaskData>
    ) => {
        const Task = await prisma.task.findUnique({
            where: {
                id: taskId,
            },
        });
        if (Task?.status === body.status) {
            return Task;
            }
        const updatedTask = await prisma.task.update({
            where: {
                id: Number(taskId),
            },
            data: {
                status: body.status,
                updatedAt: new Date(),
            },
        });
        return updatedTask;
    
    }
    // getUserTasks: async (
    //     req: Request,
    //     res: Response
    // ) => {
    //     const { userId } = req.params;
    //     const tasks = await prisma.task.findMany({
    //         where: {
    //             OR: [
    //                 { authorUserId: Number(userId) },
    //                 { assignedUserId: Number(userId) },
    //             ],
    //         },
    //         include: {
    //             author: true,
    //             assignee: true,
    //         },
    //     });
    //     return res.json(tasks || []);
    // },
}