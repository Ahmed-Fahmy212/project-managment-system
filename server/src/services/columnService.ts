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

    updateColumn: async (data: zod.infer<typeof UpdatedColumnData>): Promise<Column[]> => {
        const { projectId, newOrder: columns } = data;
        try {
            const updatedColumns = await prisma.$transaction(async (trx) => {
                const values = columns
                    .map((col) => `(${col.id}, ${col.order})`)
                    .join(", ");
                const columnSQL = `
                    UPDATE "Cloumn"
                    SET "order" = "t"."order"
                    FROM (VALUES ${values}) AS "t"("id", "order")
                    WHERE "Cloumn"."id" = "t"."id" AND "Cloumn"."projectId" = ${projectId}
                    RETURNING "Cloumn".*;
                `;
                const updatedColumns = await trx.$queryRawUnsafe(columnSQL);
                return updatedColumns as Column[];
            });

            return updatedColumns;
        } catch (err) {
            console.log(err);
            throw new NotFoundException("Column not updated");
        }
    },

    async deleteColumn(id: number): Promise<Column> {
        return await prisma.cloumn.update({ where: { id }, data: { deletedAt: new Date(), deletedById: id } });
    },
}