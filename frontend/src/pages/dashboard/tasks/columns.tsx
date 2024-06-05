import { Task } from "@/app/types"
import { ColumnDef } from "@tanstack/react-table"
import { CellAction } from "./cell-action"
import StatusBadge from "@/components/status-badge"
import { convertSecondsToDate } from "@/utils/date"


export const columns: ColumnDef<Task>[] = [
  {
    id: "index",
    cell: ({ row }) => <p>{row.index + 1}</p>,
  },
  {
    header: "Name",
    accessorKey: 'name'
  },
  {
    header: "Assignee",
    cell: ({ row }) => <p>{row.original.assignee?.name} </p>,
  },
  {
    header: "Status",
    cell: ({ row }) => <StatusBadge status={row.original.status} />,
  },
  {
    header: "Start Date",
    cell: ({ row }) => <p>{convertSecondsToDate(row.original.startDate._seconds)}</p>,
  },
  {
    header: "Due Date",
    cell: ({ row }) => <p>{convertSecondsToDate(row.original.dueDate._seconds)}</p>,
  },
  {
    header: "Reporter",
    cell: ({ row }) => <p>{row.original.reporter?.name} </p>,
  },
  {
    id: "actions",
    cell: ({ row }) => <CellAction data={row.original} />,
  },
]