"use client";

import { parseAsString, useQueryState } from "nuqs";
import { useState } from "react";
import ProjectHeader from "../../projectHeader";
import Board from "../../_components/BoardView";
import ListView from "../../_components/ListView";
import TaskTable from "../../_components/Table";
import { Timeline } from "../../_components/TimeLine";
import ModalNewTask from "../../_components/ModalTask";

type Props = {
    params: { id: string };
};

const Project = ({ params }: Props) => {
    const { id } = params;
    // used nuqs
    const [activeTab, setActiveTab] = useQueryState("page", parseAsString.withDefault("Board"));
    const [isModalNewTaskOpen, setIsModalNewTaskOpen] = useState(false);

    const renderActiveTab = () => {
        switch (activeTab) {
            case "Board":
                return <Board id={id} setIsModalNewTaskOpen={setIsModalNewTaskOpen} />;
            case "List":
                return <ListView id={id} setIsModalNewTaskOpen={setIsModalNewTaskOpen} />;
            case "Timeline":
                return <Timeline id={id} setIsModalNewTaskOpen={setIsModalNewTaskOpen} />;
            case "Table":
                return <TaskTable id={id} setIsModalNewTaskOpen={setIsModalNewTaskOpen} />;
            default:
                return null;
        }
    };

    return (
        <div className="flex flex-1 flex-col overflow-hidden">
            <ModalNewTask isOpen={isModalNewTaskOpen} onClose={() => setIsModalNewTaskOpen(false)} projectId={Number(id)} />
            <ProjectHeader activeTab={activeTab} setActiveTab={setActiveTab} />
            {renderActiveTab()}
        </div>
    );
};

export default Project;
