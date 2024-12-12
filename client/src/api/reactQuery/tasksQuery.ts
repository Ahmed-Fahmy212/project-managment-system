import { useQuery } from '@tanstack/react-query';
import { getTasks } from '../tasks.api';


export const useGetTasksQuery = (projectId: number) => {
    return useQuery({
        queryKey: ['tasks', projectId],
        queryFn: () => getTasks(projectId),
    });
};
