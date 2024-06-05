import { User } from "@/app/types"
import { ColumnDef } from "@tanstack/react-table"
import { CellAction } from "./cell-action"


export const columns: ColumnDef<User>[] = [
  {
    id: "index",
    cell: ({ row }) => <p>{row.index + 1}</p>,
  },
  {
    header: "Name",
    accessorKey: 'name'
  },
  {
    header: "Email",
    cell: ({ row }) => <p>{row.original.email.emailAddress} </p>,
  },
  {
    header: "Phone",
    cell: ({ row }) => <p>{row.original.phone.phoneNumber} </p>,
  },
  {
    header: "Verified",
    cell: ({ row }) => <div className={`${row.original.isVerified ? 'bg-green-100' : 'bg-red-100'} w-24 text-center rounded p-1 font-semibold text-black`}>{row.original.isVerified ? "Verified" : "Not Verified"}</div>

  },
  {
    id: "actions",
    cell: ({ row }) => <CellAction data={row.original} />,
  },
]