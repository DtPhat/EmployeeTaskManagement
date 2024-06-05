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
import StatusBadge from '@/components/status-badge'
import { convertSecondsToDate } from '@/utils/date'
import UserLabel from '@/components/user-label'

interface Props {
  data: Task
  TriggerButton: ReactNode
}
const ViewDialog = ({ TriggerButton, data }: Props) => {
  return (
    <div>
      <Dialog>
        <DialogTrigger asChild>{TriggerButton}</DialogTrigger>
        <DialogContent>
          <DialogHeader className='space-y-2'>
            <DialogTitle>{data.name}</DialogTitle>
            <StatusBadge status={data.status} />
            <DialogDescription>
              <div className='font-semibold text-black'>Description:</div>
              {data.description}
            </DialogDescription>
          </DialogHeader>
          <DialogDescription className='flex justify-between'>
            <div className='flex gap-2 text-sm'>
              <div className='text-black font-semibold'>Start Date:</div>
              <div>{convertSecondsToDate(data.startDate?._seconds)}</div>
            </div>
            <div className='flex gap-2 text-sm'>
              <div className='text-black font-semibold'>Due Date:</div>
              <div>{convertSecondsToDate(data.dueDate?._seconds)}</div>
            </div>
          </DialogDescription>
          <DialogDescription>
            <div className='text-base font-semibold flex gap-2'>
              <div className='text-black'>Reporter:</div>
              <UserLabel name={data.reporter?.name} />
            </div>
          </DialogDescription>
          <DialogDescription>
            <div className='text-base font-semibold flex gap-2'>
              <div className='text-black'>Assignee:</div>
              <UserLabel name={data.assignee?.name} />
            </div>
          </DialogDescription>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default ViewDialog