import React, { useState } from 'react';
import ChatRoom from './chat-room';
import { useAppSelector } from '@/app/hooks';
import { selectUserInfo } from '@/app/slices/auth';
import { anonymousAvatar, roles } from '@/app/constants';
import { useGetMessagesMutation } from '@/app/services/chat';
import { useGetUserMutation, useGetUsersQuery } from '@/app/services/user';
import { Role } from '@/app/types';
import { Card, CardContent, CardDescription, CardHeader } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';

export default function MessageDashboard() {
  const [room, setRoom] = useState('');
  const userInfo = useAppSelector(selectUserInfo)
  const userRole = userInfo?.role
  const [selectedUser, setSelectedUser] = useState("")

  const generateRoomId = (id1: string, id2: string) => {
    return [id1, id2].sort().join('_');
  };

  const { data, isLoading } = useGetUsersQuery({ role: (userRole == roles.EMPLOYEE ? roles.OWNER : roles.EMPLOYEE) as Role })

  const startChat = (e: React.SyntheticEvent, chatWith: string) => {
    setSelectedUser(chatWith)
    e.preventDefault();
    const roomId = generateRoomId(userInfo!.id, chatWith);
    setRoom(roomId);
  };


  return (
    <div className="container space-y-4">
      <h1 className="text-3xl font-bold">Chat with your {userRole == roles.EMPLOYEE ? 'owners' : 'employees'}</h1>
      <div className='flex gap-8 h-[30rem]'>
        <div className='space-y-4 w-52'>
          {
            isLoading
              ? <Skeleton className='h-full'/>
              : data?.data.map(user =>
                <Card className={`w-52 p-4 space-y-1 cursor-pointer ${selectedUser == user.id ? 'border border-gray-500 bg-gray-50' : ''}`} onClick={(e) => startChat(e, user.id)}>
                  <div className='flex items-center gap-2'>
                    <img src={anonymousAvatar} className='size-8 rounded-full' />
                    <div> {user.name || "Anonymous"}</div>
                  </div>
                  <CardDescription>{user.email.emailAddress}</CardDescription>
                </Card>
              )
          }
        </div>
        <Separator orientation='vertical' />
        <div className='w-full'>
          {room ? <ChatRoom room={room} /> : <div>Choose a user to chat with.</div>}
        </div>
      </div>
    </div>
  );
}