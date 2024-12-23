import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { addColumn, ColumnBody, getColumns, updateColumns } from "../column.api";
import { Column } from "../../state/api";
import { orderID } from "@/app/project/_components/BoardView";

export const useGetColumnsQuery = (projectId: number) => {
    return useQuery({
        queryKey: ['columns', projectId],
        queryFn: () => getColumns(projectId),
    });
};
export const useAddColumnMutation = (projectId: number) => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (newColumn: ColumnBody) => addColumn(newColumn),
        onMutate: async (newColumn) => {
            await queryClient.cancelQueries({ queryKey: ['columns', projectId] });

            const previousColumns = queryClient.getQueryData(['columns', projectId]);
            // change id here 
            const newColumnWithId = { ...newColumn, id: Date.now() };

            queryClient.setQueryData(['columns', projectId], (oldData: Column[] | undefined) => {
                return oldData ? [...oldData, newColumnWithId] : [newColumnWithId];
            });

            return { previousColumns };
        },
        onError: (error, _, context) => {
            queryClient.setQueryData(['columns', projectId], context?.previousColumns);
        },
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: ['columns', projectId] });
        }
    });
};
export const useUpdateColumnsMutation = (projectId: number) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (newOrderColumns: { projectId: number, newOrder: orderID[] }) => await updateColumns(newOrderColumns),
        onMutate: async (newOrderColumns) => {
            await queryClient.cancelQueries({ queryKey: ['columns', projectId] });

            const previousColumns = queryClient.getQueryData(['columns', projectId]);
            let updatedColumns
            queryClient.setQueryData(['columns', projectId], (oldData: Column[] | undefined) => {
                if (!oldData) return oldData;

                updatedColumns = oldData
                    .map((column) => {
                        const updatedColumn = newOrderColumns.newOrder.find((newColumn) => newColumn.id === column.id);
                        return updatedColumn ? { ...column, ...updatedColumn } : column;
                    })
                    .sort((a, b) => (a.order || 0) - (b.order || 0));

                return updatedColumns;
            });

            return { previousColumns };
        },
        onError: (error, _, context) => {
            queryClient.setQueryData(['columns', projectId], context?.previousColumns);
        },
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: ['columns', projectId] });
        },
    });
};
