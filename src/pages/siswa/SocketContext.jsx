import { createContext, useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { useZUStore } from '../../zustand/zustore';


export const SocketContext = createContext();

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const { profile } = useZUStore((state) => state);

  console.log(profile)

  // useEffect(() => {
  //   const newSocket = io('http://localhost:8085', {
  //     autoConnect: true,
  //     reconnection: true,
  //     reconnectionAttempts: Infinity,
  //     reconnectionDelay: 1000,
      
  //     query: {
  //       idDB: profile.user_id,
  //       roleDB: profile.user.role
  //     }
  //   });
  //   setSocket(newSocket);

  //   return () => newSocket.close(); // Bersihkan koneksi saat unmount
  // }, [profile]);

  useEffect(() => {

    if(!socket) return
    // Event listener untuk connect dan disconnect
    const onConnect = () => {
      console.log("socket is connected");
    };

    const onDisconnect = () => {
      console.log("socket is disconnected");
    };

    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);

    return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
    };
  }, [socket]);

  return (
    <SocketContext.Provider value={socket}>
      {children}
    </SocketContext.Provider>
  );
};
