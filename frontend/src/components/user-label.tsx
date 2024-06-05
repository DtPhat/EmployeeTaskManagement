import { anonymousAvatar } from '@/app/constants'
import React from 'react'
import { string } from 'zod'

interface Props {
  name: string
  avatar?: string
}

const UserLabel = ({ name, avatar }: Props) => {
  return (
    <div className='flex gap-2 w-32 p-0.5 rounded'>
      <img src={anonymousAvatar} className='w-6 rounded-full' />
      <p className='truncate font-semibold'>{name}</p>
    </div>
  )
}

export default UserLabel