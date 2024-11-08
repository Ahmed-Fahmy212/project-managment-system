"use client";


import { parseAsString, useQueryState } from "nuqs";
import { useState } from "react";
import ProjectHeader from ".././../projectHeader";
import Board from "../../_components/BoardView/index";
import ListView from "../../_components/ListView";
import TaskTable from "../../_components/Table";


type Props = {
    params: { id: string };
}
const Project = ({ params }: Props) => {
    const { id } = params;
    const [activeTab, setActiveTab] = useQueryState("page", parseAsString.withDefault("Board"));

    const [isModalNewTaskOpen, setIsModalNewTaskOpen] = useState(false);
    return (
        <div className="flex flex-1 flex-col overflow-hidden">
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
                <TaskTable id={id} setIsModalNewTaskOpen={setIsModalNewTaskOpen} />
            )
            }
        </div>
    )
}

export default Project;