import {ColumnDef} from "@tanstack/react-table";
type Task = {
    title: string;
    description: string;
    tags: string;
    status: string
    startDate: string;
    dueDate: string;
    author: string;
    assignee: string;
}

export const Columns: ColumnDef<Task>[] = [
    {
        accessorKey: 'title',
        header: 'Title',
    },
    {
        accessorKey: 'description',
        header: 'Description',
    },
    {
        accessorKey: 'tags',
        header: 'Tags',
    },
    {
        accessorKey: 'status',
        header: 'Status',
    },
    {
        accessorKey: 'startDate',
        header: 'Start Date',
    },
    {
        accessorKey: 'dueDate',
        header: 'Due Date',
    },
    {
        accessorKey: 'author',
        header: 'Author',
    },
    {
        accessorKey: 'assignee',
        header: 'Assignee',
    }
];

