import { useGetTasksQuery } from "@/api/reactQuery/tasksQuery";
import Header from "@/components/Header";
import TaskCard from "@/components/TaskCard";
import { Task } from "@/state/api";
// import { Task, useGetTasksQuery } from "@/state/api";
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
  } = useGetTasksQuery(parseInt(id));

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>An error occurred while fetching tasks</div>;

  return (
    <div className="overflow-y-hidden pb-8 px-5 xl:px-6">
      <div className="pt-4 px-5">
        <Header
          name="List tasks new"
          buttonComponent={
            <button
              className="bg-blue-950 flex font-semibold hover:bg-black hover:duration-300 items-center px-3 py-2 rounded text-white"
              onClick={() => setIsModalNewTaskOpen(true)}
            >
              Add Task
            </button>
          }
          isSmallText
        />
      </div>
      <div className="h-full overflow-y-scroll p-4 scrollbar">
        <div className="gap-4 grid grid-cols-1 lg:gap-6 lg:grid-cols-3 md:grid-cols-2">
            {tasks?.slice().sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()).map((task: Task) => <TaskCard key={task.id} task={task} />)}
        </div>
      </div>

    </div>
  );
};

export default ListView;
