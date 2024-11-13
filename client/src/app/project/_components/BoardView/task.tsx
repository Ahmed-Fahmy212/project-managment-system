import { Task as Tasks } from "@/state/api";
import { format } from "date-fns";
import Image from "next/image";
import { EllipsisVertical, MessageSquareMore, Plus } from "lucide-react";
import toast from "react-hot-toast";
import { DndContext, DragEndEvent, useDraggable } from '@dnd-kit/core'


type TaskProps = {
    task: Tasks;
};


export const Task = ({ task }: TaskProps) => {
    // const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    //     id: task.id as number
    // })
    const taskTagsSplit = task.tags ? task.tags.split(",") : [];

    const formattedStartDate = task.startDate
        ? format(new Date(task.startDate), "P")
        : "";
    const formattedDueDate = task.dueDate
        ? format(new Date(task.dueDate), "P")
        : "";

    const numberOfComments = (task.comments && task.comments.length) || 0;

    const PriorityTag = ({ priority }: { priority: Tasks["priority"] }) => (
        <div
            className={`rounded-full px-2 py-1 text-xs font-semibold ${priority === "Urgant"
                ? "bg-red-200 text-red-700"
                : priority === "High"
                    ? "bg-yellow-200 text-yellow-900"
                    : priority === "Medium"
                        ? "bg-green-200 text-green-700"
                        : priority === "Low"
                            ? "bg-blue-200 text-blue-700"
                            : "bg-gray-200 text-gray-700"
                }`}
        >
            {priority}
        </div>
    );


    return (
        <div
            className={`mb-4 rounded-md bg-white shadow dark:bg-dark-secondary dark:hover:bg-transparent duration-100 flex flex-col hover:bg-gray-100 `}
        >

            <div className="h-auto md:pt-6 md:px-6 pt-4 px-4">
                <div className="flex items-start justify-between">
                    {/* priority && tag */}
                    <div className="flex flex-1 flex-wrap gap-2 items-center">
                        {task.priority && <PriorityTag priority={task.priority} />}
                        <div className="flex gap-2">
                            {taskTagsSplit.map((tag) => (
                                <div key={tag} className="bg-blue-100 px-2 py-1 rounded-full text-xs">
                                    {" "}
                                    {tag}
                                </div>
                            ))}
                        </div>
                    </div>
                    {/* Ellips */}
                    <button className="dark:text-neutral-500 flex h-6 items-center justify-center w-4">
                        <EllipsisVertical size={26} />
                    </button>
                </div>
                {/*-----------*/}

                <div className="flex items-center justify-between my-3">
                    <h4 className="dark:text-white font-bold text-md">{task.title}</h4>
                    {task.points && (
                        <div className="dark:text-white font-semibold text-xs">
                            {task.points} pts
                        </div>
                    )}
                    <div className="dark:text-neutral-500 flex flex-col text-gray-400 text-sm">
                        {formattedStartDate && <span>{formattedStartDate} </span>}
                        {formattedDueDate && <span>{formattedDueDate}</span>}
                    </div>
                </div>
                <p className="dark:text-neutral-500 text-gray-600 text-sm">
                    {task.description}
                </p>
                {/* {task.attachments && task.attachments.length > 0 && (
                    <Image
                        src={`/${task.attachments[0].fileURL}`}
                        alt={`/${task.attachments[0].fileName}`}
                        width={200}
                        height={200}
                        className="h-auto mt-4 w-full"
                    />
                )} */}
                <div className="border-gray-200 border-t dark:border-stroke-dark mt-4" />
            </div>



            {/* assignee + commments + shape icon */}
            <div className="flex items-center justify-between p-2">
                {/* understand this relly mater */}
                <div className="-space-x-[4px] flex overflow-hidden">

                    {
                        task.assignee &&
                        <Image
                            key={`${task.assignee.id}`}
                            src={`/${task.assignee?.profilePictureUrl}`}
                            alt={`/${task.assignee.username}`}
                            width={30}
                            height={30}
                            className="border-2 border-white dark:border-dark-secondary h-8 object-cover rounded-full w-8"
                        />
                    }
                    {
                        task.author &&
                        <Image
                            key={`${task.author.id}`}
                            src={`/${task.author?.profilePictureUrl}`}
                            alt={`/${task.author.username}`}
                            width={30}
                            height={30}
                            className="border-2 border-white dark:border-dark-secondary h-8 object-cover rounded-full w-8"
                        />
                    }

                </div>
                <div className="dark:text-neural-500 flex items-center text-gray-500">
                    <MessageSquareMore size={20} />
                    <span className="dark:text-neural-400 ml-1 text-sm">
                        {numberOfComments}
                    </span>
                </div>
            </div>

        </div>
    );
};