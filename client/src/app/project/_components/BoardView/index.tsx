'use client'
import { Column, Task as TaskType } from "@/state/api";
import toast from "react-hot-toast";
import { DndContext, DragEndEvent, DragMoveEvent, DragOverEvent, DragOverlay, DragStartEvent } from '@dnd-kit/core'
import { TaskColumn } from './taskColumn'
import { arrayMove, horizontalListSortingStrategy, SortableContext, sortableKeyboardCoordinates, useSortable } from '@dnd-kit/sortable'
import { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getColumns, updateColumns } from "@/api/column.api";
import ColumnForm from "./columnForm";
import { createPortal } from "react-dom";
import { ColumnBody, addColumn, UpdateData } from "@/api/column.api";
import { createTask, getTasks, TaskDataBody, updateTasks, UpdateTasksData } from "@/api/tasks.api";
import { Task } from "./task";
import { Priority, Status, Task as TaskBody } from "@/state/api";

import {
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import { useGetTasksQuery, useUpdateTasksMutation } from "@/api/reactQuery/tasksQuery";
import { useAddColumnMutation, useUpdateColumnsMutation } from "@/api/reactQuery/columnQuery";
type BoardViewProps = {
  id: string;
  setIsModalNewTaskOpen: (isOpen: boolean) => void;
};
// use client ?
const BoardView = ({ id, setIsModalNewTaskOpen }: BoardViewProps) => {
  const projectId = Number(id);
  const [activeColumn, setActiveColumn] = useState<Column | null>();
  const [activeTask, setActiveTask] = useState<TaskType | null>();
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
  const { data: tasks, isPending: isPendingTasks, error: tasksError, isFetching: isFetchingTasks } = useGetTasksQuery(projectId)

  const { mutateAsync: addColumnMutation } = useAddColumnMutation(projectId)
  const { isPending: isPendingUpdate, mutateAsync: updateColumnsMutation, isError: isColumnsError } = useUpdateColumnsMutation(projectId);
  const { mutateAsync: updateTasksMutation, error: tasksUpdateError, isPending: isPendingTasksUpdate } = useUpdateTasksMutation(projectId);
  //------------------------------------------------------------------------------------
  const handleLoadingAndErrors = () => {
    const isLoading = isPendingTasks || isPendingUpdate || isPendingTasksUpdate;
    const isUpdating = isFetchingTasks;
    const error = tasksError || tasksUpdateError || isColumnsError;

    if (isLoading) return <div>Loading...</div>;
    if (isUpdating) return <div>Updating...</div>;
    if (error) {
      const errorMessage = error instanceof Error ? error.message : "An unexpected error occurred";
      toast.error(`An error has occurred: ${errorMessage}`);
      return <div className="flex justify-center items-center text-xl text-red-700">{errorMessage}</div>;
    }
  };
  handleLoadingAndErrors();
  //------------------------------------------------- Handle Events -------------------------------------------------

  const reorderColumns = (columns: Column[], activeColumnId: number, overColumnId: number) => {
    // find index of active column and over column
    const activeIndex = columns.findIndex(column => column.id === activeColumnId);
    const overIndex = columns.findIndex(column => column.id === overColumnId);
    if (activeIndex === -1 || overIndex === -1) return columns;

    // move active column to over column index
    const reorderedColumn = [...columns];
    const [removedColumn] = reorderedColumn.splice(activeIndex, 1);
    reorderedColumn.splice(overIndex, 0, removedColumn);

    // return array of new order array of id and new order
    return reorderedColumn.map((column, index) => ({ id: column.id, order: index }));
  }

  const handleDraggEnd = async (event: DragEndEvent) => {
    setActiveColumn(null);
    setActiveTask(null);

    const { active, over } = event;
    if (!over) return;

    const activeColumnId = active.id as number;
    const overColumnId = over.id as number;

    if (activeColumnId === overColumnId) return;
    if (!activeColumnId) return;

    if (!columns) return;
    const newOrder = reorderColumns(columns, activeColumnId, overColumnId);
    console.log('🤍newOrder', newOrder);

    await updateColumnsMutation({ newOrder, projectId });
  }
  //------------------------------------------------------------------------------------
  const swapOrderTasks = (tasks: TaskType[], activeIndex: number, overIndex: number) => {
    const reorderedTasks = [...tasks];
    const [removedTask] = reorderedTasks.splice(activeIndex, 1);
    reorderedTasks.splice(overIndex, 0, removedTask);

    return reorderedTasks.map((task, index) => ({ id: task.id, order: index }));
  }
  const handleDraggStart = (event: DragStartEvent) => {
    if (event.active.data.current?.type === 'Column') {
      console.log('🤍event.active.data.current.column', event.active.data.current.column)
      setActiveColumn(event.active.data.current.column);
      return;
    }
    if (event.active.data.current?.type === 'Task') {
      console.log('🤍event.active.data.current?.type', event.active.data.current?.type)
      setActiveTask(event.active.data.current.task)
      return;
    }
  }
  //------------------------------------------------------------------------------------
  const handleDraggOver = async (event: DragOverEvent) => {
    const { active, over } = event;
    if (!over) return;

    const activeTaskId = active.id as number;
    const overTaskId = over.id as number;

    // if (!activeTaskId) return;
    if (activeTaskId === overTaskId) return;

    const isActiveTask = active.data.current?.type === 'Task';
    const isOverTask = over.data.current?.type === 'Task';
    console.log('🤍isActiveTask', isActiveTask, isOverTask)
    if (isActiveTask && isOverTask && tasks) {
      const activeTaskIndex = tasks.findIndex(task => task.id === activeTaskId);
      const overTaskIndex = tasks.findIndex(task => task.id === overTaskId);

      if (activeTaskIndex === -1 || overTaskIndex === -1) return;

      console.log(`Moving task ${activeTaskId} from index ${activeTaskIndex} to index ${overTaskIndex}`);
      //validate this
      // const overTask = tasks[overTaskIndex];
      const overTask = tasks.find(task => task.id === overTaskId);
      if (activeTask?.columnId === overTask?.columnId) {
        const newOrderTasks = swapOrderTasks(tasks, activeTaskIndex, overTaskIndex);
        await updateTasksMutation({
          projectId,
          newOrderPrev: newOrderTasks,
        });
      }
      // return arrayMove(tasks, activeTaskIndex, overTaskIndex);
      // over another task in another column
    }
  }
  //------------------------------------------------------------------------------------
  const columnsIds = columns?.sort((a, b) => a.order - b.order);
  const tasksIds = tasks?.sort((a, b) => a.order - b.order);
  // console.log('🤍columnsIds', columnsIds)
  return (
    <div className="flex-1 overflow-y-scroll">
      <DndContext
        onDragEnd={handleDraggEnd}
        onDragStart={handleDraggStart}
        onDragOver={handleDraggOver}
        sensors={sensors}
        collisionDetection={closestCenter}
      >
        <div className="gap-4 grid grid-cols-footer pl-4">
          <SortableContext items={columnsIds || []} >
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
                  tasks={tasksIds}
                />
              )
            }
              {
                activeTask && (
                  // function delete + update 
                  <Task task={activeTask} />
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
