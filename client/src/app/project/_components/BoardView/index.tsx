'use client'
import { Column, Task as TaskType } from "@/state/api";
import toast from "react-hot-toast";
import { DndContext, DragEndEvent, DragOverEvent, DragOverlay, DragStartEvent } from '@dnd-kit/core'
import { TaskColumn } from './taskColumn'
import { arrayMove, horizontalListSortingStrategy, SortableContext, sortableKeyboardCoordinates, useSortable } from '@dnd-kit/sortable'
import { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getColumns, updateColumns } from "@/state/column.api";
import ColumnForm from "./columnForm";
import { createPortal } from "react-dom";
import { ColumnBody, addColumn, UpdateData } from "@/state/column.api";
import { getTasks, updateTasks, UpdateTasksData } from "@/state/tasks.api";
import { Task } from "./task";
import {
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
type BoardViewProps = {
  id: string;
  setIsModalNewTaskOpen: (isOpen: boolean) => void;
};
// use client ?
const BoardView = ({ id, setIsModalNewTaskOpen }: BoardViewProps) => {
  const projectId = Number(id);
  const [activeColumn, setActiveColumn] = useState<Column | null>();
  const [activeTask, setActiveTask] = useState<TaskType | null>();
  const [columnsIds, setColumnsIds] = useState<number[]>([])
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // want when first fetch take columns with tasks associated with i thing it`s faster check the speed 
  const { data: columns, isPending, error, isFetching } = useQuery({
    queryKey: ['columns', projectId],
    queryFn: () => getColumns(projectId),
  }
  )

  //------------------------------------------------------------------------------------
  const { data: tasks, isPending: isPendingTasks, error: tasksError, isFetching: isFetchingTasks } = useQuery({
    queryKey: ['tasks', projectId],
    queryFn: () => getTasks(projectId),
  })
  //------------------------------------------------------------------------------------
  const queryClient = useQueryClient()
  const { mutateAsync: addColumnMutation } = useMutation({
    mutationFn: (newColumn: ColumnBody) => addColumn(newColumn),
    onSuccess: (newColumn) => {
      queryClient.setQueryData(['columns', projectId], (oldData: Column[] | undefined) => {
        console.log('Adding new column:', newColumn);
        console.log('oldData new column:', oldData);
        return oldData ? [...oldData, newColumn] : [newColumn];
      });
    }
  });
  const { isPending: isPendingUpdate, mutateAsync: updateColumnsMutation, isError } = useMutation({
    mutationFn: (orders: UpdateData) => updateColumns(orders),
    onSettled: (newData) => {
      queryClient.setQueryData(['columns', projectId], (oldData: Column[] | undefined) => {
        if (!oldData) return oldData;

        const activeIndex = oldData.findIndex(col => col.order === newData?.previousColData?.order);
        const targetIndex = oldData.findIndex(col => col.order === newData?.targetColData?.order);

        if (activeIndex === -1 || targetIndex === -1) return oldData;
        const rearrangedColumnsOrder = arrayMove(oldData, activeIndex, targetIndex)
        const setrearrangedColumnsOrder = rearrangedColumnsOrder.map((col) => (col.order));

        console.log(`💛💛💛rearrangedColumnsOrder :${setrearrangedColumnsOrder}`);
        setColumnsIds(setrearrangedColumnsOrder)
        return rearrangedColumnsOrder
      });
    },
  })
  const { mutateAsync: updateTasksMutation, error: tasksUpdateError, isPending: tasksUpdatePending } = useMutation({
    mutationFn: (tasksUpdate: UpdateTasksData) => updateTasks(tasksUpdate),
    onSettled: async (newData) => {
      console.log('Updating tasks with new data:', newData);
      queryClient.setQueryData(['tasks', projectId], (oldData: TaskType[] | undefined) => {
        if (!oldData) return oldData;

        const activeIndex = oldData.findIndex(task => task.id === newData?.previouseTaskData?.id);
        const targetIndex = oldData.findIndex(task => task.id === newData?.targetTaskData?.id);

        if (activeIndex === -1 || targetIndex === -1) return oldData;
        if (!newData?.previouseTaskData || !newData?.targetTaskData) return oldData;

        return arrayMove(oldData, activeIndex, targetIndex);
      });
    },
  });
  //------------------------------------------------------------------------------------
  if (isPendingTasks) return <div>Loading tasks...</div>;
  if (isFetchingTasks) return <div>Updating tasks...</div>;
  if (tasksError) {
    toast.error(`An error has occurred while fetching tasks: ${tasksError.message}`);
    return;
  }
  // custom function tohanle all this 
  if (isPending || isPendingUpdate || tasksUpdatePending) return <div>Loading...</div>
  if (isFetching) return <div>Updating...</div>
  if (error || isError || tasksUpdateError) {
    // handle axios
    // if (error.status === "FETCH_ERROR") {
    //   toast.error("server not working")
    //   return <div className="flex justify-center items-center text-xl">server not working ...</div>
    // }
    toast.error(`An error has occurred: ${error?.message || isError || tasksUpdateError}`);
    return;
  }
  //------------------------------------------------------------------------------------

  const handleDraggEnd = async (event: DragEndEvent) => {
    setActiveColumn(null);
    setActiveTask(null);

    const { active, over } = event;
    if (!over) return;

    const activeColumnId = active.id as number;
    const activeColumnOrder = active.data.current?.column?.order as number;
    const overColumnId = over.id as number;

    if (activeColumnId === overColumnId) return;
    if (!activeColumnOrder || !activeColumnId || !overColumnId) return;
    

    console.log('💚activeColumnId', activeColumnId)
    console.log('💚overColumnId', overColumnId)
    console.log('💚activeColumnOrder', activeColumnOrder)


    await updateColumnsMutation({
      previouseColumnId: activeColumnId,
      targetColumnId: overColumnId,
      previoueColumnOrder: activeColumnOrder,
      projectId
    });

  }
  const handleDraggStart = (event: DragStartEvent) => {
    if (event.active.data.current?.type === 'Column') {
      setActiveColumn(event.active.data.current.column);
      return;
    }
    if (event.active.data.current?.type === 'Task') {
      setActiveTask(event.active.data.current.task)
      return;
    }
  }
  const handleDraggOver = (event: DragOverEvent) => {
    const { active, over } = event;
    if (!over) return;

    const activeTaskId = active.id as number;
    const overTaskId = over.id as number;
    if (activeTaskId === overTaskId) return;
    if (!activeTaskId) return;

    const isActiveTask = active.data.current?.type === 'Task';
    const isOverTask = over.data.current?.type === 'Task';

    if (isActiveTask && isOverTask) {
      const activeTaskIndex = tasks.findIndex(task => task.id === activeTaskId);
      const overTaskIndex = tasks.findIndex(task => task.id === overTaskId);
      if (activeTaskIndex === -1 || overTaskIndex === -1) return;

      console.log(`Moving task ${activeTaskId} from index ${activeTaskIndex} to index ${overTaskIndex}`);


      // updateTasksMutation({
      //   previousColumnId: activeColumn?.id as number,
      //   targetColumnId: over.data.current?.column?.id as number,
      //   projectId,
      //   targetTaskId: overTaskId,
      //   previouseTaskId: activeTaskId,
      //   previouseTaskOrder: tasks[activeTaskIndex].order,

      // });
      // return arrayMove(tasks, activeTaskIndex, overTaskIndex);
      // over another task in another column
    }
  }
  // const newIds = columns?.map(column => column.order);
  // if (newIds && JSON.stringify(newIds) !== JSON.stringify(columnsIds)) {
  if (columnsIds.length === 0 ) {
    const Ids = columns?.map(column => column.order)
    setColumnsIds(Ids);
  }
  console.log('💛💛💛columnsIds:', columnsIds);
  //   setColumnsIds(newIds);
  // }

  return (
    <div className="flex-1 overflow-y-scroll">
      <DndContext onDragEnd={handleDraggEnd} onDragStart={handleDraggStart} onDragOver={handleDraggOver} sensors={sensors}
      >
        <div className="gap-4 grid grid-cols-footer pl-4">
          <SortableContext items={columnsIds} >
            {columns?.map((column: Column) => (
              <TaskColumn
                column={column}
                setIsModalNewTaskOpen={setIsModalNewTaskOpen}
                addColumnMutation={addColumnMutation}
                tasks={tasks?.filter((task) => task.columnId === column.id)}
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
                  tasks={tasks?.filter((task) => task.columnId === activeColumn.id)}

                />
              )
            }
              {/* {
                activeTask && (
                  // function delete + update 
                  <Task task={activeTask} />
                )
              } */}
            </DragOverlay>
            , document.body
          )}

        </div>
      </DndContext>
    </div>
  );
};
export default BoardView;
