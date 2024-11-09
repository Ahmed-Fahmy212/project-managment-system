import { useAppSelector } from "@/app/redux";
import { Task, useGetTasksQuery } from "@/state/api";
import Header from "../../../../components/Header";
import { useMemo, useState } from "react";
import { Gantt } from "gantt-task-react";
type Props = {
    id: string;
    setIsModalNewTaskOpen: (isOpen: boolean) => void;
}
type TaskTypeItems = "task" | "milestone" | "project";

export enum ViewMode {
    Day = "Day",
    Week = "Week",
    Month = "Month",
}

interface DisplayOption {
    viewMode: ViewMode;
    locale: string;
}

export const Timeline = ({ id, setIsModalNewTaskOpen }: Props) => {
    // const isDarkMode = useAppSelector((state) => state.global.isDarkMode);

    const { data: tasks, error, isLoading } = useGetTasksQuery({ projectId: parseInt(id) });

    const [displayOptions, setDisplayOptions] = useState<DisplayOption>({
        viewMode: ViewMode.Month,
        locale: "en-US",
    });

    const handleViewModeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setDisplayOptions((prev) => ({
            ...prev,
            viewMode: event.target.value as ViewMode,
        }));
    };

    // const ganttTasks = useMemo(() => {
    //     return (
    //         tasks?.data.map((task) => ({
    //             start: new Date(task.startDate as string),
    //             end: new Date(task.dueDate as string),
    //             name: task.title,
    //             id: `Task-${task.id}`,
    //             type: "task" as TaskTypeItems,
    //             progress: task.points ? (task.points / 10) * 100 : 0,
    //             isDisabled: false,
    //         })) || []
    //     );
    // }, [tasks]);

    return (
        <div className="px-4 xl:px-6">
            {isLoading ? (
                <div>Loading...</div>
            ) : error ? (
                <div>Error...</div>
            ) : (
                <div className="px-4 xl:px-6">
                    <div className="flex py-5">
                        <Header
                            name="Timeline"
                            isSmallText
                            buttonComponent={
                                <button
                                    className="flex items-center rounded text-nowrap bg-gray-600 px-3 py-2 text-white cursor-not-allowed"
                                    onClick={() => setIsModalNewTaskOpen(true)}
                                    disabled
                                >
                                    Add New Task
                                </button>
                            }
                        />
                        <div className="w-64 pl-4">
                            <select
                                className="focus:shadow-outline block w-full appearance-none rounded border border-gray-400 bg-white px-4 py-2 pr-8 leading-tight shadow hover:border-gray-500 focus:outline-none dark:border-dark-secondary dark:bg-dark-secondary dark:text-white"
                                value={displayOptions.viewMode}
                                onChange={handleViewModeChange}
                            >
                                <option value={ViewMode.Day}>Day</option>
                                <option value={ViewMode.Week}>Week</option>
                                <option value={ViewMode.Month}>Month</option>
                            </select>
                        </div>
                    </div>
                    <div className="flex justify-center items-center h-full dark:text-white">
                        Coming Soon ...
                    </div>
                </div>
            )}
        </div>
    );
};
