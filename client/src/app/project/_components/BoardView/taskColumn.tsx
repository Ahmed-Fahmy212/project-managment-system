'use client';

import { useState } from "react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@radix-ui/react-dropdown-menu";
import { CSS } from '@dnd-kit/utilities'
import ColumnForm from "./columnForm";
import { useSortable } from "@dnd-kit/sortable";
import { EllipsisVertical, Plus } from "lucide-react";
import { DraggableAttributes } from "@dnd-kit/core";
type ColumnBody = {
    title: string;
    color: string;
    projectId: number;
};

type TaskColumnProps = {
    column: ColumnBody & { projectId: number, id: number, order: number };
    setIsModalNewTaskOpen: (isopen: boolean) => void;
    addColumnMutation: (column: ColumnBody) => Promise<any>;
};


export const TaskColumn = ({
    column,
    setIsModalNewTaskOpen,
    addColumnMutation
}: TaskColumnProps) => {
    const { title, color: statusColor, projectId } = column;
    const [open, setOpen] = useState(false);
    const { setNodeRef, attributes, listeners, transform, transition, isDragging, isOver } = useSortable({
        id: column.id,
        data: {
            type: "Column",
            column: column
        }
    });
    const style = {
        transition: transition,
        transform: CSS.Transform.toString(transform),
    }
    if (isDragging) {
        // console.log("dragging");
        return (<div className="border pt-4 border-rose-500 opacity-70 bg-blue-200 dark:bg-black" ref={setNodeRef} style={style} ></div>)
    }
    return (
        // don`t effect in original position or layout of element
        <div
            ref={setNodeRef}
            className={`rounded py-2 min-h-full  sm:py-4 xl:px-2 
           `} style={style}
            {...attributes}
            {...listeners}
        >
            <div className="flex mb-3 w-full">
                <div
                    className={`w-2 !bg-[${statusColor}] rounded-s-lg`}
                    style={{ backgroundColor: statusColor }}
                />
                <div className="bg-white dark:bg-dark-secondary flex items-center justify-between px-5 py-4 rounded-e-lg w-full">
                    <h3 className="dark:text-white flex font-semibold items-center text-base">
                        {title}{" "}
                        <span
                            className="bg-gray-200 dark:bg-dark-tertiary inline-block leading-none ml-2 p-1 rounded-full text-center text-sm"
                            style={{ width: "1.5rem", height: "1.5rem" }}
                        >
                            {/* {taskCount} */}
                        </span>
                    </h3>
                    <div className="flex gap-1 items-center">
                        <div>
                            {/* //TODO this is bad */}
                            <DropdownMenu open={open} onOpenChange={setOpen}>
                                <DropdownMenuTrigger asChild>
                                    <button className="dark:text-neutral-500 flex h-6 items-center justify-center w-5"
                                        onClick={() => setOpen(!open)}>
                                        <EllipsisVertical />
                                    </button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent className=" bg-white p-4 flex flex-col gap-2 justify-center items-center">
                                    <DropdownMenuItem>
                                        {/* <button className="hover:bg-gray-100 dark:hover:bg-gray-700 text-black dark:text-white"> */}
                                        <div className="w-full h-full relative">

                                            <ColumnForm projectId={projectId} AddColumnMutation={addColumnMutation} isSmallItem />
                                        </div>
                                        {/* </button> */}
                                    </DropdownMenuItem>

                                    <DropdownMenuItem>
                                        <button className=" py-3 mr-2 h-4  ">Order</button>

                                    </DropdownMenuItem>

                                    <DropdownMenuItem>
                                        <button className="pt-3   mr-2 h-4 "> Delete</button>

                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>



                        </div>
                        <button
                            className="bg-gray-200 dark:bg-dark-tertiary dark:text-white flex h-6 items-center justify-center rounded w-6"
                            onClick={() => setIsModalNewTaskOpen(true)}
                        >
                            <Plus size={16} />
                        </button>
                    </div>
                </div>
            </div>
            {/*  O(2n) = O(n) ------------------------- O(nlog(n))*/}
            {/* {
                tasks
                    //todo Remove and make it single endpoint according to update single element or find a way insdie this nested column->tasks
                    .filter((task) => task.status === status) // [{},{},{}] =>  
                    // .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
                    .map((task) => (
                        <TaskComponent task={task} />
                    )) */}
            {/* } */}

        </div >
    );
};