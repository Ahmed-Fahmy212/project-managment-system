'use client';
import {
    Cloud,
    Github,
    Keyboard,
    LifeBuoy,
    LogOut,
    Mail,
    MessageSquare,
    PlusCircle,
    Settings,
    User,
    UserPlus,
    Users,
} from "lucide-react"
import { Task as TaskComponent } from './task'
import { CreditCard, EllipsisVertical, MessageSquareMore, Plus } from "lucide-react";
import toast from "react-hot-toast";
import { DndContext, DragEndEvent, useDroppable } from '@dnd-kit/core'
import { useState } from "react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@radix-ui/react-dropdown-menu";
import { Button } from "@/components/ui/button";
import { DropdownMenuShortcut } from "@/components/ui/dropdown-menu";
import { QueryClient, useMutation, useQueryClient } from "@tanstack/react-query";
import { addColumn } from "@/state/column,api";
import ColumnForm from "./columnForm";
import { Task } from "@/state/api";
type ColumnBody = {
    title: string;
    color: string;
    projectId: number;
};

type TaskColumnProps = {
    id: number;
    status: string;
    tasks: Task[];
    statusColor: string;
    setIsModalNewTaskOpen: (isopen: boolean) => void;
    addColumnMutation: (column: ColumnBody) => Promise<any>;
};
export const TaskColumn = ({
    id,
    status,
    statusColor,
    tasks,
    setIsModalNewTaskOpen,
    addColumnMutation
}: TaskColumnProps) => {
    // id is not used
    const { setNodeRef, isOver } = useDroppable({
        id: status
    })

    const [open, setOpen] = useState(false);


    // const tasksMutation = useMutation({
    //     mutationFn: (newTask) => {
    //         return axios.post(`http://localhost:8000/tasks`, newTask)
    //     },
    // })
    // const [{ isOver }, drop] = useDrop(() => ({
    //     accept: "task",
    //     drop: (item: { id: number }) => moveTask(item.id, status),
    //     collect: (monitor: any) => ({
    //         isOver: !!monitor.isOver(),
    //     }),
    // }));
    // remove this 
    // const taskCount = tasks.filter((item) => item.status === status).length;

    return (
        <div
            ref={setNodeRef}
            className={`rounded py-2 h-full  sm:py-4 xl:px-2 ${isOver ?
                "bg-blue-200 dark:bg-black transition duration-500" : ""}`}
        >
            <div className="flex mb-3 w-full">
                <div
                    className={`w-2 !bg-[${statusColor}] rounded-s-lg`}
                    style={{ backgroundColor: statusColor }}
                />
                <div className="bg-white dark:bg-dark-secondary flex items-center justify-between px-5 py-4 rounded-e-lg w-full">
                    <h3 className="dark:text-white flex font-semibold items-center text-base">
                        {status}{" "}
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

                                        <ColumnForm projectId={Number(id)} AddColumnMutation={addColumnMutation} isSmallItem />
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