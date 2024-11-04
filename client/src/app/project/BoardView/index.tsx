import { useGetTasksQuery, useUpdateTaskMutation } from "@/state/api";
import { Task as Tasks } from "@/state/api";
import { DndProvider, useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { format } from "date-fns";
import Image from "next/image";
import { EllipsisVertical, MessageSquareMore, Plus } from "lucide-react";
import toast from "react-hot-toast";

type BoardViewProps = {
  id: string;
  setIsModalNewTaskOpen: (isOpen: boolean) => void;
};

const taskStatus = ["To Do", "Work In Progress", "Under Review", "Completed"];

const BoardView = ({ id, setIsModalNewTaskOpen }: BoardViewProps) => {
  const {
    data: tasks,
    isLoading,
    error,
  } = useGetTasksQuery({ projectId: Number(id) });

  const [updateTaskStatus] = useUpdateTaskMutation();
  const moveTask = (taskId: number, toStatus: string) => {
    updateTaskStatus({ taskId, status: toStatus });
  };

  if (error) {
    toast.error(JSON.stringify(error))
  }
  return (
    <DndProvider backend={HTML5Backend}>
      <div className="pl-4 w-full h-svh grid grid-cols-footer overflow-x-scroll gap-4 ">
        {taskStatus.map((status) => (
          <TaskColumn
            key={status}
            status={status}
            tasks={tasks?.data || []}
            moveTask={moveTask}
            setIsModalNewTaskOpen={setIsModalNewTaskOpen}
          />
        ))}
      </div>
    </DndProvider>
  );
};
//================================================================================================================================================================
type TaskColumnProps = {
  key: string;
  status: string;
  tasks: Tasks[];
  moveTask: (taskId: number, toStatus: string) => void;
  setIsModalNewTaskOpen: (isopen: boolean) => void;
};
const TaskColumn = ({
  status,
  tasks,
  moveTask,
  setIsModalNewTaskOpen,
}: TaskColumnProps) => {
  const [{ isOver }, drop] = useDrop(() => ({
    accept: "task",
    drop: (item: { id: number }) => moveTask(item.id, status),
    collect: (monitor: any) => ({
      isOver: !!monitor.isOver(),
    }),
  }));
  const taskCount = tasks.filter((item) => item.status === status).length;

  const statusColor: any = {
    "To Do": "#2563EB",
    "Work In Progress": "#059669",
    "Under Review": "#D97706",
    "Completed": "#000000",
  };

  return (
    <div
      ref={(instance) => {
        drop(instance);
      }}
      className={`rounded-lg py-2 sm:py-4 xl:px-2 ${isOver ?
        "bg-blue-200 dark:bg-neutral-950 transition duration-500" : ""}`}
    >
      <div className="mb-3 flex w-full">
        <div
          className={`w-2 !bg-[${statusColor[status]}] rounded-s-lg`}
          style={{ backgroundColor: statusColor[status] }}
        />
        <div className="flex w-full items-center justify-between rounded-e-lg bg-white px-5 py-4 dark:bg-dark-secondary">
          <h3 className="flex items-center text-base font-semibold dark:text-white">
            {status}{" "}
            <span
              className="ml-2 inline-block rounded-full bg-gray-200 p-1 text-center text-sm leading-none dark:bg-dark-tertiary"
              style={{ width: "1.5rem", height: "1.5rem" }}
            >
              {taskCount}
            </span>
          </h3>
          <div className="flex items-center gap-1">
            <button className="flex h-6 w-5 items-center justify-center dark:text-neutral-500">
              <EllipsisVertical size={26} />
            </button>
            <button
              className="flex h-6 w-6 items-center justify-center rounded bg-gray-200 dark:bg-dark-tertiary dark:text-white"
              onClick={() => setIsModalNewTaskOpen(true)}
            >
              <Plus size={16} />
            </button>
          </div>
        </div>
      </div>
      {tasks
        //TODO i think this bad
        .filter((task) => task.status === status)
        .map((task) => (
          <Task task={task} />
        ))}
    </div>
  );
};
//================================================================================================================================================================
type TaskProps = {
  task: Tasks;
};
const Task = ({ task }: TaskProps) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: "task",
    item: { id: task.id },
    collect: (monitor: any) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }));
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
      ref={(instance) => {
        drag(instance);
      }}
      className={`mb-4 rounded-md bg-white shadow dark:bg-dark-secondary flex flex-col
        ${isDragging ? "opacity-50   " : "opacity-100"}`
      }
    >
      {task.attachments && task.attachments.length > 0 && (
        <Image
          src={`/${task.attachments[0].fileURL}`}
          alt={`/${task.attachments[0].fileName}`}
          width={200}
          height={200}
          className="h-auto w-full rounded-t-md"
        />
      )}

      <div className="px-4 pt-4 md:px-6 md:pt-6">
        <div className="flex items-start justify-between">
          {/* priority && tag */}
          <div className="flex flex-1 flex-wrap items-center gap-2">
            {task.priority && <PriorityTag priority={task.priority} />}
            <div className="flex gap-2">
              {taskTagsSplit.map((tag) => (
                <div key={tag} className="rounded-full bg-blue-100 px-2 py-1 text-xs">
                  {" "}
                  {tag}
                </div>
              ))}
            </div>
          </div>
          {/* Ellips */}
          <button className="flex h-6 w-4 items-center justify-center dark:text-neutral-500">
            <EllipsisVertical size={26} />
          </button>
        </div> 
        {/*-----------*/}

        <div className="my-3 flex justify-between items-center">
          <h4 className="text-md font-bold dark:text-white">{task.title}</h4>
          {task.points && (
            <div className="text-xs font-semibold dark:text-white">
              {task.points} pts
            </div>
          )}
          <div className="text-[4px] flex flex-col text-gray-500 dark:text-neutral-500">
            {formattedStartDate && <span>{formattedStartDate} </span>}
            {formattedDueDate && <span>{formattedDueDate}</span>}
          </div>
        </div>
        <p className="text-sm text-gray-600 dark:text-neutral-500">
          {task.description}
        </p>
        <div className="mt-4 border-t border-gray-200 dark:border-stroke-dark" />
      </div>
      {/* assignee + commments + shape icon */}
      <div className="p-2 flex items-center justify-between ">
        <div className="flex -space-x-[6px] overflow-hidden">

          {
            task.assignee &&
            <Image
              key={`${task.assignee.id}`}
              src={`/${task.assignee?.profilePictureUrl}`}
              alt={`/${task.assignee.name}`}
              width={30}
              height={30}
              className="rounded-full h-8 w-8 border-2 border-white object-cover dark:border-dark-secondary"
            />
          }
          {
            task.author &&
            <Image
              key={`${task.author.id}`}
              src={`/${task.author?.profilePictureUrl}`}
              alt={`/${task.author.name}`}
              width={30}
              height={30}
              className="rounded-full h-8 w-8 border-2 border-white object-cover dark:border-dark-secondary"
            />
          }

        </div>
        <div className="flex items-center text-gray-500 dark:text-neural-500">
          <MessageSquareMore size={20} />
          <span className="ml-1 text-sm dark:text-neural-400">
            {numberOfComments}
          </span>
        </div>
      </div>

    </div>
  );
};
export default BoardView;
