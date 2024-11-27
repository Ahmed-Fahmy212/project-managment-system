import { Request, Response } from 'express';
import { BadRequestException } from '../exceptions/BadRequestException';
import response from '../util/responce';
import { ColumnService } from '../services/column.service';
import { ColumnDataSchema, UpdatedColumnData } from '../validations/column.zod';


export const columns = {
    getColumnsWithTasks: async (
        req: Request,
        res: Response,
    ): Promise<void> => {
        const projectId = req.params.projectId;
        const parsedProjectId = parseInt(projectId);
        if (!parsedProjectId) {
            throw new BadRequestException("Invalid or missing required field: projectId");
        }
        const columns = await ColumnService.getColumnWithTasks(parsedProjectId);
        response.success(res, columns);
    },
    getColumns: async (
        req: Request,
        res: Response,
    ) => {
        const columns = await ColumnService.getAllColumns();
        response.success(res, columns);
    },

    getOneColumn: async (
        req: Request,
        res: Response,
    ) => {
        const { id } = req.params;
        if (!id) throw new BadRequestException("Missing required field: id");

        const column = await ColumnService.getColumnById(parseInt(id));
        if (!column) throw new BadRequestException("Column not found");

        response.success(res, column);
    },

    createColumn: async (
        req: Request,
        res: Response,
    ) => {
        const validatedData = ColumnDataSchema.parse(req.body);
        const createdColumn = await ColumnService.createColumn(validatedData);
        response.success(res, createdColumn);
    },

    updateColumn: async (
        req: Request,
        res: Response,
    ) => {
        // will update order
        const validatedData = UpdatedColumnData.parse(req.body);
        //TODO calc time and num req for this 
        const updatedColumn = await ColumnService.updateColumn(validatedData);
        response.success(res, updatedColumn);
    },

    deleteColumn: async (req: Request,
        res: Response,) => {
        const { id } = req.params;
        if (!id) throw new BadRequestException("Missing required field: id");

        await ColumnService.deleteColumn(parseInt(id));
        response.success(res, { message: "Column deleted successfully" });
    }

}