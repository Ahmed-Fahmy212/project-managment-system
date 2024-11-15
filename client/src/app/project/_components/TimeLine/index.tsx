import { Task } from "@/state/api";
import Header from "../../../../components/Header";
import { useMemo, useState } from "react";
import { ScheduleXCalendar, useNextCalendarApp } from '@schedule-x/react/dist/index';
import {
    createViewDay,
    createViewMonthAgenda,
    createViewMonthGrid,
    createViewWeek,
} from '@schedule-x/calendar'
import { createEventsServicePlugin } from '@schedule-x/events-service'
import { useEffect } from "react";
import '@schedule-x/theme-default/dist/index.css'

type Props = {
    id: string;
    setIsModalNewTaskOpen: (isOpen: boolean) => void;
}

// interface DisplayOption {
//     viewMode: ViewMode;
//     locale: string;
// }

export const Timeline = ({ id, setIsModalNewTaskOpen }: Props) => {
    // const isDarkMode = useAppSelector((state) => state.global.isDarkMode);

    // const { data: tasks, error, isLoading } = useGetTasksQuery({ projectId: parseInt(id) });
    // const plugins = [createEventsServicePlugin()]

    // const taskSingle = tasks?.data.map(task => ({
    //     id,
    //     title: task.title,
    //     start: task.startDate ? new Date(task.startDate).toISOString() : new Date().toISOString(),
    //     end: task.dueDate ? new Date(task.dueDate).toISOString() : task.startDate ? new Date(task.startDate).toISOString() : new Date().toISOString()
    // })) || [];
    // const calendar = useNextCalendarApp({
    //     views: [createViewDay(), createViewWeek(), createViewMonthGrid(), createViewMonthAgenda()],
    //     events: [
    //         // {
    //         //   id: '1',
    //         //   title: 'Event 1',
    //         //   start: '2024-10-11',
    //         //   end: '2024-10-12',
    //         // },
    //       ],
        
    // }, plugins)
    // // const [displayOptions, setDisplayOptions] = useState<DisplayOption>({
    // //     viewMode: ViewMode.Month,
    // //     locale: "en-US",
    // // });

    // // const handleViewModeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    // //     setDisplayOptions((prev) => ({
    // //         ...prev,
    // //         viewMode: event.target.value as ViewMode,
    // //     }));
    // // };
    // useEffect(() => {
    //     // get all events
    //     calendar?.eventsService.getAll()
    // }, [])
    // // const ganttTasks = useMemo(() => {
    // //     return (
    // //         tasks?.data.map((task) => ({
    // //             start: new Date(task.startDate as string),
    // //             end: new Date(task.dueDate as string),
    // //             name: task.title,
    // //             id: `Task-${task.id}`,
    // //             type: "task" as TaskTypeItems,
    // //             progress: task.points ? (task.points / 10) * 100 : 0,
    // //             isDisabled: false,
    // //         })) || []
    // //     );
    // // }, [tasks]);

    // return (
    //     <div className="px-4 xl:px-6">
    //         {isLoading ? (
    //             <div>Loading...</div>
    //         ) : error ? (
    //             <div>Error...</div>
    //         ) : (
    //             <div className="px-4 xl:px-6">
    //                 <div className="flex py-5 z-10">
    //                     <Header
    //                         name="Timeline"
    //                         isSmallText
    //                         buttonComponent={
    //                             <button
    //                                 className=" z-10 flex items-center rounded text-nowrap bg-black hover:text-gray-200 px-3 py-2 text-white"
    //                                 onClick={() => setIsModalNewTaskOpen(true)}
    //                             >
    //                                 Add New Task
    //                             </button>
    //                         }
    //                     />
    //                     {/* <div className="w-64 pl-4">
    //                         <select
    //                             className="focus:shadow-outline block w-full appearance-none rounded border border-gray-400 bg-white px-4 py-2 pr-8 leading-tight shadow hover:border-gray-500 focus:outline-none dark:border-dark-secondary dark:bg-dark-secondary dark:text-white"
    //                             value={displayOptions.viewMode}
    //                             onChange={handleViewModeChange}
    //                         >
    //                             <option value={ViewMode.Day}>Day</option>
    //                             <option value={ViewMode.Week}>Week</option>
    //                             <option value={ViewMode.Month}>Month</option>
    //                         </select>
    //                     </div> */}
    //                 </div>
    //                 <div className="z-0 ">
    //                     <ScheduleXCalendar calendarApp={calendar} />
    //                 </div>
    //                 <div className="pt-4"></div>
    //             </div>
    //         )}
    //     </div>
    // );
};
