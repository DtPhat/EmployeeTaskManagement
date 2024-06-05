import { anonymousAvatar } from '@/app/constants'
import { useGetProfileQuery, useUpdateProfileMutation } from '@/app/services/user'
import { Button } from '@/components/ui/button'
import React, { useState } from 'react'
import UpdateProfileDialog from './update-dialog'

const Profile = () => {
  const { data } = useGetProfileQuery({})
  const [profileChanged, setProfileChanged] = useState(false)
  const handleProfileChange = () => {
    setProfileChanged(!profileChanged)
  }
  const user = data?.data
  return (
    <div className="flex items-center justify-center ">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-lg">
        <div className="flex flex-col items-center mb-6">
          <img
            src={anonymousAvatar}
            alt="Avatar"
            className="w-32 h-32 rounded-full mb-4"
          />
          <h2 className="text-3xl font-bold text-gray-800">{user?.name}</h2>

        </div>
        <div className="mb-6">
          <label className="block text-gray-600 text-sm font-medium">Email Address</label>
          <p className="text-gray-900 text-lg font-semibold">{user?.email.emailAddress}</p>
        </div>
        <div className="mb-6">
          <label className="block text-gray-600 text-sm font-medium">Phone Number</label>
          <p className="text-gray-900 text-lg font-semibold">{user?.phone.phoneNumber}</p>
        </div>
        <div className="mb-6">
          <label className="block text-gray-600 text-sm font-medium">Address</label>
          <p className="text-gray-900 text-lg font-semibold">{user?.address}</p>
        </div>
        <div className="mb-6">
          <label className="block text-gray-600 text-sm font-medium">Role</label>
          <p className="text-gray-900 text-lg font-semibold">{user?.role}</p>
        </div>
        {
          data && <UpdateProfileDialog data={user}/>
        }
      </div>
    </div>
  )
}

export default Profile