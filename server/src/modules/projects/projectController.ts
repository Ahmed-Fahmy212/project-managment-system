import { Request, Response } from "express";
import prisma from '../../../prisma/client'
// convert this into a controller
// move db to service layer 
// move validation to middleware

export const getProjects = async (
  req: Request,
  res: Response
): Promise<void> => {
  const projects = await prisma.project.findMany();
  res.json(projects);
};

export const createProject = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { name, description, startDate, endDate } = req.body;
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
