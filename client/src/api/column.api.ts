import axios from "axios";
import { Column, Column as ColumnWithTasks, Task } from "../state/api";

export type ColumnBody = {
    title: string;
    color: string;
    projectId: number;
};
export const addColumn = async (column: ColumnBody): Promise<ColumnWithTasks> => {
    const newColumn = {
        title: column.title,
        color: column.color,
        projectId: column.projectId,
    }
    const data = await axios.post(`http://localhost:8000/columns`, newColumn);


    return data.data.data;
}

//----------------------------------------------------------------------------------------------
import { toast } from "react-hot-toast";

export const getColumns = async (projectId: number): Promise<ColumnWithTasks[]> => {
    try {
        const data = await axios.get(`http://localhost:8000/columns/${Number(projectId)}`);
        const columns = data.data.data;
        //TODO remove this sort 
        const sortedColumns = columns.sort((a: ColumnWithTasks, b: ColumnWithTasks) => a.order - b.order);
        return sortedColumns;
    } catch (error) {
        toast.error("Failed to fetch columns");
        throw error;
    }
}
//----------------------------------------------------------------------------------------------
export type UpdateData = {
    newOrder: { id: number; order: number }[];
    projectId: number;
};

export const updateColumns = async (UpdateData: UpdateData): Promise<Column[]> => {
    try {
        const data = await axios.patch(`http://localhost:8000/columns`, UpdateData);
        const sortedColumns = data.data.data.sort((a: Column, b: Column) => a.order - b.order);
        return sortedColumns;

    } catch (error) {
        toast.error("Failed to update columns");
        throw error;
    }
}