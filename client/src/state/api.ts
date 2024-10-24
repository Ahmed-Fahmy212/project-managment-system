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

export const api = createApi({
    baseQuery: fetchBaseQuery({ baseUrl: process.env.NEXT_PUBLIC_API_BASE_URL }),
    reducerPath: "api",
    // prepareHeaders:async(headers) =>{
    //     const sesssion = await fetchAuthSession()
    // }
    tagTypes: ["Projects", "Tasks"],

    endpoints: (bu) => ({
        getPtjects: bu.query<Project[], void>({
            query: () => "projects",
            providesTags: ["Projects"],
        }),
        createPoject: bu.mutation<Project, Partial<Project>>({
            query: (body) => ({
                url: "projects",
                method: "POST",
                body,
            }),
            invalidatesTags: ["Projects"],
        }),
        getTasks: bu.query<Task[], { projectId: number }>({
            query: (projectId) => `tasks?projectId=${projectId}`,
            providesTags: (result) => result ? result.map(({ id }) => ({ type: "Tasks", id }))
                : [{ type: "Tasks" as const }],
        }),
        createTask: bu.mutation<Task, Partial<Task>>({
            query: (body) => ({
                url: "tasks",
                method: "POST",
                body,
            }),
            invalidatesTags: ["Tasks"],
        }),
        updateTask: bu.mutation<Task, {taskId : number, status: string}>({
        query:({taskId, status}) => ({
            url: `tasks/${taskId}/status`,
            method: "PATCH",
            body: {status},
        }),
        })
    }),
})

export const { useGetPtjectsQuery, useCreatePojectMutation ,useCreateTaskMutation ,useGetTasksQuery } = api