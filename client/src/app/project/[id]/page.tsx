"use client";

import { useState } from "react";
import ProjectHeader from "../projectHeader";
import Board from "../BoardView/index";
import ListView from "../ListView";
import { DataTable } from "../Table/dataTable";
import { Columns } from "../Table/columns";
import TaskTable from "../Table";
// want show the fkn header
type Props = {
    params: { id: string };
}
const Project = ({ params }: Props) => {
    const { id } = params;
    const [activeTab, setActiveTab] = useState("Board")
    const [isModalNewTaskOpen, setIsModalNewTaskOpen] = useState(false);
    return (
        <div className="flex flex-col flex-1 overflow-hidden">
            <ProjectHeader activeTab={activeTab} setActiveTab={setActiveTab} />
            {activeTab === "Board" && (
                <Board id={id} setIsModalNewTaskOpen={setIsModalNewTaskOpen} />
            )
            }
            {activeTab === "List" && (
                <ListView id={id} setIsModalNewTaskOpen={setIsModalNewTaskOpen} />
            )
            }
            {activeTab === "Timeline" && (
                <div><h1>Timeline</h1></div>
            )
            }
            {activeTab === "Table" && (
                <TaskTable id={id} setIsModalNewTaskOpen={setIsModalNewTaskOpen}/>
            )
            }
        </div>
    )
}

export default Project;
