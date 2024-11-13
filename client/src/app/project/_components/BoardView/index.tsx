import { Column } from "@/state/api";
import toast from "react-hot-toast";
import { DndContext, DragEndEvent, DragOverlay, DragStartEvent } from '@dnd-kit/core'
import { TaskColumn } from './taskColumn'
import { SortableContext, useSortable } from '@dnd-kit/sortable'
import { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { addColumn, getColumns } from "@/state/column,api";
import ColumnForm from "./columnForm";
import { createPortal } from "react-dom";
type ColumnBody = {
  title: string;
  color: string;
  projectId: number;
};

type BoardViewProps = {
  id: string;
  setIsModalNewTaskOpen: (isOpen: boolean) => void;
};
// use client ?
const BoardView = ({ id, setIsModalNewTaskOpen }: BoardViewProps) => {
  const projectId = Number(id);
  const [isNewColumnFormOpen, setIsNewColumnFormOpen] = useState(false);
  const [activeColumn, setActiveColumn] = useState<Column>();


  const { data: columns, isPending, error, isFetching } = useQuery({
    queryKey: ['columns', projectId],
    queryFn: () => getColumns(projectId),
  }
  )
  const queryClient = useQueryClient()
  const { mutateAsync: addColumnMutation } = useMutation({
    mutationFn: (newColumn: ColumnBody) => addColumn(newColumn),
    onSuccess: (newColumn) => {
      queryClient.setQueryData(['columns', projectId], (oldData: Column[] | undefined) => {
        return oldData ? [...oldData, newColumn] : [newColumn];
      });
    }
  });
  // custom function tohanle all this 
  if (isPending) return <div>Loading...</div>
  if (isFetching) return <div>Updating...</div>
  if (error) {
    // handle axios
    if (error.status === "FETCH_ERROR") {
      toast.error("server not working")
      return <div className="flex justify-center items-center text-xl">server not working ...</div>
    }
    return <div>An error has occurred: {error.message}</div>
  }
  // find solution for this 
  const columnsIds = columns.map((column) => column.id)

  const handleDraggEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over) return;

    const ActiveColumnId = active.id as number;
    const newStatus = over.id as string;
    // updateTaskStatus({ taskId, status: newStatus });
  }
  const handleDraggStart = (event: DragStartEvent) => {
    console.log(event)
    if (event.active.data.current?.type === 'Column') {
      console.log('Column', event.active.data.current)
      setActiveColumn(event.active.data.current.column);
      return;
    }
  }
  return (
    <div className="flex-1 overflow-y-scroll">
      <DndContext onDragEnd={handleDraggEnd} onDragStart={handleDraggStart}>
        <div className="gap-4 grid grid-cols-footer pl-4">
          <SortableContext items={columnsIds}>
            {
            columns?.map((column: Column) => (
              <TaskColumn
                column={column}
                setIsModalNewTaskOpen={setIsModalNewTaskOpen}
                addColumnMutation={addColumnMutation}
              />
            ))
            }
            <ColumnForm projectId={projectId} AddColumnMutation={addColumnMutation} />
          </SortableContext>

          {createPortal(
            <DragOverlay>{
              activeColumn && (
                <TaskColumn
                  column={activeColumn}
                  setIsModalNewTaskOpen={setIsModalNewTaskOpen}
                  addColumnMutation={addColumnMutation}
                />
              )
            }
            </DragOverlay>
            , document.body
          )}

        </div>
      </DndContext>
    </div>
  );
};
export default BoardView;
