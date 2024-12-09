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
  const queryClient = useQueryClient();
  const { mutateAsync: addColumnMutation } = useMutation({
    mutationFn: (newColumn: ColumnBody) => addColumn(newColumn),
    onMutate: async (newColumn) => {
      await queryClient.cancelQueries({ queryKey: ['columns', projectId] });

      const previousColumns = queryClient.getQueryData(['columns', projectId]);
      const newColumnWithId = { ...newColumn, id: Date.now() }; // Temporary ID for optimistic update

      queryClient.setQueryData(['columns', projectId], (oldData: Column[] | undefined) => {
        return oldData ? [...oldData, newColumnWithId] : [newColumnWithId];
      });

      return { previousColumns };
    },
    onError: (error, _, context) => {
      queryClient.setQueryData(['columns', projectId], context?.previousColumns);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['columns', projectId] });
    }
    // ,
    // onSuccess: (newColumn) => {
    //   queryClient.setQueryData(['columns', projectId], (oldData: Column[] | undefined) => {
    //     return oldData ? [...oldData.filter(column => column.id !== newColumn.id), newColumn] : [newColumn];
    //   });
    // }
  });

  const { isPending: isPendingUpdate, mutateAsync: updateColumnsMutation, isError: isColumnsError } = useMutation({
    mutationFn: (newOrderColumns: { projectId: number, newOrder: orderID[] }) => updateColumns(newOrderColumns),
    onMutate: async (newOrderColumns) => {
      await queryClient.cancelQueries({ queryKey: ['columns', projectId] });

      const previousColumns = queryClient.getQueryData(['columns', projectId]);
      let updatedColumns
      queryClient.setQueryData(['columns', projectId], (oldData: Column[] | undefined) => {
        if (!oldData) return oldData;

        updatedColumns = oldData
          .map((column) => {
            const updatedColumn = newOrderColumns.newOrder.find((newColumn) => newColumn.id === column.id);
            return updatedColumn ? { ...column, ...updatedColumn } : column;
          })
          .sort((a, b) => (a.order || 0) - (b.order || 0));

        return updatedColumns;
      });

      setActiveColumn(null);
      setActiveTask(null);
      return { previousColumns };
    },
    onError: (error, _, context) => {
      queryClient.setQueryData(['columns', projectId], context?.previousColumns);
    },
    onSettled: (_, __, ___, context) => {
      queryClient.invalidateQueries({ queryKey: ['columns', projectId] });
    },
  });

  const { mutateAsync: updateTasksMutation, error: tasksUpdateError, isPending: isPendingTasksUpdate } = useMutation({
    mutationFn: (tasksUpdate: UpdateTasksData) => updateTasks(tasksUpdate),
    onMutate: async (newOrderTasks) => {
      await queryClient.cancelQueries({ queryKey: ['tasks', projectId] });

      const previousTasks = queryClient.getQueryData(['tasks', projectId]);
      queryClient.setQueryData(['tasks', projectId], (oldData: TaskType[] | undefined) => {
        if (!oldData) return oldData;

        const updatedTasks = oldData.map((task) => {
          const updatedTask = newOrderTasks.newOrder.find((newTask) => newTask.id === task.id);
          return updatedTask ? { ...task, ...updatedTask } : task;
        }).sort((a, b) => a.order - b.order);

        if (reorderedTasksRef.current.columnId !== undefined) {
          const activeTask = updatedTasks.find(task => task.id === reorderedTasksRef.current.activeTaskId);
          if (activeTask) {
            activeTask.columnId = reorderedTasksRef.current.columnId;
            setActiveTask({ ...activeTask });
          }
        }


        return updatedTasks;
      });

      return { previousTasks };
    },
    onError: (error, _, context) => {
      queryClient.setQueryData(['tasks', projectId], context?.previousTasks);
    },
    onSettled: (_, __, ___, context) => {
      queryClient.invalidateQueries({ queryKey: ['tasks', projectId] });
    }
  });
  //------------------------------------------------------------------------------------
  if (!tasks) return <div>Loading...</div>;

  (() => {
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
  })();
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

  const moveOrderTasks = (tasks: TaskType[], activeIndex: number, overIndex: number): orderID[] => {
    return arrayMove(tasks, activeIndex, overIndex).map((task, index) => ({
      id: task.id,
      order: index,
    }));
  };
  //------------------------------------------------------------------------------------
  const handleDraggEnd = async (event: DragEndEvent) => {
    setActiveColumn(null);
    setActiveTask(null);

    const { active, over } = event;
    if (!over) return;

    const activeId = active.id as number;
    const overId = over.id as number;

    if (activeId === overId) return;
    if (!columns || !activeId) return;

    if (active.data.current?.type === 'Column' && over.data.current?.type === 'Column') {
      const newOrder = reorderColumns(columns, activeId, overId);
      reorderedColumnsRef.current = { orderIds: newOrder };
      await updateColumnsMutation({ projectId, newOrder });

    }
    if (active.data.current?.type === 'Task' && over.data.current?.type === 'Task') {
      if (reorderedTasksRef.current.orderIds.length > 0) {
        await updateTasksMutation({
          projectId,
          newOrder: reorderedTasksRef.current.orderIds
        });
      }
    }

  }
  //------------------------------------------------------------------------------------
  const handleDraggStart = (event: DragStartEvent) => {
    if (event.active.data.current?.type === 'Task') {
      console.log('🤍event.active.data.current?.task', event.active.data.current?.task)
      setActiveTask(event.active.data.current.task)
      return;
    }
    if (event.active.data.current?.type === 'Column') {
      console.log('🤍event.active.data.current.column', event.active.data.current.column)
      setActiveColumn(event.active.data.current.column);
      return;
    }
  }
  //------------------------------------------------------------------------------------
  const handleDraggOver = async (event: DragOverEvent) => {
    const { active, over } = event;
    if (!over) return;

    const activeTaskId = active.id as number;
    const overTaskId = over.id as number;

    if (active.data.current?.type === 'Task' && over.data.current?.type === 'Task' && tasks) {
      const activeTaskIndex = tasks.findIndex(task => task.id === activeTaskId);
      const overTaskIndex = tasks.findIndex(task => task.id === overTaskId);
      if (activeTaskIndex === -1 || overTaskIndex === -1) return;
      const overTask = tasks[overTaskIndex];
      if (activeTask?.columnId === overTask?.columnId) {
        return reorderedTasksRef.current.orderIds = moveOrderTasks(tasks, activeTaskIndex, overTaskIndex);
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
      return
    }
    const columnTarget = columns?.find((col) => col.id === over.data.current?.column?.id) || null;

    // Case column has no tasks 
    if (active.data.current?.type === 'Task' && over.data.current?.type === 'Column' && columnTarget?.task?.length === 0) {
      const activeTaskIndex = tasks.findIndex(task => task.id === activeTaskId);
      //will take column before and get last task id inside 
      // i think this is more safe than update just task in column 
      const tasksInColumn = over.data.current?.column?.task?.sort((a: TaskType, b: TaskType) => a.order - b.order);
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

  const columnsIds = columns || []
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
          {/* //case want update tasks just rerender --- cashe + com */}
          <SortableContext items={columnsIds} >
            {columns?.map((column: Column) => {
              // handled in more faster without conflict 
              const crazyTask = tasks.filter((task: TaskType) => task.columnId === column?.id).sort((a, b) => a.order - b.order);
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
                  tasks={activeColumn?.task?.sort((a, b) => a.order - b.order) || []}
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
