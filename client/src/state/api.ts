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
    username: string;
    email: string;
    role: string;
    profilePictureUrl?: string;
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
    order: number;
    description?: string;
    //TODO remove this
    status?: Status;
    priority: Priority;
    tags?: string;
    startDate?: string;
    dueDate?: string;
    points?: number;
    projectId: number;
    authorUserId?: number;
    assignedUserId?: number;
    columnId: number;
    author?: User;
    assignee?: User;
    comments?: Comment[];
    updatedAt: string;
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
export interface Column {
    id: number;
    title: string;
    color: string;
    projectId: number;
    order: number;
    // ignore this from back + add is remove if deleted 
    deletedAt: string | null;
    deletedById: number | null;
    updatedAt: string | null;
    updatedBy: string | null;
    task?: Task[];
}

//==================================================== Redux Toolkit Query ====================================================
export const api = createApi({
    baseQuery: fetchBaseQuery({ baseUrl: "http://localhost:8000/" }),
    reducerPath: "api",
    // prepareHeaders:async(headers) =>{
    //     const sesssion = await fetchAuthSession()
    // }
    tagTypes: ["Projects", "Tasks"],

    endpoints: (bu) => ({
        getProjects: bu.query<{ data: Project[] }, void>({
            query: () => "projects",
            providesTags: ["Projects"],
        }),
        // input logs

        createProject: bu.mutation<Project, Partial<Project>>({
            query: (body: Omit<Project, "id">) => ({
                url: "projects",
                method: "POST",
                body,
            }),
            invalidatesTags: ["Projects"],
        }),
        getTasks: bu.query<{ data: Task[] }, { projectId: number }>({
            query: ({ projectId }) => `tasks/${projectId}`,
            providesTags: (result) => result ? result.data.map(({ id }) => ({ type: "Tasks", id }))
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
        updateTask: bu.mutation<Task, { taskId: number, status: string }>({
            query: ({ taskId, status }) => ({
                url: `tasks/${taskId}/status`,
                method: "PATCH",
                body: { status },
            }),
            invalidatesTags: (result, error, { taskId }) => {
                return [{ type: "Tasks", id: taskId }];
            },
        }), search: bu.query<SearchResults, string>({
            query: (query) => `search?query=${query}`,
        }),
    }),
})
// removed and putted into react query 
export const {useGetTasksQuery, useGetProjectsQuery, useCreateProjectMutation, useCreateTaskMutation, useUpdateTaskMutation , useSearchQuery } = api
//========================================================== React Query ====================================================
