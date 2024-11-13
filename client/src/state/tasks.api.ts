import axios from "axios";
import { Task } from "./api";
import toast from "react-hot-toast";



export const getTasks = async (projectId: number): Promise<Task[]> => {
    try {
        const data = await axios.get(`http://localhost:8000/tasks/${projectId}`);
        return data.data.data;
    } catch (error) {
        toast.error("Failed to fetch tasks");
        throw error;
    }
}
//------------------------------------------------------------------------------------
export type TaskDataBody = {
    title: string;
    projectId: number;
    authorUserId: number;
    columnId: number;
    description?: string;
    tags?: string;
    startDate?: string;
    dueDate?: string;
    status?: string;
    priority?: string;
    points?: number;
    assignedUserId?: number;
};

export const createTask = async (task: TaskDataBody): Promise<Task> => {
    try {
        const data = await axios.post(`http://localhost:8000/tasks`, task);
        return data.data.data;
    }
    catch (error) {
        toast.error("Failed to fetch tasks");
        throw error;
    }
}