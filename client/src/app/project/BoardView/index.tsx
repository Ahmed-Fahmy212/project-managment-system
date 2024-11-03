import { useGetTasksQuery, useUpdateTaskMutation } from "@/state/api";
import { Task as Tasks } from "@/state/api";
import { DndProvider, useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { format } from "date-fns";
import Image from "next/image";
import { EllipsisVertical } from "lucide-react";

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
  console.log("💛💛 type of", typeof tasks?.data);
  console.log("💛💛 tasks?.data", tasks?.data);
  //TODO toast error must added 
  if (error) {
    console.log("❤❤❤❤error", error)
  }
  const [updateTaskStatus] = useUpdateTaskMutation();
  console.log("🧡🧡🧡updateTaskStatus", updateTaskStatus)
  const moveTask = (taskId: number, toStatus: string) => {
    updateTaskStatus({ taskId, status: toStatus });
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="pl-4 w-full h-svh grid grid-cols-footer overflow-x-scroll gap-4 ">
        {taskStatus.map((status) => (
          <TaskColumn
            key={status}
            status={status}
            tasks={tasks?.data || []}
            moveTask={moveTask}
            setIsModelNewTaskOpen={setIsModalNewTaskOpen}
          />
        ))}
      </div>
    </DndProvider>
  );
};
type TaskColumnProps = {
  key: string;
  status: string;
  tasks: Tasks[];
  moveTask: (taskId: number, toStatus: string) => void;
  setIsModelNewTaskOpen: (isopen: boolean) => void;
};

const TaskColumn = ({
  status,
  tasks,
  moveTask,
  setIsModelNewTaskOpen,
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
        "bg-blue-100 dark:bg-neutral-950" : ""}`}
    >

      {tasks
        //TODO i think this bad
        .filter((task) => task.status === status)
        .map((task) => (
          <Task task={task} />
        ))}
    </div>
  );
};


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
      className={`mb-4 rounded-md bg-white shadow dark:bg-dark-secondary 
        ${isDragging ? "opacity-50" : "opacity-100"}`
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

      <div className="p-4 md:p-6">
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

        <div className="my-3 flex justify-between">
          <h4 className="text-md font-bold dark:text-white">{task.title}</h4>
          {typeof task.points === "number" && (
            <div className="text-xs font-semibold dark:text-white">
              {task.points} pts
            </div>
          )}
          <div className="text-xs text-gray-500 dark:text-neutral-500">
            {formattedStartDate && <span>{formattedStartDate} - </span>}
            {formattedDueDate && <span>{formattedDueDate}</span>}
          </div>
        </div>
        <p className="text-sm text-gray-600 dark:text-neutral-500">
          {task.description}
        </p>
        <div className="mt-4 border-t border-gray-200 dark:border-stroke-dark" />
      </div>



    </div>
  );
};
export default BoardView;
