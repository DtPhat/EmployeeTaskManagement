import { useDeleteUserMutation } from "@/app/services/user"
import { ActionDialog } from "@/app/types"
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
import { useState } from "react"


export default function DeleteDialog({ data, TriggerButton, open, handleOpen }: ActionDialog) {
  const [deleteUser, { isLoading }] = useDeleteUserMutation()
  const handleDelete = async () => {
    await deleteUser(data.id).unwrap()
      .catch(error => console.error(error))
      .finally(() => {
        toast({
          title: "Deleted",
          description: `${data.name} has been deleted`,
        })
        handleOpen()
      })
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