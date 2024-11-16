import React from 'react';
import { DataTable } from '../Table/dataTable';
import { useGetTasksQuery } from '../../../../api/reactQuery/tasksQuery';
import { Columns } from './columns';
import { useGetColumnsQuery } from '@/api/reactQuery/columnQuery';
type TaskTableProps = {
    id: string,
    setIsModalNewTaskOpen: (isOpen: boolean) => void;
}
const TaskTable = ({ id }: TaskTableProps) => {
    const { data: tasks, error, isLoading } = useGetTasksQuery(parseInt(id));
    const { data: columns } = useGetColumnsQuery(parseInt(id));
    if (isLoading) return <div>Loading...</div>;
    if (error) {
        const errorMessage = 'status' in error ? JSON.stringify(error) : error.message;
        return <div>Error: {errorMessage}</div>;
    }

    return (
        //TODO setIsModalNewTaskOpen
        //TODO add pagination + hover shape 

        <DataTable columns={Columns} columnData={columns || []} data={tasks || []} />
    );
};

export default TaskTable;