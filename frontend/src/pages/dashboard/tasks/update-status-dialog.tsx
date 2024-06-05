import { Button } from "@/components/ui/button"
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
import { useForm } from "react-hook-form"
import { z } from "zod"

import { taskStatuses } from "@/app/constants"
import { useAppSelector } from "@/app/hooks"
import { useUpdateTaskStatusMutation } from "@/app/services/task"
import { useGetUsersQuery } from "@/app/services/user"
import { selectUserInfo } from "@/app/slices/auth"
import { TaskActionDialog } from "@/app/types"
import StatusBadge from "@/components/status-badge"
import { toast } from "@/components/ui/use-toast"
import useSocket from "@/hooks/useSocket"
import { useState } from "react"
import { Socket } from "socket.io-client"

const FormSchema = z.object({
  status: z.enum(["IN_PROGRESS", "TO_DO", "DONE"], { message: "Invalid status" }),
})
export default function UpdateTaskStatusDialog({ data: taskData, TriggerButton, open, handleOpen }: TaskActionDialog) {
  const socket: Socket | null = useSocket()
  const userInfo = useAppSelector(selectUserInfo)
  const [serverError, setServerError] = useState()
  const [updateTask, { isLoading: isCreating, isSuccess }] = useUpdateTaskStatusMutation()
  const { data: userData } = useGetUsersQuery({ role: "EMPLOYEE" })

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      status: taskData.status,
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
            description: "Task status has been modified",
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
            Set your task status
          </DialogDescription>
        </DialogHeader>
        <DialogTitle>{taskData.name}</DialogTitle>
        <Form {...form}>
          <form className="flex flex-wrap gap-8" onSubmit={form.handleSubmit(onSubmit)}>
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