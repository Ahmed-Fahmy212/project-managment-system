import { Request, Response } from 'express';
import { BadRequestException } from '../exceptions/BadRequestException';
import response from '../util/responce';
import { ColumnService } from '../services/columnService';


export const columns = {
    getColumnsWithTasks: async (
        req: Request,
        res: Response,
    ): Promise<void> => {
        const projectId = req.params.projectId;
        const parsedProjectId = parseInt(projectId);
        if (!projectId) {
            throw new BadRequestException("Invalid or missing required field: projectId");
        }
        const columns = await ColumnService.getColumnWithTasks(parsedProjectId);
        response.success(res, columns);
    }
}