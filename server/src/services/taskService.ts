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
    ): Promise<{ previouseTaskData: Task, targetTaskData: Task }> => {
        const { targetTaskId, previouseTaskId, previouseTaskOrder, previousColumnId, targetColumnId } = body;
        const updatedTask = await prisma.$transaction(async (trx) => {
            const targetTaskOrder = await trx.task.findUniqueOrThrow({
                where: {
                    id: targetTaskId,
                },
            });
            if (targetColumnId) {
                const updateTargetTaskColumn = await trx.task.update({
                    where: {
                        id: targetTaskId,
                        columnId: targetColumnId,
                    },
                    data: {
                        columnId: previousColumnId,
                        order: previouseTaskOrder,
                    },
                });
                const updatePreviouseTaskColumn = await trx.task.update({
                    where: {
                        id: previouseTaskId,
                        columnId: previousColumnId,
                    },
                    data: {
                        columnId: targetColumnId,
                        order: targetTaskOrder.order,
                    },
                });
                return { targetTaskData: updateTargetTaskColumn, previouseTaskData: updatePreviouseTaskColumn };
            }
            const targetTaskData = await trx.task.update({
                where: {
                    id: targetTaskId,
                },
                data: {
                    order: previouseTaskOrder,

                },
            })
            const previouseTaskData = await trx.task.update({
                where: {
                    id: previouseTaskId,
                },
                data: {
                    order: targetTaskOrder.order,
                },
            })
            return { targetTaskData, previouseTaskData };
        }
        )
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