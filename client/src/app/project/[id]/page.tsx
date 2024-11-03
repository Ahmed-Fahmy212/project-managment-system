"use client";

import { useState } from "react";
import ProjectHeader from "../projectHeader";
import Board from "../BoardView/index";
// want show the fkn header
type Props = {
    params: { id:string };
}
const Project = ({params} : Props) => {
    const {id} = params;
    const [activeTab , setActiveTab] = useState("Board")
    const [isModalNewTaskOpen, setIsModalNewTaskOpen] = useState(false);
    return (
        <div>
            <ProjectHeader activeTab={activeTab} setActiveTab = {setActiveTab} />
            {
                activeTab === "Board" && (
                    <Board id={id} setIsModalNewTaskOpen={setIsModalNewTaskOpen}/>
                )
            }
            {
                activeTab === "List" && (
                    <div>
                        <h1>List</h1>
                    </div>
                )
            }
            {
                activeTab === "Timeline" && (
                    <div>
                        <h1>Timeline</h1>
                    </div>
                )
            }
            {
                activeTab === "Table" && (
                    <div>
                        <h1>Table</h1>
                    </div>
                )
            }
        </div>
    )
}

export default Project;
