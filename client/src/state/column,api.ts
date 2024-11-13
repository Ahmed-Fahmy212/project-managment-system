import axios from "axios";
import { Column as ColumnWithTasks } from "./api";

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
        console.log("💛💛data", data.data)
        return data.data.data;
    } catch (error) {
        toast.error("Failed to fetch columns");
        throw error;
    }
}
//----------------------------------------------------------------------------------------------
export type UpdateData = {
    previouseColumnId: number;
    targetColumnId: number;
    previoueColumnOrder: number;
    projectId: number;
}
export const updateColumns = async (UpdateData: UpdateData): Promise<{ previousColData: { id: number, order: number | null }, TargetColData: { id: number, order: number | null } }> => {// oreder null just for dummy db will remove 
    const data = await axios.patch(`http://localhost:8000/columns`, UpdateData);
    return data.data.data;
}