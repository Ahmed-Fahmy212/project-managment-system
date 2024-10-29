import { Request, Response } from "express";
import prisma from '../../../prisma/client'
import { BadRequestException } from "../../exceptions/BadRequestException";
import { StatusCodes, ReasonPhrases } from 'http-status-codes'
import { Project } from "@prisma/client";
import response from "../../util/responce";
interface ProjectData {
  name: string;
  description: string;
  startDate: Date;
  endDate: Date;
}

export const getProjects = async (
  req: Request,
  res: Response
): Promise<Project> => {
  const projects = await prisma.project.findMany();
  return response.success(res, projects);
};

export const createProject = async (
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
  res.json(newProject);
};