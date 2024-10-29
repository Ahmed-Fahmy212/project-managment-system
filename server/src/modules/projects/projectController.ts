import { Request, Response } from "express";
import prisma from '../../../prisma/client'
import { BadRequestException } from "../../exceptions/BadRequestException";
import { StatusCodes, ReasonPhrases } from 'http-status-codes'
import { Project } from "@prisma/client";
import response from "../../util/responce";
import { ProjectData } from "../../interface/interface";

const projects = {
  getProjects: async (
    req: Request,
    res: Response
  ): Promise<any> => {
    const projects = await prisma.project.findMany();
    return response.success(res, projects);
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
  }
}

export default projects;