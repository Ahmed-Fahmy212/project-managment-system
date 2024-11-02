import { Request, Response } from "express";
import prisma from '../../prisma/client'
import { BadRequestException } from "../exceptions/BadRequestException";
import { StatusCodes, ReasonPhrases } from 'http-status-codes'
import { Project } from "@prisma/client";
import response from "../util/responce";
import { ProjectData } from "../interface/interface";
import { ProjectService } from "../services";

export const projects = {
  getProjects: async (
    req: Request,
    res: Response
  ): Promise<void> => {
    const projects = await ProjectService.getAllProjects();
    response.success(res, projects);
  },

  getOneProject: async (
    req: Request,
    res: Response
  ): Promise<void> => {
    const { id } = req.params;
    if (!id) {
      throw new BadRequestException("Missing required field: id");
    }
    const project = await ProjectService.getProjectById(parseInt(id));
    response.success(res, project);
  },

  createProject: async (
    req: Request,
    res: Response
  ): Promise<void> => {
    const { name, description, startDate, endDate }: ProjectData = req.body;
    if (!name || !description || !startDate || !endDate) {
      throw new BadRequestException(`Missing required fields ${name ? "" : "name"} ${description ? "" : "description"} ${startDate ? "" : "startDate"} ${endDate ? "" : "endDate"}`);
    }
    const newProject = await prisma.project.create({
      data: {
        name,
        description,
        startDate,
        endDate,
      },
    });
    response.created(res, newProject);
  },
  updateProject: async (
    req: Request,
    res: Response
  ): Promise<void> => {
    const { id } = req.params;
    const { name, description, startDate, endDate }: Partial<ProjectData> = req.body;
    const project = await ProjectService.updateProject(parseInt(id), { name, description, startDate, endDate });
    response.success(res, project);
  },
  deleteProject: async (
    req: Request,
    res: Response
  ): Promise<void> => {
    const { id } = req.params;
    if (!id) {
      throw new BadRequestException("Missing required field: id");
    }
    const project = await ProjectService.deleteProject(parseInt(id));
    if (project === null) {
      response.success(res, { data: "Project deleted successfully" });
    }
    throw new BadRequestException("Project didn`t deleted");
  }
}

export default projects;