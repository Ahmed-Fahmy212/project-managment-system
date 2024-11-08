'use client';
import {
    getCoreRowModel,
    useReactTable,
    getPaginationRowModel,
    ColumnDef,
    flexRender

} from "@tanstack/react-table"
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Status, Task } from "@/state/api";
interface DataTableProps {
    data: Task[]
    columns: ColumnDef<Task, any>[],
}
export function DataTable({
    columns,
    data
}: DataTableProps) {
    const statusColor = {
        "To Do": "#164e63",
        "Work In Progress": "#059669",
        "Under Review": "#D97706",
        "Completed": "#000000",
    };
    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel()
    })
    return (
        <div className="border overflow-x-auto p-4 rounded-md">
            <Table>
                <TableHeader>
                    {table.getHeaderGroups().map(headerGroup => (
                        <TableRow key={headerGroup.id}>
                            {headerGroup.headers.map(header => (
                                <TableHead key={header.id}>
                                    <div className="font-semibold text-black">
                                        {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                                    </div>
                                </TableHead>
                            ))}
                        </TableRow>
                    ))}
                </TableHeader>
                <TableBody>
                    {table.getRowModel().rows?.length ? (
                        table.getRowModel().rows.map((row, index) => (
                            <TableRow
                                key={row.id}
                                data-state={row.getIsSelected() && "selected"}
                                className={index % 2 === 0 ? 'bg-gray-100/50 dark:bg-dark-bg' : ''}
                            >
                                {row.getVisibleCells().map((cell) => (
                                    <TableCell key={cell.id} >
                                        {cell.column.id === 'author'
                                            ? data[index].author?.username
                                            : cell.column.id === 'assignee'
                                                ? data[index].assignee?.username :
                                                cell.column.id === 'status'
                                                    ?
                                                    <span
                                                        className={`px-2 py-1 rounded-full bg-[${statusColor[data[index].status as Status]}] text-white text-sm text-nowrap`}
                                                    >
                                                        {data[index].status}
                                                    </span>

                                                    : flexRender(cell.column.columnDef.cell, cell.getContext())
                                        }
                                    </TableCell>
                                ))}
                            </TableRow>
                        ))
                    ) : (
                        <TableRow>
                            <TableCell colSpan={columns.length} className="h-24 text-center">
                                No results.
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </div>
    );
}
