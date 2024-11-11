import { Status, useGetTasksQuery, useUpdateTaskMutation } from "@/state/api";
import { Task as Tasks } from "@/state/api";
import { format } from "date-fns";
import Image from "next/image";
import { EllipsisVertical, MessageSquareMore, Plus } from "lucide-react";
import toast from "react-hot-toast";
import { DndContext, DragEndEvent } from '@dnd-kit/core'
import { TaskColumn } from './taskColumn'

type BoardViewProps = {
  id: string;
  setIsModalNewTaskOpen: (isOpen: boolean) => void;
};
// will be dynamic
const taskStatus = ["To Do", "Work In Progress", "Under Review", "Completed"];

const BoardView = ({ id, setIsModalNewTaskOpen }: BoardViewProps) => {
  const {
    data: tasks,
    isLoading,
    error,
  } = useGetTasksQuery({ projectId: Number(id) });

  const [updateTaskStatus] = useUpdateTaskMutation();

  const handleDraggEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over) return;

    const taskId = active.id as number;
    const newStatus = over.id as string;
    if (taskId && newStatus) updateTaskStatus({ taskId, status: newStatus });
    // updateTaskStatus({ taskId, status: newStatus });
  }
  if (error) {
    if (error.status === "FETCH_ERROR") {
      toast.error("server not working")
      return <div className="flex justify-center items-center text-xl">server not working ...</div>
    }
    toast.error(JSON.stringify(error))
  }
  return (
    <div className="flex-1 overflow-y-scroll">
      {/*  */}
      <DndContext onDragEnd={handleDraggEnd}>
        {/* array of columns now has full hight remaining in component previous */}
        <div className="gap-4 grid grid-cols-footer pl-4">

          {/* make this {key : [value]{} and remove O(2n) down*/} 
          {taskStatus.map((status) => (
            <TaskColumn
              status={status}
              tasks={tasks?.data || []}
              setIsModalNewTaskOpen={setIsModalNewTaskOpen}
            />
          ))}
        </div>
      </DndContext>
    </div>
  );
};
export default BoardView;
