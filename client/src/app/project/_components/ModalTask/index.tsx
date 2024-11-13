import Modal from "@/components/Modal";
import { Priority, Status, Task } from "@/state/api";
import { createTask, TaskDataBody } from "@/state/tasks.api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import React, { useState } from "react";
import toast from "react-hot-toast";

type Props = {
    isOpen: boolean;
    onClose: () => void;
    id?: string | null;
    projectId: number;

};

const ModalNewTask = ({ isOpen, onClose, id = null, projectId }: Props) => {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [status, setStatus] = useState<Status>(Status.ToDo);
    const [columnId, setColumnId] = useState<number>();
    const [priority, setPriority] = useState<Priority>(Priority.BackLog);
    const [tags, setTags] = useState("");
    const [startDate, setStartDate] = useState("");
    const [dueDate, setDueDate] = useState("");
    const [isPending, setIsPending] = useState(true);

    const authorUserId = 1;
    // const [authorUserId, setAuthorUserId] = useState("");
    const [assignedUserId, setAssignedUserId] = useState("");


    const handleSubmit = async () => {
        if (!title || !authorUserId || !(id !== null || projectId)) return;

        const formattedStartDate = startDate ? new Date(startDate).toISOString() : new Date().toISOString();
        const formattedEndDate = dueDate ? new Date(dueDate).toISOString() : undefined;

        const queryClient = useQueryClient()
        const { mutateAsync: createTaskMutation, error, isPending } = useMutation({
            mutationFn: (TaskBody: TaskDataBody) => createTask(TaskBody),
            onSuccess: (newData) => {
                queryClient.setQueryData(['tasks', projectId], (oldData: Task[] | undefined) => {
                    return oldData ? [...oldData, newData] : [newData];
                });
            }
        })
        await createTaskMutation({
            title,
            projectId: Number(projectId),
            authorUserId: authorUserId,
            description,
            tags,
            startDate: formattedStartDate,
            dueDate: formattedEndDate,
            status: status,
            priority: priority,
            assignedUserId: assignedUserId ? Number(assignedUserId) : undefined,
            columnId: 0
        });

        if (!isPending && !error) {
            setIsPending(false)
            toast.success("Task created successfully.");
            onClose();
            setTitle("");
            setDescription("");
            setStatus(Status.ToDo);
            setPriority(Priority.BackLog);
            setTags("");
            setDescription("");
            setStartDate("");
            setDueDate("");
            // setAuthorUserId("");
            setAssignedUserId("");
            setStartDate("");
        }
    };

    const isFormValid = () => {
        return title && authorUserId;
    };
    // stolen
    const selectStyles =
        "mb-4 block w-full rounded border border-gray-300 px-3 py-2 dark:border-dark-tertiary dark:bg-dark-tertiary dark:text-white dark:focus:outline-none";

    const inputStyles =
        "w-full rounded border border-gray-300 p-2 shadow-sm dark:border-dark-tertiary dark:bg-dark-tertiary dark:text-white dark:focus:outline-none";

    return (
        <Modal isOpen={isOpen} onClose={onClose} name="Create New Task">
            <form
                className="mt-4 space-y-6 "
                onSubmit={(e) => {
                    e.preventDefault();
                    handleSubmit();
                }}
            >
                <input
                    type="text"
                    className={inputStyles}
                    placeholder="Title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                />
                <textarea
                    className={inputStyles}
                    placeholder="Description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                />
                {/* //TODO add fetch columns to get the types of status */}
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 sm:gap-2">
                    <select
                        className={selectStyles}
                        value={status}
                        onChange={(e) =>
                            setStatus(Status[e.target.value as keyof typeof Status])
                        }
                    >
                        <option value="">Select Status</option>
                        <option value={Status.ToDo}>To Do</option>
                        <option value={Status.WorkInProgress}>Work In Progress</option>
                        <option value={Status.UnderReview}>Under Review</option>
                        <option value={Status.Completed}>Completed</option>
                    </select>
                    <select
                        className={selectStyles}
                        value={priority}
                        onChange={(e) =>
                            setPriority(Priority[e.target.value as keyof typeof Priority])
                        }
                    >
                        <option value="">Select Priority</option>
                        <option value={Priority.Urgant}>Urgent</option>
                        <option value={Priority.High}>High</option>
                        <option value={Priority.Medium}>Medium</option>
                        <option value={Priority.Low}>Low</option>
                        <option value={Priority.BackLog}>Backlog</option>
                    </select>
                </div>
                <input
                    type="text"
                    className={inputStyles}
                    placeholder="Tags (comma separated)"
                    value={tags}
                    onChange={(e) => setTags(e.target.value)}
                />
                <input
                    type="column"
                    className={inputStyles}
                    placeholder="columnId"
                    value={columnId}
                    onChange={(e) => setColumnId(Number(e.target.value))}
                />

                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 sm:gap-2">
                    <input
                        type="date"
                        className={inputStyles}
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                    />
                    <input
                        type="date"
                        className={inputStyles}
                        value={dueDate}
                        onChange={(e) => setDueDate(e.target.value)}
                    />
                </div>
                {/* <input
                    type="text"
                    className={inputStyles}
                    placeholder="Author User ID"
                    value={authorUserId}
                    // onChange={(e) => setAuthorUserId(e.target.value)}
                /> */}
                <input
                    type="text"
                    className={inputStyles}
                    placeholder="Assigned User ID"
                    value={assignedUserId}
                    onChange={(e) => setAssignedUserId(e.target.value)}
                />
                {id === null && (
                    <input
                        type="text"
                        className={`${inputStyles}text-red-300`}
                        placeholder="ProjectId"
                        value={projectId}
                        disabled
                        readOnly
                    />
                )}
                <button
                    type="submit"
                    className={`focus-offset-2 mt-4 flex w-full justify-center rounded-md border border-transparent bg-blue-primary px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600 ${!isFormValid() || isPending ? "cursor-not-allowed opacity-50" : ""
                        }`}
                    disabled={!isFormValid() || isPending}
                >
                    {isPending ? "Creating..." : "Create Task"}
                </button>
            </form>
        </Modal>
    );
};

export default ModalNewTask;
