import { Request, Response } from "express";
import prisma from "../../prisma/client";
import { Project, Task } from "@prisma/client";

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
    // createTask: async (
    //     req: Request,
    //     res: Response,
    //     body: {
    //         title: string;
    //         description: string;
    //         status: string;
    //         priority: string;
    //         tags: string[];
    //         startDate: Date;
    //         dueDate: Date;
    //         points: number;
    //         projectId: number;
    //         authorUserId: number;
    //         assignedUserId: number;
    //     }
    // ): Promise<void> => {
    //     const {
    //         title,
    //         description,
    //         status,
    //         priority,
    //         tags,
    //         startDate,
    //         dueDate,
    //         points,
    //         projectId,
    //         authorUserId,
    //         assignedUserId,
    //     } = body;
    //     const newTask = await prisma.task.create({
    //         data: {
    //             title,
    //             description,
    //             status,
    //             priority,
    //             tags,
    //             startDate,
    //             dueDate,
    //             points,
    //             projectId,
    //             authorUserId,
    //             assignedUserId,
    //         },
    //     });
    //     return res.status(201).json(newTask || []);
    // },

    // updateTaskStatus: async (
    //     req: Request,
    //     res: Response,
    //     body: { status: string }
    // ): Promise<void> => {
    //     const { taskId } = req.params;
    //     const { status } = body;
    //     const updatedTask = await prisma.task.update({
    //         where: {
    //             id: Number(taskId),
    //         },
    //         data: {
    //             status: status,
    //         },
    //     });
    //     return res.json(updatedTask || []);
    // },

    // getUserTasks: async (
    //     req: Request,
    //     res: Response
    // ): Promise<void> => {
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