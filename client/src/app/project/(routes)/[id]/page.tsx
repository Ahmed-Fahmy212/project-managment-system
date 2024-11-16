"use client";


import { parseAsString, useQueryState } from "nuqs";
import { useState } from "react";
import ProjectHeader from ".././../projectHeader";
import Board from "../../_components/BoardView/index";
import ListView from "../../_components/ListView";
import TaskTable from "../../_components/Table";
import { Timeline } from "../../_components/TimeLine";
import ModalNewTask from "../../_components/ModalTask";


type Props = {
    params: { id: string };
}
const Project = ({ params }: Props) => {
    const { id } = params;
    const [activeTab, setActiveTab] = useQueryState("page", parseAsString.withDefault("Board"));
    // nessecary to know when use client and when don`t 
    const [isModalNewTaskOpen, setIsModalNewTaskOpen] = useState(false);
    return (
        <div className="flex flex-1 flex-col overflow-hidden">
            < ModalNewTask isOpen={isModalNewTaskOpen} onClose={() => setIsModalNewTaskOpen(false)} projectId={Number(id)} />
            
            <ProjectHeader activeTab={activeTab} setActiveTab={setActiveTab} />
            {activeTab === "Board" && (
                <Board id={id} setIsModalNewTaskOpen={setIsModalNewTaskOpen}  />
            )
            }
            {activeTab === "List" && (
                <ListView id={id} setIsModalNewTaskOpen={setIsModalNewTaskOpen} />
            )
            }
            {activeTab === "Timeline" && (
                <Timeline id={id} setIsModalNewTaskOpen={setIsModalNewTaskOpen} />
            )
            }
            {activeTab === "Table" && (
             <TaskTable id={id} setIsModalNewTaskOpen={setIsModalNewTaskOpen} />
            )}
        </div>
    )
}

export default Project;
