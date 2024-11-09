import Modal from "@/components/Modal";
import { useCreateProjectMutation } from "@/state/api";
import React, { useState } from "react";
import { format } from "date-fns";

type Props = {
    isOpen: boolean;
    onClose: () => void;
};

const ModalNewProject = ({ isOpen, onClose }: Props) => {
    const [createProject, { isLoading }] = useCreateProjectMutation();
    const [projectName, setProjectName] = useState("");
    const [description, setDescription] = useState("");
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");

    const handleSubmit = async () => {
        if (!projectName || !startDate || !endDate) return;

        const formattedStartDate = format(new Date(startDate));
        const formattedEndDate = format(new Date(endDate));

        await createProject({
            name: projectName,
            description,
            startDate: formattedStartDate,
            endDate: formattedEndDate,
        });
    };

    const isFormValid = () => {
        return projectName;
    };


    return (
        <Modal isOpen={isOpen} onClose={onClose} name="Create New Project">
            <form
                className="mt-4 space-y-6"
                onSubmit={(e) => {
                    e.preventDefault();
                    handleSubmit();
                }}
            >
                <input
                    type="text"
                    className={`w-full rounded border border-gray-300 p-2 shadow-sm dark:border-dark-tertiary dark:bg-dark-tertiary dark:text-white dark:focus:outline-none`}
                    placeholder="Project Name"
                    value={projectName}
                    onChange={(e) => setProjectName(e.target.value)}
                    
                />
                <textarea
                    className={`w-full rounded border border-gray-300 p-2 shadow-sm dark:border-dark-tertiary dark:bg-dark-tertiary dark:text-white dark:focus:outline-none`}
                    placeholder="Description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                />
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 sm:gap-2">
                    <input
                        type="date"
                        className={`w-full rounded border border-gray-300 p-2 shadow-sm dark:border-dark-tertiary dark:bg-dark-tertiary dark:text-white dark:focus:outline-none`}
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                    />
                    <input
                        type="date"
                        className={`w-full rounded border border-gray-300 p-2 shadow-sm dark:border-dark-tertiary dark:bg-dark-tertiary dark:text-white dark:focus:outline-none`}
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                    />
                </div>
                <button
                    type="submit"
                    className={` mt-4 flex w-full justify-center rounded-md border border-transparent bg-blue-primary px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600 ${!isFormValid() || isLoading ? "cursor-not-allowed opacity-50" : ""
                        }`}
                    disabled={!isFormValid() || isLoading}
                >
                    {isLoading ? "Creating..." : "Create Project"}
                </button>
            </form>
        </Modal>
    );
};

export default ModalNewProject;
