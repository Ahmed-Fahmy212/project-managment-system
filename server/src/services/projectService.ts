import { Project } from '@prisma/client';
import prisma from '../../prisma/client'

export const ProjectService = {
    async createProject(data: Omit<Project, 'id'>): Promise<Project> {
        return await prisma.project.create({
            data,
        });
    }
    ,
    async getProjectById(id: number): Promise<Project | null> {
        return await prisma.project.findUnique({
            where: { id, isDeleted: false },
        });
    }
    ,
    async getAllProjects(): Promise<Project[]> {
        return await prisma.project.findMany({ where: { isDeleted: false } });
    }
    ,
    async updateProject(id: number, data: Partial<Project>): Promise<Project> {
        return await prisma.project.update({
            where: { id },
            data: data,
        });
    }
    ,
    async deleteProject(id: number): Promise<Project> {
        return await prisma.project.update({
            where: { id },
            data: { deletedAt: new Date(), isDeleted: true },
        });
    }
}