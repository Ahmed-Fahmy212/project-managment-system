import { ProjectBody, UpdateProjectBody } from '../types/project';
import { Project } from '@prisma/client';
import prisma from '../../prisma/client';
import zod from 'zod';

export const ProjectService = {
    async createProject(data: zod.infer<typeof ProjectBody>): Promise<Project> {
            const createdProject = await prisma.project.create({
                data
            });
            return createdProject;

    },
    async getProjectById(id: number): Promise<Project | null> {
        return await prisma.project.findUnique({
            where: { id, isDeleted: false },
        });
    },
    async getAllProjects(): Promise<Project[]> {
        return await prisma.project.findMany({ where: { isDeleted: false } });
    },
    async updateProject(id: number, data: zod.infer<typeof UpdateProjectBody>): Promise<Project> {
        return await prisma.project.update({
            where: { id },
            data: data,
        });
    },
    async deleteProject(id: number): Promise<Project> {
        return await prisma.project.update({
            where: { id },
            data: { deletedAt: new Date(), isDeleted: true },
        });
    }
};
