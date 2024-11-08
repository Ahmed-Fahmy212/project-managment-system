import React from 'react';
import { DataTable } from '../Table/dataTable';
import { useGetTasksQuery } from '@/state/api';
import { Columns } from './columns';
type TaskTableProps = {
    id: string,
    setIsModalNewTaskOpen: (isOpen: boolean) => void;
}
const TaskTable = ({ id }: TaskTableProps) => {
    const { data, error, isLoading } = useGetTasksQuery({ projectId: Number(id) });

    if (isLoading) return <div>Loading...</div>;
    if (error) {
        const errorMessage = 'status' in error ? JSON.stringify(error.data) : error.message;
        return <div>Error: {errorMessage}</div>;
    }

    return (
        //TODO setIsModalNewTaskOpen
        //TODO add pagination + hover shape 

        <DataTable columns={Columns} data={data?.data || []}  />
    );
};

export default TaskTable;