import { useQuery } from '@tanstack/react-query';
import { getTasks, updateTasks, UpdateTasksData } from '../tasks.api';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Task as TaskType } from "@/state/api";

export const useGetTasksQuery = (projectId: number) => {
    return useQuery({
        queryKey: ['tasks', projectId],
        queryFn: () => getTasks(projectId),
    });
};

export const useUpdateTasksMutation = (projectId: number) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (tasksUpdate: UpdateTasksData) => updateTasks(tasksUpdate),
        onSettled: (newData) => {
            queryClient.setQueryData(['tasks', projectId], (oldData: TaskType[] | undefined) => {
                if (!oldData) return oldData;

                const updatedTasks = oldData.map((task) => {
                    const updatedTask = newData?.newOrderedTasks?.find((newTask) => newTask.id === task.id);
                    return updatedTask ? { ...updatedTask } : task;
                }).sort((a, b) => a.order - b.order);

                return updatedTasks;
            });
        },
    });
};