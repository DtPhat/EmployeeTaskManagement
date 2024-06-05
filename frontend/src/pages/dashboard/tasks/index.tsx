import { useGetTasksQuery } from "@/app/services/task"
import OrderToggle from "@/components/order-toggle"
import SearchBar from "@/components/search-bar"
import { Separator } from "@/components/ui/separator"
import { debounce } from "lodash"
import { ChangeEvent, useEffect, useState } from "react"
import { columns } from "./columns"
import { DataTable } from "./data-table"
import CreateTaskDialog from "./create-dialog"
import { Socket } from "socket.io-client"
import useSocket from "@/hooks/useSocket"
import { Task } from "@/app/types"
import { userInfo } from "os"
import { useAppSelector } from "@/app/hooks"
import { selectUserInfo } from "@/app/slices/auth"
import { roles } from "@/app/constants"


export default function TaskDashboard() {
  const socket: Socket | null = useSocket();
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('')
  const [asc, setAsc] = useState(false)
  const userInfo = useAppSelector(selectUserInfo)
  const { data, isLoading } = useGetTasksQuery({})
  const [tasks, setTasks] = useState<Task[]>([])

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

  useEffect(() => {
    setTasks(data?.data || [])

    socket?.on('taskAdded', (newTask) => {
      setTasks((prevTasks) => [...prevTasks, newTask]);
    });

    socket?.on('taskUpdated', (updatedTask) => {
      setTasks((prevTasks) =>
        prevTasks.map((task) => (task.id == updatedTask.id ? updatedTask : task))
      );
    });

    socket?.on('taskDeleted', (taskId) => {
      setTasks((prevTasks) => prevTasks.filter((task) => task.id != taskId));
    });

    return () => {
      socket?.off('taskAdded');
      socket?.off('taskUpdated');
      socket?.off('taskDeleted');
    };
  }, [data]);

  return (
    <div className="container flex flex-col py-4 gap-4">
      <div className="flex items-start justify-between">
        <h1 className="text-3xl font-bold">Manage Tasks</h1>
        {
          userInfo?.role == roles.OWNER
          && <CreateTaskDialog />
        }
      </div>
      <Separator />
      <div className='flex gap-2 items-center w-1/2'>
        <SearchBar placeholder='Search tasks...' searchTerm={searchTerm} handleChange={handleSearch} />
        <OrderToggle asc={asc} toggleOrder={toggleOrder} />
      </div>
      <DataTable columns={columns} data={tasks || []} isLoading={isLoading} />
    </div>
  )
}