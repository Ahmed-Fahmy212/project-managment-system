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
    ): Promise<{ previouseTaskData: Task[], targetTaskData: Task[] }> => {
        const { newOrderPrev, newOrderTarget, projectId, columnId } = body;
        // there is better way handle this 
        const updatedTask = await prisma.$transaction(async (trx) => {
            let tasksPrev: Task[] = [], tasksTarge: Task[] = [];
            for (let i = 0; i < newOrderPrev.length; i++) {
                const updatedPrevTask = await trx.task.update({
                    where: {
                        id: newOrderPrev[i].id,
                        projectId: projectId,
                    },
                    data: {
                        order: newOrderPrev[i].order,
                        columnId: columnId,
                    },
                });
                tasksPrev.push(updatedPrevTask);
                if (columnId && newOrderTarget && newOrderTarget[i]) {
                    const updatedTargetTask = await trx.task.update({
                        where: {
                            id: newOrderTarget[i].id,
                            projectId: projectId,
                        },
                        data: {
                            order: newOrderTarget[i].order,
                            columnId: columnId,
                        },
                    });
                    tasksTarge.push(updatedTargetTask);
                }
            }
            const orderedTasksPrev = tasksPrev.sort((a, b) => a.order - b.order);
            const orderedTasksTarget = tasksTarge.sort((a, b) => a.order - b.order);
            return { previouseTaskData: orderedTasksPrev || [], targetTaskData: orderedTasksTarget || [] };

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