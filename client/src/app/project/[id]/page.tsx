"use client";

import { useState } from "react";
import ProjectHeader from "../projectHeader";
import Board from "../BoardView/index";
import ListView from "../ListView";
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
                {activeTab === "Table" && (<div><h1>Table</h1></div>
                )
                }
        </div>
    )
}

export default Project;
