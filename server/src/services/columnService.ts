import { Request, Response } from "express";
import prisma from "../../prisma/client";
import { Cloumn as Column } from "@prisma/client";
import zod from "zod";
import { TaskDataSchema, UpdatedTaskData } from "../types/tasks.zod";
import { NotFoundException } from "../exceptions/NotFoundException";
import { ColumnDataSchema, UpdatedColumnData } from "../types/column.zod";
export const ColumnService = {
    getAllColumns: async (): Promise<Column[]> => {
        return await prisma.cloumn.findMany({ orderBy: { order: 'asc' } });
    },

    getColumnWithTasks: async (projectId: number): Promise<Column[]> => {
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

    async getColumnById(id: number): Promise<Column | null> {
        return await prisma.cloumn.findUnique({ where: { id } });
    },

    async createColumn(data: zod.infer<typeof ColumnDataSchema>): Promise<Column> {
        const CreatedColumn = await prisma.cloumn.create({ data });
        if (!CreatedColumn) {
            throw new NotFoundException("Column not created");
        }
        return CreatedColumn;
    },

    updateColumn: async (data: zod.infer<typeof UpdatedColumnData>): Promise< Column[] > => {
        const { projectId, newOrder: columns } = data;
        const updatedColumns = await prisma.$transaction(async (trx) => {
            // will fuck pools but will handle it later in sql
            // and remove this and make update only for changed columns d
            return Promise.all(
                columns.map(({ id, order }) =>
                    trx.cloumn.update({
                        where: { id, projectId },
                        data: { order },
                    })
                )
            );
        });
    
        return updatedColumns ;
    },

    async deleteColumn(id: number): Promise<Column> {
        return await prisma.cloumn.update({ where: { id }, data: { deletedAt: new Date(), deletedById: id } });
    },
}