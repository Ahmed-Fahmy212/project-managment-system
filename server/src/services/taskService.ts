import { Request, Response } from "express";
import prisma from "../../prisma/client";
import { Project, Task } from "@prisma/client";
import zod from "zod";
import { TaskDataSchema, UpdatedTaskData } from "../types/tasks.zod";
import { NotFoundException } from "../exceptions/NotFoundException";
import { BadRequestException } from "../exceptions/BadRequestException";


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
            orderBy: {
                order: 'desc'
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
    ): Promise<{ newOrderedTasks: Task[] }> => {
        const { newOrder, projectId, columnId, activeTaskId: taskIdToMove } = body;
        if (taskIdToMove && !columnId || columnId && !taskIdToMove) {
            throw new BadRequestException(`Missing required field: ${columnId ? "Task Id" : "Column Id"} `);
        }
        try {
            const fields = ["id", "order"];
            const taskValues = newOrder.map((task) => [task.id, task.order]);
            // flages crash ?
            let taskCounter = 0;
            let i = 0;
            const taskValuesSql = taskValues
                .map((row) => `(${row.map(() => `\$${++i}`).join(", ")})`)
                .join(", ");

            const otherTasksSql = `
            WITH locked_tasks AS (
            SELECT "id"
            FROM "Task"
            WHERE "projectId" = $${++i}
            FOR UPDATE
            )
            UPDATE "Task"
            SET "order" = t."order"
            FROM (VALUES ${taskValuesSql}) AS t(${fields.map((f) => `"${f}"`).join(", ")})
            WHERE "Task"."id" = t."id" AND "Task"."id" IN (SELECT "id" FROM locked_tasks)
            RETURNING "Task".*;
            `;
            //!not working here + see this lock 
            let j = 0;
            const activeTaskSql = `
            WITH locked_task AS (
            SELECT "id"
            FROM "Task"
            WHERE "id" = $${++j} AND "projectId" = $${++j}
            FOR UPDATE
            )
            UPDATE "Task"
            SET "columnId" = $${++j}
            WHERE "id" IN (SELECT "id" FROM locked_task)
            RETURNING "Task".*;
            `;


            const updatedTasks = await prisma.$transaction([
                prisma.$queryRawUnsafe(otherTasksSql, ...taskValues.flat(), projectId),
                ...(taskIdToMove && columnId
                    ? [prisma.$queryRawUnsafe(activeTaskSql, columnId, taskIdToMove, projectId)]
                    : []),
            ]);
            const newOrderedTasks = (taskIdToMove && columnId) ? (updatedTasks[1] as Task[]).flat() : (updatedTasks as Task[]).flat();
            return { newOrderedTasks };
        } catch (error) {
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