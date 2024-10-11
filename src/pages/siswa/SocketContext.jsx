import { createContext, useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { useZUStore } from '../../zustand/zustore';

export const SocketContext = createContext();

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const { profile } = useZUStore((state) => state);

  console.log(profile)

  useEffect(() => {
    const newSocket = io('http://localhost:8085', {
      query: {
        idDB: profile.user_id,
        roleDB: profile.user.role
      }
    });
    setSocket(newSocket);

    return () => newSocket.close(); // Bersihkan koneksi saat unmount
  }, [profile]);

  return (
    <SocketContext.Provider value={socket}>
      {children}
    </SocketContext.Provider>
  );
};
