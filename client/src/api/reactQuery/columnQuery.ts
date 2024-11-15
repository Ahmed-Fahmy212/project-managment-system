import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { addColumn, ColumnBody, getColumns, updateColumns, UpdateData } from "../column.api";
import { Column } from "../../state/api";


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
        onSuccess: (newColumn) => {
            queryClient.setQueryData(['columns', projectId], (oldData: Column[] | undefined) => {
                console.log('Adding new column:', newColumn);
                console.log('oldData new column:', oldData);
                return oldData ? [...oldData, newColumn] : [newColumn];
            });
        }
    });
};
export const useUpdateColumnsMutation = (projectId: number) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (orders: UpdateData) => updateColumns(orders),
        onSettled: (newData) => {
            queryClient.setQueryData(['columns', projectId], (oldData: Column[] | undefined) => {
                if (!oldData) return oldData;

                const updatedColumns = oldData.map((column) => {
                    const updatedColumn = newData?.find((newCol) => newCol.id === column.id);
                    return updatedColumn ? { ...updatedColumn } : column;
                }).sort((a, b) => a.order - b.order);

                return updatedColumns;
            });
        },
    });
};

