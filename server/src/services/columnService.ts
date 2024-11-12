import { Request, Response } from "express";
import prisma from "../../prisma/client";
import { Cloumn as Column } from "@prisma/client";
import zod from "zod";
import { TaskDataSchema, UpdatedTaskData } from "../types/tasks.zod";
import { NotFoundException } from "../exceptions/NotFoundException";
import { ColumnDataSchema, UpdatedColumnData } from "../types/column.zod";
export const ColumnService = {
    getAllColumns: async (): Promise<Column[]> => {
        return await prisma.cloumn.findMany();
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

    updateColumn: async (data: zod.infer<typeof UpdatedColumnData>): Promise<{ previousColData: Column, TargetColData: Column }> =>{
        const { fromPlace: previousId, toPlace: targetId } = data;
        // use in front optimistic update for poor connection 
        const [updatedColumns] = await prisma.$transaction(async (trx) => {
            const previousColumn = await trx.cloumn.findFirstOrThrow({
                where: { id: previousId },
                select: { order: true },
            });

            const targetColumn = await trx.cloumn.findFirstOrThrow({
                where: { id: targetId },
                select: { order: true },
            });

            if (!previousColumn || !targetColumn) {
                throw new NotFoundException("Column not found");
            }

            const previousColData = await trx.cloumn.update({
                where: { id: previousId },
                data: { order: targetColumn.order },
            });
            const TargetColData = await trx.cloumn.update({
                where: { id: targetId },
                data: { order: previousColumn.order },
            });
            return [{ previousColData, TargetColData }];
        });
        if (!updatedColumns) {
            throw new NotFoundException("Column not updated");
        }
        return updatedColumns;
    },

    async deleteColumn(id: number): Promise<Column> {
        return await prisma.cloumn.update({ where: { id }, data: { deletedAt: new Date(), deletedById: id } });
    },
}