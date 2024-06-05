import { TaskStatus } from '@/app/types'
import React from 'react'

interface StatusProps {
  status: TaskStatus
}
const statusColors = {
  'IN_PROGRESS': 'bg-blue-100',
  'TO_DO': 'bg-gray-100',
  'DONE': 'bg-green-100'
}

const statusDisplay = {
  'IN_PROGRESS': 'In Progress',
  'TO_DO': 'To Do',
  'DONE': 'Done'
}
const StatusBadge = ({ status }: StatusProps) => {
  console.log(statusColors[status as TaskStatus]);

  return (
    <p className={` ${statusColors[status]} text-xs text-center p-1 rounded font-semibold w-20`}>
      {statusDisplay[status as TaskStatus]}
    </p>
  )
}

export default StatusBadge