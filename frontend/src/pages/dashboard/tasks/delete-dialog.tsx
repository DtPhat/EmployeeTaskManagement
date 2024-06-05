import { useDeleteTaskMutation } from "@/app/services/task"
import { useDeleteUserMutation } from "@/app/services/user"
import { TaskActionDialog } from "@/app/types"
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
import { toast } from "@/components/ui/use-toast"
import useSocket from "@/hooks/useSocket"
import { useState } from "react"
import { Socket } from "socket.io-client"


export default function DeleteTaskDialog({ data, TriggerButton, open, handleOpen }: TaskActionDialog) {
  const socket: Socket | null = useSocket()
  const [deleteTask, { isLoading }] = useDeleteTaskMutation()
  const handleDelete = async () => {
    await deleteTask(data.id)
      .unwrap()
      .then(res => {
        socket?.emit('taskDeleted', data.id)
        toast({
          title: "Task deleted successfully",
          description: `${data.name} has been deleted`,
        })
        handleOpen()
      })
      .catch(error => console.error(error))
  }
  return (
    <Dialog open={open} onOpenChange={handleOpen}>
      <DialogTrigger asChild>
        {TriggerButton}
      </DialogTrigger>
      <DialogContent className="">
        <DialogHeader>
          <DialogTitle>Delete {data.name}</DialogTitle>
          <DialogDescription>
            Your action won't be undone
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button onClick={() => { handleOpen() }} variant={"outline"}>
            Cancel
          </Button>
          <Button onClick={handleDelete} disabled={isLoading} variant={"destructive"}>
            {isLoading ? "Deleting..." : "Submit"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog >
  )
}