import React, { ReactNode } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Task } from '@/app/types'

interface Props {
  data?: Task
  TriggerButton: ReactNode
}
const UpdateDialog = ({ TriggerButton }: Props) => {
  return (
    <div>
      <Dialog>
        <DialogTrigger asChild>{TriggerButton}</DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Are you absolutely sure?</DialogTitle>
            <DialogDescription>
              This action cannot be undone. This will permanently delete your account
              and remove your data from our servers.
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default UpdateDialog