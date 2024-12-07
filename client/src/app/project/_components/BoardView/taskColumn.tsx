import { useState } from "react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@radix-ui/react-dropdown-menu";
import { CSS } from '@dnd-kit/utilities'
import ColumnForm from "./columnForm";
import { SortableContext, useSortable } from "@dnd-kit/sortable";
import { EllipsisVertical, GripVertical, Plus } from "lucide-react";
import { Task } from "./task";
import { Task as TaskType } from "@/state/api";


type ColumnBody = {
    title: string;
    color: string;
    projectId: number;
};

type TaskColumnProps = {
    column: ColumnBody & { projectId: number, id: number, order: number };
    setIsModalNewTaskOpen: (isopen: boolean) => void;
    addColumnMutation: (column: ColumnBody) => Promise<any>;
    tasks?: TaskType[];
};

export const TaskColumn = ({
    column,
    setIsModalNewTaskOpen,
    addColumnMutation,
    tasks,
}: TaskColumnProps) => {
    const { title, color: statusColor, projectId } = column;
    const [openDropdownMenu, setOpenDropdownMenu] = useState(false);
    const { setNodeRef, attributes, listeners, transform, transition, isDragging } = useSortable({
        id: column.id,
        data: {
            type: 'Column',
            column,
        }
        ,
        transition: {
            duration: 300,
            easing: 'cubic-bezier(0.25, 1, 0.5, 1)',
        },
    });


    const style = {
        transition: transition,
        transform: CSS.Transform.toString(transform),
    }
    if (isDragging) {
        return (<div className="border pt-4 border-rose-500 opacity-70 bg-blue-200 dark:bg-black" ref={setNodeRef} style={style} />)
    }
    console.log("🤍tasks",
        tasks?.map((task) => ({
            title: task.title,
            order: task.order
        }))
    );
    return (
        <div
            ref={setNodeRef}
            className={`rounded py-2 h-[720px] sm:py-4 xl:px-2 hover:cursor-default`}
            style={style}
            {...attributes}
        >
            <div className="flex mb-3 w-full">
                <div
                    className={`w-3 rounded-s `}
                    style={{ backgroundColor: statusColor }}
                    />
                <div
                    className={`hover:cursor-grab bg-white dark:bg-dark-secondary dark:text-white flex items-center justify-between px-1 rounded-e-lg`}
                    {...listeners}
                >
                    <GripVertical />
                </div>
                <div className="bg-white dark:bg-dark-secondary flex items-center justify-between pl-2 pr-5 py-4 rounded-e-lg w-full"

                >
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
                            <DropdownMenu onOpenChange={setOpenDropdownMenu} open={openDropdownMenu}>
                                <DropdownMenuTrigger asChild></DropdownMenuTrigger>
                                <DropdownMenuTrigger asChild>
                                    <button className="dark:text-neutral-500 flex h-6 items-center justify-center w-5"
                                        onClick={() => setOpenDropdownMenu(!openDropdownMenu)}>
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

            {tasks &&
                <SortableContext items={tasks}>
                    {
                        tasks.map((task) => (
                            <Task task={task}
                            />
                        ))
                    }
                </SortableContext>
            }
            {/* {tasks &&
                tasks.map((task) => (
                    <Task task={task} key={task.id} />
                ))
            } */}
            <button
                onClick={() => setIsModalNewTaskOpen(true)}
                className="hover:bg-gray-100 dark:bg-dark-bg dark:text-white dark:border-gray-500 py-3 w-full flex items-center justify-center border-2 border-dotted dark:border-solid dark:border  dark:hover:border-rose-900 rounded duration-100 "
            >
                <Plus size={16} />
                Add new task
            </button>

        </div >
    );
};