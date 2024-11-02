import { Request, Response } from "express";
import prisma from '../../prisma/client'
import { BadRequestException } from "../exceptions/BadRequestException";
import { StatusCodes, ReasonPhrases } from 'http-status-codes'
import { Task } from "@prisma/client";
import response from "../util/responce";
import { TaskData } from "../interface/interface";
import { TaskService } from "../services";

export const tasks = {
  getTasks: async (
    req: Request,
    res: Response
  ): Promise<void> => {
    const { projectId } = req.params;
    const tasks = await TaskService.getTasks(parseInt(projectId));
    response.success(res, tasks);
  },

  getOneTask: async (
    req: Request,
    res: Response
  ): Promise<void> => {
    const { projectId } = req.params;
    const { taskId } = req.params;
    if (!projectId || !taskId) {
      throw new BadRequestException(` Missing required field: ${projectId} ${taskId}`);
    }
    const project = await TaskService.getOneTask(parseInt(taskId), parseInt(projectId));
    response.success(res, project);
  },

  // createTask: async (
  //   req: Request,
  //   res: Response
  // ): Promise<void> => {
  //   const data: TaskData = req.body;
  //   const { id, ...taskData } = data
  //   const newTask = await prisma.project.create({
  //     data: {
  //       ...taskData,
  //       name: data.title,
  //     },
  //   });
  //   response.created(res, newTask);
  // },
  // updateTask: async (
  //   req: Request,
  //   res: Response
  // ): Promise<void> => {
  //   const { id } = req.params;
  //   const { name, description, startDate, endDate }: Partial<TaskData> = req.body;
  //   const project = await TaskService.updateTask(parseInt(id), { name, description, startDate, endDate });
  //   response.success(res, project);
  // },
  // deleteTask: async (
  //   req: Request,
  //   res: Response
  // ): Promise<void> => {
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

export default tasks;