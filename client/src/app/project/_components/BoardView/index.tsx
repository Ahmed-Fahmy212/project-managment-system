import { Column } from "@/state/api";
import toast from "react-hot-toast";
import { DndContext, DragEndEvent, DragOverlay, DragStartEvent } from '@dnd-kit/core'
import { TaskColumn } from './taskColumn'
import { arrayMove, SortableContext, useSortable } from '@dnd-kit/sortable'
import { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getColumns, updateColumns } from "@/state/column,api";
import ColumnForm from "./columnForm";
import { createPortal } from "react-dom";
import { ColumnBody, addColumn, UpdateData } from "@/state/column,api";
type BoardViewProps = {
  id: string;
  setIsModalNewTaskOpen: (isOpen: boolean) => void;
};
// use client ?
const BoardView = ({ id, setIsModalNewTaskOpen }: BoardViewProps) => {
  const projectId = Number(id);
  const [isNewColumnFormOpen, setIsNewColumnFormOpen] = useState(false);
  const [activeColumn, setActiveColumn] = useState<Column>();

  // want when first fetch take columns with tasks associated with i thing it`s faster check the speed 
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

  const { isPending: isPendingUpdate, mutateAsync: updateColumnsMutation, isError } = useMutation({
    mutationFn: (orders: UpdateData) => updateColumns(orders),
    onSettled: async (newData) => {
      queryClient.setQueryData(['columns', projectId], (oldData: Column[] | undefined) => {
        if (!oldData) return oldData;

        const activeIndex = oldData.findIndex(col => col.id === newData?.previousColData.id);
        const targetIndex = oldData.findIndex(col => col.id === newData?.TargetColData.id);

        if (activeIndex === -1 || targetIndex === -1) return oldData;
        return arrayMove(oldData, activeIndex, targetIndex);
      });
    },
  })


  // custom function tohanle all this 
  if (isPending || isPendingUpdate) return <div>Loading...</div>
  if (isFetching) return <div>Updating...</div>
  if (error || isError) {
    // handle axios
    // if (error.status === "FETCH_ERROR") {
    //   toast.error("server not working")
    //   return <div className="flex justify-center items-center text-xl">server not working ...</div>
    // }
    toast.error(`An error has occurred: ${error?.message || isError}`);
    return;
  }
  // find solution for this // i think there is bug here
  const columnsIds = columns.map((column) => column.id)

  const handleDraggEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over) return;

    const activeColumnId = active.id as number;
    const activeColumnOrder = active.data.current?.column.order as number;

    const overColumnId = over.id as number;

    console.log('💚activeColumnId', activeColumnId)
    console.log('💚overColumnId', overColumnId)
    console.log('💚activeColumnOrder', activeColumnOrder)

    if (activeColumnId === overColumnId) return;
    updateColumnsMutation({
      previouseColumnId: activeColumnId,
      targetColumnId: overColumnId,
      previoueColumnOrder: activeColumnOrder,
      projectId
    });
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
            {columns?.map((column: Column) => (
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
