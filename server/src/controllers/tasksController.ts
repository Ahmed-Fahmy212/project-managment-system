import { NextFunction, Request, Response } from "express";
import prisma from '../../prisma/client'
import { BadRequestException } from "../exceptions/BadRequestException";
import response from "../util/responce";
import { TaskService } from "../services";
import { TaskDataSchema,UpdatedTaskData } from "../types/tasks.zod";

export const tasks = {
  getTasks: async (
    req: Request,
    res: Response,
  ): Promise<void> => {
    const projectId = req.params.projectId;
    const parsedProjectId = parseInt(projectId);
    if (!parsedProjectId) {
      throw new BadRequestException("Invalid or missing required field: projectId");
    }
    const tasks = await TaskService.getTasks(parsedProjectId);
    response.success(res, tasks);
  }
  ,
  getOneTask: async (
    req: Request,
    res: Response
  ): Promise<void> => {
    const { projectId,taskId } = req.params;
    const parsedProjectId = parseInt(projectId);
    const parsedTaskId = parseInt(taskId);
    if (!parsedTaskId || !parsedProjectId) {
      throw new BadRequestException(` Missing required field: ${parsedProjectId} ${parsedProjectId}`);
    }
    const project = await TaskService.getOneTask(parsedTaskId, parsedProjectId);
    response.success(res, project);
  },

  createTask: async (
    req: Request,
    res: Response
  ): Promise<void> => {
    const data = TaskDataSchema.parse(req.body);
    const newTask = await TaskService.createTask(data);
    response.created(res, newTask);
  },
  // updateTask: async (
  //   req: Request,
  //   res: Response
  // ) => {
  //   const { id } = req.params;
  //   const { name, description, startDate, endDate }: Partial<TaskData> = req.body;
  //   const project = await TaskService.updateTask(parseInt(id), { name, description, startDate, endDate });
  //   response.success(res, project);
  // },
  updateTaskStatus: async (
    req: Request,
    res: Response,
  ): Promise<void> => {
    const body = await UpdatedTaskData.parseAsync(req.body);
    const data = await TaskService.updateTaskStatus(body);
    response.success(res, data);
  }
  // deleteTask: async (
  //   req: Request,
  //   res: Response
  // ) => {
  //   const { id } = req.params;
  //   if (!id) {
  //     throw new BadRequestException("Missing required field: id");
  //   }
  //   const project = await TaskService.deleteTask(parseInt(id));
  //   if (project === null) {
  //     response.success(res, { data: "Task deleted successfully" });
  //   }
  //   throw new BadRequestException("Task didn`t deleted");
  // }
}

