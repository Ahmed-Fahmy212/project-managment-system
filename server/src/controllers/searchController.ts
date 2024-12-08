import { Request, Response } from "express";

import prisma from '../../prisma/client'
export const search = async (req: Request, res: Response): Promise<void> => {
  try {
    const { query } = req.query;
    const tasks = await prisma.task.findMany({
      where: {
        OR: [
          { title: { contains: query as string } },
          { description: { contains: query as string } },
        ],
      },
    });

    const projects = await prisma.project.findMany({
      where: {
        OR: [
          { name: { contains: query as string } },
          { description: { contains: query as string } },
        ],
      },
    });

    const users = await prisma.user.findMany({
      where: {
        OR: [{ username: { contains: query as string } }],
      },
    });

    res.json({
      tasks: tasks.length > 0 ? tasks : null,
      projects: projects.length > 0 ? projects : null,
      users: users.length > 0 ? users : null,
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};
