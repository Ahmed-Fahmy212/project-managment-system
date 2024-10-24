import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
export interface Project {
    id: number;
    name: string;
    description?: string;
    startDate?: string;
    endDate?: string;
}
export enum Priority {
    Urgant = "Urgant",
    High = "High",
    Medium = "Medium",
    Low = "Low",
    BackLog = "BackLog"
}

export enum Status {
    ToDo = "To Do",
    WorkInProgress = "Work In Progress",
    UnderReview = "Under Review",
    Completed = "Completed",
}

export interface User {
    id: number;
    name: string;
    email: string;
    role: string;
    profilePicture?: string;
    cognitoid?: string;
    teamId?: number;
}
export interface Attachment {
    id: number;
    fileURL: string;
    fileName: string;
    taskId: number;
    uploadedById: number;
}
export interface Task {
    id: number;
    title: string;
    description?: string;
    status?: Status;
    priority?: Priority;
    tags?: string;
    startDate?: string;
    dueDate?: string;
    points?: number;
    projectId: number;
    authorUserId?: number;
    assignedUserId?: number;

    author?: User;
    assignee?: User;
    comments?: Comment[];
    attachments?: Attachment[];
}
export interface SearchResults {
    tasks?: Task[];
    projects?: Project[];
    users?: User[];
}
export interface Team {
    teamId: number;
    teamName: string;
    productOwnerUserId?: number;
    projectManagerUserId?: number;
}
