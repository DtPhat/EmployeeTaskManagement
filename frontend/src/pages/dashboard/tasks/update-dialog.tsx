import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { zodResolver } from "@hookform/resolvers/zod"
import { format } from "date-fns"
import { CalendarIcon, Plus } from "lucide-react"
import { useForm } from "react-hook-form"
import { z } from "zod"

import { taskStatuses } from "@/app/constants"
import { useAppSelector } from "@/app/hooks"
import { useCreateTaskMutation, useUpdateTaskMutation } from "@/app/services/task"
import { useGetUsersQuery } from "@/app/services/user"
import { selectUserInfo } from "@/app/slices/auth"
import StatusBadge from "@/components/status-badge"
import { Input } from "@/components/ui/input"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Textarea } from "@/components/ui/textarea"
import UserLabel from "@/components/user-label"
import { cn } from "@/lib/utils"
import { useState } from "react"
import { toast } from "@/components/ui/use-toast"
import useSocket from "@/hooks/useSocket"
import { Socket } from "socket.io-client"
import { TaskActionDialog, Task } from "@/app/types"
import { convertSecondsToDate } from "@/utils/date"

const FormSchema = z.object({
  status: z.enum(["IN_PROGRESS", "TO_DO", "DONE"], { message: "Invalid status" }),
  name: z.string().min(1, { message: "Name is required" }),
  description: z.string().min(1, { message: "Description is required" }),
  startDate: z.date(),
  dueDate: z.date({
    required_error: "A due date is required.",
  }),
  assignee: z.string().min(1, { message: "Due date is required" }),
})
export default function UpdateTaskDialog({ data: taskData, TriggerButton, open, handleOpen }: TaskActionDialog) {
  const socket: Socket | null = useSocket()
  const userInfo = useAppSelector(selectUserInfo)
  const [serverError, setServerError] = useState()
  const [updateTask, { isLoading: isCreating, isSuccess }] = useUpdateTaskMutation()
  const { data: userData } = useGetUsersQuery({ role: "EMPLOYEE" })

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      status: taskData.status,
      name: taskData.name,
      startDate: new Date(convertSecondsToDate(taskData.startDate._seconds)),
      dueDate: new Date(convertSecondsToDate(taskData.dueDate._seconds)),
      assignee: taskData.assignee.id,
      description: taskData.description
    },
  })

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    try {
      await updateTask({ id: taskData.id, data })
        .unwrap()
        .then((res: any) => {
          socket?.emit('taskUpdated', res?.data)
          toast({
            title: "Updated task successfully",
            description: "Task has been modified",
          })
          handleOpen()
          form.reset()
        })
        .catch(error => {
          setServerError(error?.data.message)
        })
    } catch (error: any) {
      console.log(error)
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpen}>
      <DialogTrigger asChild>
        {TriggerButton}
      </DialogTrigger>
      <DialogContent className="">
        <DialogHeader>
          <DialogTitle>Update task</DialogTitle>
          <DialogDescription>
            Add a new task to dashboard
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form className="flex flex-wrap gap-8" onSubmit={form.handleSubmit(onSubmit)}>
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Task name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem className='w-32'>
                  <FormLabel>Status</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a status" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value={taskStatuses.TO_DO}><StatusBadge status={"TO_DO"} /></SelectItem>
                      <SelectItem value={taskStatuses.IN_PROGRESS}><StatusBadge status={"IN_PROGRESS"} /></SelectItem>
                      <SelectItem value={taskStatuses.DONE}><StatusBadge status={"DONE"} /></SelectItem>
                    </SelectContent>
                  </Select>
                  {/* <FormDescription>
                    You can manage email addresses in your{" "}
                  </FormDescription> */}
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="startDate"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Start date</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-[240px] pl-3 text-left font-normal",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value ? (
                            format(field.value, "PPP")
                          ) : (
                            <span>Pick a date</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        disabled={(date) =>
                          date > new Date() || date < new Date("1900-01-01")
                        }
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="dueDate"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Due date</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-[240px] pl-3 text-left font-normal",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value ? (
                            format(field.value, "PPP")
                          ) : (
                            <span>Pick a date</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        disabled={(date) =>
                          date < (new Date(form.getValues().startDate))
                        }
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="assignee"
              render={({ field }) => (
                <FormItem className="w-1/2">
                  <FormLabel>Assignee</FormLabel>
                  <Select onValueChange={field.onChange} >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select employee" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {
                        userData?.data?.map(item =>
                          <SelectItem value={item.id.toString()}>
                            {<UserLabel name={item.name} />}
                          </SelectItem>
                        )
                      }
                    </SelectContent>
                  </Select>
                  {/* <FormDescription>
                    You can manage email addresses in your{" "}
                  </FormDescription> */}
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Details about the task"
                      className="resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

          </form>
        </Form>
        {serverError && <p className="text-red-700 text-sm font-semibold">{serverError}</p>}
        <DialogFooter>
          <Button type="submit" onClick={() => { handleOpen(); form.reset() }} disabled={isCreating} variant={'outline'}>Cancel</Button>
          <Button type="submit" onClick={form.handleSubmit(onSubmit)} disabled={isCreating}>Submit</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}