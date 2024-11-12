import { Column, Status, Task, useGetTasksQuery, useUpdateTaskMutation } from "@/state/api";
import { MessageSquareMore, Plus } from "lucide-react";
import toast from "react-hot-toast";
import { DndContext, DragEndEvent } from '@dnd-kit/core'
import { TaskColumn } from './taskColumn'
import { SortableContext } from '@dnd-kit/sortable'
import { useMemo, useState } from "react";
import { QueryClient, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from 'axios';
import { json } from "stream/consumers";
import { addColumn, getColumns } from "@/state/column,api";
import ColumnForm from "./columnForm";

type BoardViewProps = {
  id: string;
  setIsModalNewTaskOpen: (isOpen: boolean) => void;
};

const BoardView = ({ id, setIsModalNewTaskOpen }: BoardViewProps) => {
  const [isNewColumnFormOpen, setIsNewColumnFormOpen] = useState(false);
  const { data: columnsWithTasks, isPending, error, isFetching } = useQuery({
    queryKey: ['columnsWithTasks', Number(id)],//todo remove id
    // queryFn: async () => await getColumns(Number(id)),
    queryFn: () => getColumns(Number(id)),
  }
  )
  const queryClient = useQueryClient()

  const { mutateAsync: addColumnMutation } = useMutation({
    mutationFn: (newColumn: any) => addColumn(newColumn),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['columnsWithTasks', Number(id)] })
    }
  })

  if (isPending) return <div>Loading...</div>
  if (isFetching) return <div>Updating...</div>
  if (error) {
    if (error.status === "FETCH_ERROR") {
      toast.error("server not working")
      return <div className="flex justify-center items-center text-xl">server not working ...</div>
    }
    return <div>An error has occurred: {error.message}</div>
  }

  const handleDraggEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over) return;

    const taskId = active.id as number;
    const newStatus = over.id as string;
    // updateTaskStatus({ taskId, status: newStatus });
    // updateTaskStatus({ taskId, status: newStatus });
  }

  return (
    <div className="flex-1 overflow-y-scroll">
      <DndContext onDragEnd={handleDraggEnd}>
        <div className="gap-4 grid grid-cols-footer pl-4">
          {columnsWithTasks?.data?.map((column: Column) => (
            <TaskColumn
              id={column.id}
              status={column.title}
              tasks={column.task}
              setIsModalNewTaskOpen={setIsModalNewTaskOpen}
              addColumnMutation={addColumnMutation}
            />
          ))}
           <ColumnForm projectId={Number(id)} AddColumnMutation={addColumnMutation}  /> 
        </div>
      </DndContext>
    </div>
    // <div className="flex-1 overflow-y-s</div>croll">
    //   {/*  */}
    //   <DndContext onDragEnd={handleDraggEnd} >
    //     {/* array of columns now has full hight remaining in component previous */}
    //     <div className="gap-4 grid grid-cols-footer pl-4">
    //       {/* <SortableContext items={columnId}> */}

    //         {/* make this {key : [value]{} and remove O(2n) down*/}
    //         {taskStatus.map((status) => (
    //           <TaskColumn
    //             status={status}
    //             tasks={tasks?.data || []}
    //             setIsModalNewTaskOpen={setIsModalNewTaskOpen}
    //           />
    //         ))
    //         }
    //         <div className="rounded py-2 flex gap-2 items-center sm:mt-4 sm:p-0 xl:px-2  ring-rose-500 duration-300 hover:ring-2 cursor-pointer w-[311px] h-[49px] bg-white dark:bg-dark-secondary dark:text-white"><Plus className="bg-gray-200 dark:bg-dark-tertiary dark:text-white text-white flex gap-2" />new column</div>
    //       {/* </SortableContext> */}
    //     </div>

    //   </DndContext>
    // </div >
  );
};
export default BoardView;
