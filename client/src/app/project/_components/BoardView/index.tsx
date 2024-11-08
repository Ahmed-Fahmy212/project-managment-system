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
    <div className="flex-1 overflow-y-scroll">
      <DndProvider backend={HTML5Backend}>
        {/* array of columns now has full hight remaining in component previous */}
        <div className="gap-4 grid grid-cols-footer pl-4">
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
    </div>
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
        {task.attachments && task.attachments.length > 0 && (
          <Image
            src={`/${task.attachments[0].fileURL}`}
            alt={`/${task.attachments[0].fileName}`}
            width={200}
            height={200}
            className="h-auto mt-4 w-full"
          />
        )}
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
export default BoardView;
