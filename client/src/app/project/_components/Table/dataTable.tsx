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
import { Column, Status, Task } from "@/state/api";
import { useAppSelector } from "@/app/redux";
import { useGetColumnsQuery } from "@/api/reactQuery/columnQuery";
interface DataTableProps {
    data: Task[]
    columns: ColumnDef<any>[],
    columnData: Column[]
}
export function DataTable({
    columns,
    data,
    columnData
}: DataTableProps) {
    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel()
    })
    // const isDarkMode = useAppSelector((state) => state.global.isDarkMode);

    return (
        <div className="border overflow-x-auto p-4 rounded dark:text-white">
            <Table >
                <TableHeader >
                    {table.getHeaderGroups().map(headerGroup => (
                        <TableRow key={headerGroup.id}>
                            {headerGroup.headers.map(header => (
                                <TableHead key={header.id}>
                                    <div className="font-semibold text-black dark:text-white">
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
                                className={index % 2 === 0 ? 'bg-gray-100/70 dark:bg-dark-bg' : ''}
                            >
                                {row.getVisibleCells().map((cell) => (
                                    <TableCell key={cell.id} >
                                        {cell.column.id === 'author'
                                            ? data[index].author?.username :
                                            cell.column.id === 'title' ? (
                                                <span className="text-nowrap">
                                                    {data[index].title}
                                                </span>
                                            )
                                                : cell.column.id === 'assignee'
                                                    ? data[index].assignee?.username :
                                                    cell.column.id === 'status'
                                                        ?
                                                        <span
                                                            className={`px-3 py-2 rounded-full font-semibold justify-center content-center text-white text-sm text-nowrap`}
                                                            style={{ backgroundColor: columnData[data[index].columnId].color }}
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
                <TableCaption>
                    <div className="flex gap-10 items-center justify-center">
                        <div className="flex hover:cursor-pointer items-center space-x-2">
                            <button
                                className="border px-2 py-1 rounded"
                                onClick={() => table.previousPage()}
                            // disabled={!table.getCanPreviousPage()}
                            >
                                Previous
                            </button>
                            <button
                                className="border px-2 py-1 rounded"
                                onClick={() => table.nextPage()}
                            // disabled={!table.getCanNextPage()}
                            >
                                Next
                            </button>
                        </div>
                        <span>
                            Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
                        </span>
                    </div>
                </TableCaption>
            </Table>
        </div>
    );
}
