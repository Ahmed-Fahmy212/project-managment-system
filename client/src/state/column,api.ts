import axios from "axios";
import { Column as ColumnWithTasks } from "./api";

type Column = {
    title: string;
    color: string;
    projectId: number;
};
export const addColumn = async (column: Column): Promise<ColumnWithTasks> => {
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

export const getColumns = async (projectId: number): Promise< ColumnWithTasks[] > => {
    try {
        const data = await axios.get(`http://localhost:8000/columns/${Number(projectId)}`);
        console.log("💛💛data", data.data)
        return data.data.data;
    } catch (error) {
        toast.error("Failed to fetch columns");
        throw error;
    }
}