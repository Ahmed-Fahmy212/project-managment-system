'use client'
import { Column, Task as TaskType } from "@/state/api";
import toast from "react-hot-toast";
import { DndContext, DragEndEvent, DragMoveEvent, DragOverEvent, DragOverlay, DragStartEvent } from '@dnd-kit/core'
import { TaskColumn } from './taskColumn'
import { arrayMove, horizontalListSortingStrategy, SortableContext, sortableKeyboardCoordinates, useSortable } from '@dnd-kit/sortable'
import { useMemo, useRef, useState } from "react";
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
type orderID = {
  id: number;
  order: number;
}
const BoardView = ({ id, setIsModalNewTaskOpen }: BoardViewProps) => {
  const projectId = Number(id);
  const [activeColumn, setActiveColumn] = useState<Column | null>(null);
  const [activeTask, setActiveTask] = useState<TaskType | null>(null);
  const reorderedColumnsRef = useRef<{ orderIds: orderID[] }>({ orderIds: [] });
  const reorderedTasksRef = useRef<{ orderIds: orderID[], columnId?: number, activeTaskId?: number }>({ orderIds: [] });
  // why 
  // const [isTaskDragging, setIsTaskDragging] = useState(false);
  // const [isColumnDragging, setIsColumnDragging] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );


  const { data: columns, isPending, error, isFetching } = useQuery({
    queryKey: ['columns', projectId],
    queryFn: () => getColumns(projectId),
  }
  )
  const customColumn = columns//?.filter((col) => col.id === 1 || col.id === 2) || [];
  //------------------------------------------------------------------------------------
  const { data: tasks, isPending: isPendingTasks, error: tasksError, isFetching: isFetchingTasks } = useGetTasksQuery(projectId)
  const queryClient = useQueryClient();
  const { mutateAsync: addColumnMutation } = useMutation({
    mutationFn: (newColumn: ColumnBody) => addColumn(newColumn),
    // onMutate: async (newColumn) => {
    //   await queryClient.cancelQueries({ queryKey: ['columns', projectId] });

    //   const previousColumns = queryClient.getQueryData(['columns', projectId]);

    //   queryClient.setQueryData(['columns', projectId], (oldData: Column[] | undefined) => {
    //     const newColumnWithId = { ...newColumn, id: Math.max(...(oldData ?? []).map(col => col.id), 0) + 1 };
    //     return oldData ? [...oldData, newColumnWithId] : [newColumnWithId];
    //   });

    //   return { previousColumns };
    // },
    // onSettled: () => {
      //   queryClient.invalidateQueries({ queryKey: ['columns', projectId] });
      // }
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['columns', projectId] });
      },
      onError: (error) => {
        const errorMessage = error instanceof Error ? error.message : "An unexpected error occurred";
        toast.error(`Failed to add column: ${errorMessage}`);      },
  });
  const { isPending: isPendingUpdate, mutateAsync: updateColumnsMutation, isError: isColumnsError } = useMutation({
    mutationFn: (newOrderColumns: { projectId: number, newOrder: orderID[] }) => updateColumns(newOrderColumns),
    // onMutate: (newOrderColumns) => {
    //   queryClient.cancelQueries({ queryKey: ['columns', projectId] });

    //   const previousColumns = queryClient.getQueryData(['columns', projectId]);
    //   let updatedColumns;
    //   queryClient.setQueryData(['columns', projectId], (oldData: Column[]) => {
    //     if (!oldData) return oldData;

    //     updatedColumns = oldData
    //       .map((column) => {
    //         const updatedColumn = newOrderColumns.newOrder.find((newColumn) => newColumn.id === column.id);
    //         return updatedColumn ? { ...column, ...updatedColumn } : column;
    //       })
    //       .sort((a, b) => (a.order || 0) - (b.order || 0));

    //     return updatedColumns;
    //   });

    //   return { previousColumns };
    // },
    onError: (error, _, context) => {
      // queryClient.setQueryData(['columns', projectId], context?.previousColumns);

    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['columns', projectId] });
    },
  });

  const { mutateAsync: updateTasksMutation, error: tasksUpdateError, isPending: isPendingTasksUpdate } = useMutation({
    mutationFn: (tasksUpdate: UpdateTasksData) => updateTasks(tasksUpdate),
    // onMutate: async (newOrderTasks) => {
    //   await queryClient.cancelQueries({ queryKey: ['tasks', projectId] });

    //   const previousTasks = queryClient.getQueryData(['tasks', projectId]);
    //   queryClient.setQueryData(['tasks', projectId], (oldData: TaskType[] | undefined) => {
    //     if (!oldData) return oldData;

    //     const updatedTasks = oldData.map((task) => {
    //       const updatedTask = newOrderTasks.newOrder.find((newTask) => newTask.id === task.id);
    //       return updatedTask ? { ...task, ...updatedTask } : task;
    //     }).sort((a, b) => a.order - b.order);

    //     if (reorderedTasksRef.current.columnId !== undefined) {
    //       const activeTask = updatedTasks.find((task) => task.id === reorderedTasksRef.current.activeTaskId);
    //       if (activeTask) {
    //         const updatedTask = { ...activeTask, columnId: reorderedTasksRef.current.columnId };
    //         setActiveTask(updatedTask);
    //       }
    //     }
    //     return updatedTasks;
    //   });

    //   return { previousTasks };
    // },
    onError: (error, _, context) => {
      // queryClient.setQueryData(['tasks', projectId], context?.previousTasks);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks', projectId] });
    }
  });
  //------------------------------------------------------------------------------------
  if (!tasks) return <div>Loading...</div>;
  (function handleLoadingAndErrors() {
    const isLoading = isPendingTasks || isPendingUpdate || isPendingTasksUpdate || isPending;
    const isUpdating = isFetchingTasks;
    const err = tasksError || tasksUpdateError || isColumnsError || error;

    if (isLoading) return <div>Loading...</div>;
    if (isUpdating) return <div>Updating...</div>;
    if (err) {
      const errorMessage = err instanceof Error ? err.message : "An unexpected error occurred";
      toast.error(`An error has occurred: ${errorMessage}`);
      return <div className="flex justify-center items-center text-xl text-red-700">{errorMessage}</div>;
    }
  })();
  //------------------------------------------------- Handle Events -------------------------------------------------
  const reorderColumns = (columns: Column[], activeColumnId: number, overColumnId: number) => {
    const activeIndex = columns.findIndex(column => column.id === activeColumnId);
    const overIndex = columns.findIndex(column => column.id === overColumnId);

    if (activeIndex === -1 || overIndex === -1) {
      console.error("Invalid column IDs for reordering:", { activeColumnId, overColumnId });
      return columns;
    }

    const reorderedColumns = arrayMove(columns, activeIndex, overIndex);
    return reorderedColumns.map((column, index) => ({
      id: column.id,
      order: index,
    }));
  };

  const moveOrderTasks = (tasks: TaskType[], activeIndex: number, overIndex: number): orderID[] => {
    if (activeIndex < 0 || overIndex < 0) {
      console.error("Invalid task indices for reordering:", { activeIndex, overIndex });
      return [];
    }

    return arrayMove(tasks, activeIndex, overIndex).map((task, index) => ({
      id: task.id,
      order: index,
    }));
  };
  //------------------------------------------------------------------------------------
  const handleDragEnd = async (event: DragEndEvent) => {
    setActiveColumn(null);
    setActiveTask(null);
    // setIsTaskDragging(false);
    // setIsColumnDragging(false);
    const { active, over } = event;
    if (!over) return;

    const activeId = active.id as number;
    const overId = over.id as number;

    if (!activeId || !overId || activeId === overId) return;

    if (active.data.current?.type === "Column" && over.data.current?.type === "Column") {
      const newOrder = reorderColumns(columns || [], activeId, overId);
      if (newOrder.length) {
        await updateColumnsMutation({ projectId, newOrder });
      }
    } else if (active.data.current?.type === "Task" && over.data.current?.type === "Task") {
      if (reorderedTasksRef.current.orderIds.length) {
        await updateTasksMutation({
          projectId,
          newOrder: reorderedTasksRef.current.orderIds,
        });
      }
    }
    // console.log("💛💛empty")
  }
  //------------------------------------------------------------------------------------
  const handleDraggStart = (event: DragStartEvent) => {
    if (event.active.data.current?.type === 'Column') {
      console.log('🤍event.active.data.current.column', event.active.data.current.column)
      setActiveColumn(event.active.data.current.column)
      return;
    }

    if (event.active.data.current?.type === 'Task') {
      console.log('🤍event.active.data.current?.task', event.active.data.current?.task)
      setActiveTask(event.active.data.current?.task)
      return;
    }
  }
  //------------------------------------------------------------------------------------
  // i think i should depend on tasks faker
  const handleDraggOver = async (event: DragOverEvent) => {
    const { active, over } = event;
    if (!over) return;

    const activeTaskId = active.id as number;
    const overTaskId = over.id as number;

    if (active.data.current?.type === "Task" && over.data.current?.type === "Task") {
      const activeTaskIndex = tasks.findIndex(task => task.id === activeTaskId);
      const overTaskIndex = tasks.findIndex(task => task.id === overTaskId);
      if (activeTaskIndex === -1 || overTaskIndex === -1) return;
      const overTask = tasks[overTaskIndex];
      if (activeTask?.columnId === overTask?.columnId) {
        const newTasks = [...tasks];
        return reorderedTasksRef.current.orderIds = moveOrderTasks(newTasks, activeTaskIndex, overTaskIndex);
      }
      if (activeTask?.columnId !== overTask.columnId) {
        reorderedTasksRef.current.orderIds = moveOrderTasks(tasks, activeTaskIndex, overTaskIndex);
        reorderedTasksRef.current.columnId = overTask.columnId
        reorderedTasksRef.current.activeTaskId = activeTaskId;

        return await updateTasksMutation({
          projectId,
          newOrder: reorderedTasksRef.current.orderIds,
          columnId: reorderedTasksRef.current.columnId,
          activeTaskId: reorderedTasksRef.current.activeTaskId
        });
      }
      // console.log('🤍🤍🤍 task over task')
      return
    }
    else if (active.data.current?.type === 'Task' && over.data.current?.type === 'Column') {
      const activeTaskIndex = tasks.findIndex(task => task.id === activeTaskId);
      // Case column has no tasks 
      //will take column before and get last task id inside 
      // i think this is more safe than update just task in column 
      const tasksInColumn = over.data.current?.column?.task?.sort((a: TaskType, b: TaskType) => a.order - b.order);
      // console.log('🤍🤍🤍 tasks over Column')
      const lastTaskInPrevColumn = tasksInColumn[tasksInColumn.length - 1];
      const overIndex = tasks.findIndex(task => task.id === lastTaskInPrevColumn?.id);
      reorderedTasksRef.current.orderIds = moveOrderTasks(tasks, activeTaskIndex, overIndex);
      reorderedTasksRef.current.columnId = over.data.current?.column?.id
      reorderedTasksRef.current.activeTaskId = activeTaskId;
      return await updateTasksMutation({
        projectId,
        newOrder: reorderedTasksRef.current.orderIds,
        columnId: reorderedTasksRef.current.columnId,
        activeTaskId: reorderedTasksRef.current.activeTaskId
      });
    }
  }
  //------------------------------------------------------------------------------------
  // how two const 
  // make this state 
  const tasksInColumn = tasks.sort((a, b) => a.order - b.order);
  return (
    <div className="flex-1 overflow-y-scroll">
      <DndContext
        onDragEnd={handleDragEnd}
        onDragStart={handleDraggStart}
        onDragOver={handleDraggOver}
        sensors={sensors}
        collisionDetection={closestCenter}
      >
        <div className="gap-4 grid grid-cols-footer pl-4">
          <SortableContext items={customColumn || []} >
          {customColumn?.map((column: Column) => {
            const crazyTask = (tasksInColumn ?? []).filter((task) => task.columnId === column.id)
            console.log('💛💛 crazyTask', crazyTask)
            return (
              <TaskColumn
                key={column.id}
                column={column}
                setIsModalNewTaskOpen={setIsModalNewTaskOpen}
                addColumnMutation={addColumnMutation}
                tasks={crazyTask}
              />
            );
          })}
          <ColumnForm projectId={projectId} AddColumnMutation={addColumnMutation} />
          </SortableContext>

          {createPortal(
            <DragOverlay>{

              activeColumn && (

                <TaskColumn
                  column={activeColumn}
                  setIsModalNewTaskOpen={setIsModalNewTaskOpen}
                  addColumnMutation={addColumnMutation}
                  tasks={tasksInColumn.filter((task) => task.columnId === activeColumn?.id)}
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
