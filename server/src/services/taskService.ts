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
            orderBy:{
                order:'desc'
            }
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
        const column = await prisma.cloumn.findUnique({
            where: {
                id: body.columnId,
            },
        });
        if (!column) {
            throw new NotFoundException("Column not found in the project");
        }
        const newTask = await prisma.task.create({
            data: body
        });
        if (!newTask) {
            throw new NotFoundException("Task didn`t created");
        }
        return newTask;
        },

        updateTaskStatus: async (
        body: zod.infer<typeof UpdatedTaskData>
        ): Promise<{ previouseTaskData: Task[] }> => {
        const { newOrder, projectId, columnId ,activeTaskId} = body;
        try {
            const updatedTask = await prisma.$transaction(async (trx) => {
            let tasksPrev: Task[] = [];
            for (let i = 0; i < newOrder.length; i++) {
                // will use index better
                if (newOrder[i].id === activeTaskId) {
                    const updatedTask = await trx.task.update({
                        where: {
                            id: newOrder[i].id,
                            projectId: projectId,
                        },
                        data: {
                            order: newOrder[i].order,
                            columnId: columnId,
                        },
                    });
                    tasksPrev.push(updatedTask);
                    continue;
                }
                const updatedPrevTask = await trx.task.update({
                where: {
                    id: newOrder[i].id,
                    projectId: projectId,
                },
                data: {
                    order: newOrder[i].order,
                    // columnId: columnId,
                },
                });
                tasksPrev.push(updatedPrevTask);
            }
            const orderedTasksPrev = tasksPrev.sort((a, b) => a.order - b.order);
            return { previouseTaskData: orderedTasksPrev || [] };
            });
            return updatedTask;
        } catch (error) {
            console.error("Error updating task status:", error);
            throw new Error("Failed to update task status");
        }
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