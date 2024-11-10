import { NextFunction, Request, Response } from "express";
import { BadRequestException } from "../exceptions/BadRequestException";
import { Project } from "@prisma/client";
import response from "../util/responce";
import { ProjectBody, UpdateProjectBody } from "../types/project";
import { ProjectService } from "../services";
import zod from 'zod'
export const projects = {
  getProjects: async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const projects = await ProjectService.getAllProjects();
      response.success(res, projects);
    } catch (err) {
      next(err);
    }
  },

  getOneProject: async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const { id } = req.params;
      if (!id) {
        throw new BadRequestException("Missing required field: id");
      }
      const project = await ProjectService.getProjectById(parseInt(id));
      response.success(res, project);
    } catch (err) {
      next(err);
    }
  },

  createProject: async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const validatedData = ProjectBody.parse(req.body);
      const createdProject = await ProjectService.createProject(validatedData);
      response.success(res, createdProject);
    } catch (err) {
      next(err);
    }
  },

  updateProject: async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const { id } = req.params;
      const body: zod.infer<typeof UpdateProjectBody> = req.body;
      const project = await ProjectService.updateProject(parseInt(id), body);
      response.success(res, project);
    } catch (err) {
      next(err);
    }
  },

  deleteProject: async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const { id } = req.params;
      if (!id) {
        throw new BadRequestException("Missing required field: id");
      }
      const project = await ProjectService.deleteProject(parseInt(id));
      if (project === null) {
        response.success(res, { data: "Project deleted successfully" });
      }
      throw new BadRequestException("Project didn't delete");
    } catch (err) {
      next(err);
    }
  }
}

export default projects;