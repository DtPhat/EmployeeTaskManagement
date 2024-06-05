import useSocket from '@/hooks/useSocket';
import React, { useEffect, useState } from 'react';
import { Socket } from 'socket.io-client';
import { fetchBaseQuery } from '@reduxjs/toolkit/query'
import { useGetMessagesMutation } from '@/app/services/chat';
import { useAppSelector } from '@/app/hooks';
import { selectUserInfo } from '@/app/slices/auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Message } from '@/app/types';
import { Skeleton } from '@/components/ui/skeleton';
function ChatRoom({ room }: { room: any }) {
  const [messages, setMessages] = useState<any>([]);
  const [message, setMessage] = useState('');

  const socket: Socket | null = useSocket();
  const [getMessages, { isLoading }] = useGetMessagesMutation({})
  const userInfo = useAppSelector(selectUserInfo)
  useEffect(() => {
    if (socket && room) {
      socket.emit('join room', room);

      const fetchMessages = async () => {
        try {
          const response = await getMessages(room);
          console.log(response)
          setMessages(response?.data || []);
        } catch (error) {
          console.error('Error fetching messages:', error);
        }
      };
      fetchMessages();

      socket.on('chat message', ({ msg, room: msgRoom, sender: msgSender }) => {
        console.log(msg, msgRoom, msgSender)
        if (msgRoom === room) {
          setMessages((prevMessages: Message[]) => [...prevMessages, {
            text: msg,
            sender: msgSender,
            room
          }]);
        }
      });

      return () => {
        socket.emit('leave room', room);
        socket.off('chat message');
      };
    }
  }, [socket, room]);

  const sendMessage = (e: React.SyntheticEvent) => {
    e.preventDefault();
    if (!message) {
      return
    }
    socket?.emit('chat message', {
      msg: message,
      room,
      sender: userInfo?.id
    });
    setMessage('');
  };

  return (
    <div className='flex flex-col border rounded-md'>
      <div className="flex flex-col h-[26rem] overflow-auto">
        {
          isLoading
            ? <Skeleton className='h-full m-2' />
            : messages.length
              ? messages.map((msg: Message, index: string) => (
                <div className={`flex ${msg.sender == userInfo?.id ? 'justify-end' : ''}`} >
                  <div key={index} className='w-fit border p-2 m-2 rounded-md bg-gray-50'>{msg.text}</div>
                </div>
              ))
              : <div className='m-4 text-black/40'>No messages found.</div>
        }
      </div>
      <form onSubmit={sendMessage} className='flex m-2 gap-2'>
        <Input
          type="text"
          className='w-full bg-gray-50'
          placeholder='Chat something...'
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <Button type="submit">Send</Button>
      </form>
    </div >
  );
}

export default ChatRoom;