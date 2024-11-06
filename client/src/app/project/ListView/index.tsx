import Header from "@/components/Header";
import TaskCard from "@/components/TaskCard";
import { Task, useGetTasksQuery } from "@/state/api";
import React from "react";

type Props = {
  id: string;
  setIsModalNewTaskOpen: (isOpen: boolean) => void;
};

const ListView = ({ id, setIsModalNewTaskOpen }: Props) => {
  const {
    data: tasks,
    error,
    isLoading,
  } = useGetTasksQuery({ projectId: Number(id) });

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>An error occurred while fetching tasks</div>;

  return (
    <div className="px-5 pb-8 xl:px-6 overflow-y-hidden ">
      <div className="pt-4">
        <Header
          name="List"
          buttonComponent={
            <button
              className="flex items-center rounded bg-blue-950 px-3 py-2 text-white hover:bg-black hover:duration-300"
              onClick={() => setIsModalNewTaskOpen(true)}
            >
              Add Task
            </button>
          }
          isSmallText
        />
      </div>
        <div className="p-4 h-full w-full overflow-y-scroll ">
          <div className=" grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 lg:gap-6 ">
            {tasks?.data?.map((task: Task) => <TaskCard key={task.id} task={task} />)}
          </div>
        </div>

    </div>
  );
};

export default ListView;
