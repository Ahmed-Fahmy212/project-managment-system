import axios from "axios";
import { Column as ColumnWithTasks } from "./api";

type Column = {
    title: string;
    color: string;
    projectId: number;
};
export const addColumn = async (column: Column): Promise<any> => {
    console.log("💛💛new column", column)
    const newColumn = {
        title: column.title,
        color: column.color,
        projectId: column.projectId,
    }
    const data = await axios.post(`http://localhost:8000/columns`, newColumn);

    return data
}

//----------------------------------------------------------------------------------------------
import { toast } from "react-hot-toast";

export const getColumns = async (projectId: number): Promise<{ data: ColumnWithTasks[] }> => {
    try {
        const data = await axios.get(`http://localhost:8000/columns/${projectId}`);
        console.log("💛💛data", data.data)
        return data.data;
    } catch (error) {
        toast.error("Failed to fetch columns");
        throw error;
    }
}