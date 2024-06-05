import React, { ReactNode } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Task, User } from '@/app/types'
import StatusBadge from '@/components/status-badge'
import { convertSecondsToDate } from '@/utils/date'
import { anonymousAvatar } from '@/app/constants'
import { Separator } from '@radix-ui/react-dropdown-menu'
import { Heading } from '@/components/heading'

interface Props {
  data: User
  TriggerButton: ReactNode
}
const ViewDialog = ({ TriggerButton, data }: Props) => {
  console.log(data)
  return (
    <div>
      <Dialog>
        <DialogTrigger asChild>{TriggerButton}</DialogTrigger>
        <DialogContent className='container'>
          <Heading title='View Employee' />
          <DialogHeader>
            <div className='flex gap-4'>
              <img src={anonymousAvatar} className='size-20 rounded-full' />
              <div className='my-auto'>
                <div className='text-xl font-semibold'>{data.name}</div>
                <div className='text-sm text-black/70'>Email: {data.email.emailAddress}</div>
                <div className='text-sm text-black/70'>Phone: {data.phone.phoneNumber}</div>
              </div>
            </div>
          </DialogHeader>
          <DialogDescription className='space-y-2'>
            <div className={`${data.isVerified ? 'bg-green-200  w-20' : 'bg-red-200 w-24'} text-center rounded p-1 font-semibold text-black`}>{data.isVerified ? "Verified" : "Not Verified"}</div>
            <div>Address: {data.address}</div>
            <div>Role: {data.role}</div>
          </DialogDescription>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default ViewDialog