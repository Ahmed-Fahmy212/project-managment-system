import { Status, useGetTasksQuery, useUpdateTaskMutation } from "@/state/api";
import { Task as Tasks } from "@/state/api";
import { format } from "date-fns";
import Image from "next/image";
import { EllipsisVertical, MessageSquareMore, Plus } from "lucide-react";
import toast from "react-hot-toast";
import { DndContext, DragEndEvent, useDroppable } from '@dnd-kit/core'
import { Task } from "./task";


type TaskColumnProps = {
    status: string;
    tasks: Tasks[];
    setIsModalNewTaskOpen: (isopen: boolean) => void;
};
export const TaskColumn = ({
    status,
    tasks,
    setIsModalNewTaskOpen,
}: TaskColumnProps) => {

    const { setNodeRef, isOver} = useDroppable({
        id: status
    })
    // const [{ isOver }, drop] = useDrop(() => ({
    //     accept: "task",
    //     drop: (item: { id: number }) => moveTask(item.id, status),
    //     collect: (monitor: any) => ({
    //         isOver: !!monitor.isOver(),
    //     }),
    // }));
    const taskCount = tasks.filter((item) => item.status === status).length;

    const statusColor: any = {
        "To Do": "#2563EB",
        "Work In Progress": "#059669",
        "Under Review": "#D97706",
        "Completed": "#000000",
    };

    return (
        <div
            ref={setNodeRef}
            className={`rounded-lg py-2 h-full  sm:py-4 xl:px-2 ${isOver ?
                "bg-blue-200 dark:bg-neutral-950 transition duration-500" : ""}`}
        >
            <div className="flex mb-3 w-full">
                <div
                    className={`w-2 !bg-[${statusColor[status]}] rounded-s-lg`}
                    style={{ backgroundColor: statusColor[status] }}
                />
                <div className="bg-white dark:bg-dark-secondary flex items-center justify-between px-5 py-4 rounded-e-lg w-full">
                    <h3 className="dark:text-white flex font-semibold items-center text-base">
                        {status}{" "}
                        <span
                            className="bg-gray-200 dark:bg-dark-tertiary inline-block leading-none ml-2 p-1 rounded-full text-center text-sm"
                            style={{ width: "1.5rem", height: "1.5rem" }}
                        >
                            {taskCount}
                        </span>
                    </h3>
                    <div className="flex gap-1 items-center">
                        <button className="dark:text-neutral-500 flex h-6 items-center justify-center w-5">
                            <EllipsisVertical size={26} />
                        </button>
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
            {tasks
                //TODO i think this bad
                .filter((task) => task.status === status) // [{},{},{}] =>  
                .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
                .map((task) => (
                    <Task task={task} />
                ))}
        </div>
    );
};