import { useGetTasksQuery } from "@/app/services/task"
import OrderToggle from "@/components/order-toggle"
import SearchBar from "@/components/search-bar"
import { Separator } from "@/components/ui/separator"
import { debounce } from "lodash"
import { ChangeEvent, useState } from "react"
import { columns } from "./columns"
import { DataTable } from "./data-table"
import { CreateDialog } from "./dialog"


export default function TaskDashboard() {
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('')
  const [asc, setAsc] = useState(false)

  const { data, isLoading } = useGetTasksQuery({})

  const toggleOrder = () => {
    setAsc(prevState => !prevState)
  }

  const handlePageChange = (event: ChangeEvent<unknown>, value: number) => {
    setPage(value);
  };

  const debouncedSearch = debounce((debouncedSearchTerm: string) => {
    setSearchTerm(debouncedSearchTerm);
    setPage(1)
  }, 1000);

  const handleSearch = (event: ChangeEvent<HTMLInputElement>) => {
    debouncedSearch(event.target.value);
  };

  return (
    <div className="container flex flex-col py-4 gap-4">
      <div className="flex items-start justify-between">
        <h1 className="text-3xl font-bold">Manage Tasks</h1>
        <CreateDialog />
      </div>
      <Separator />
      <div className='flex gap-2 items-center w-1/2'>
        <SearchBar placeholder='Search employees...' searchTerm={searchTerm} handleChange={handleSearch} />
        <OrderToggle asc={asc} toggleOrder={toggleOrder} />
      </div>
      <DataTable columns={columns} data={data?.data || []} isLoading={isLoading}/>
    </div>
  )
}