import { useEffect, useState } from 'react';
import { Socket, io } from 'socket.io-client';
import { BASE_URL } from "@/app/services/api"
const useSocket = (): Socket | null => {
  const [socket, setSocket] = useState<Socket | null>(null);

  useEffect(() => {
    const socketInstance = io(BASE_URL);
    setSocket(socketInstance);

    return () => {
      socketInstance.disconnect();
    };
  }, []);

  return socket;
};

export default useSocket;