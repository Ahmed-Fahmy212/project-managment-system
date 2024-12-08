import axios from "axios";
import { Task } from "../state/api";
import toast from "react-hot-toast";



export const getTasks = async (projectId: number): Promise<Task[]> => {
    try {
        const data = await axios.get(`http://localhost:8000/tasks/${projectId}`);
       const sortedTasks = data.data.data.sort((a: Task, b: Task) => a.order - b.order);
        return sortedTasks;
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
//------------------------------------------------------------------------------------
export type UpdateTasksData = {
    columnId?: number;
    activeTaskId?: number;
    projectId: number;
    newOrder: { id: number; order: number }[];
} & Partial<TaskDataBody>

export const updateTasks = async ( updateData: UpdateTasksData): Promise<{ newOrderedTasks: Task[]}> => {
    try {
        console.log("🤍updateData", updateData)
        const { activeTaskId, columnId } = updateData;
        if (activeTaskId && !columnId || columnId && !activeTaskId) {
            toast.error("Missing required field: columnId or activeTaskId");
            throw new Error("Missing required field: columnId or activeTaskId");
        }
        if (updateData.newOrder.length === 0) throw new Error(`lol`);
        const data = await axios.patch(`http://localhost:8000/tasks`, updateData);
        return data.data.data;
    } catch (error) {
        toast.error("Failed to update tasks");
        throw error;
    }
}



import { useMutation, useQueryClient } from "@tanstack/react-query";

const useCreateTaskMutationR = (projectId: number) => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (TaskBody: TaskDataBody) => createTask(TaskBody),
        onSuccess: (newData) => {
            queryClient.setQueryData(['tasks', projectId], (oldData: Task[] | undefined) => {
                return oldData ? [...oldData, newData] : [newData];

            });
        },
        onError: (error) => {
            toast.error("Failed to create task");
            console.error(error);
        },
    });
};

export default useCreateTaskMutationR;