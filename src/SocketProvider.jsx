// SocketProvider.js (updated)
import { createContext, useEffect, useState, useMemo } from 'react';
import { io } from 'socket.io-client';
import PropTypes from 'prop-types';

export const SocketContext = createContext();

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [joinedRooms, setJoinedRooms] = useState([]);
  

  const socketOptions = useMemo(() => ({
    autoConnect: true,
    reconnection: true,
    reconnectionAttempts: Infinity,
    reconnectionDelay: 1000,
  
  }), []);

  // Fungsi untuk join room
  const joinRoom = (roomId, userData) => {
    if (!socket) return Promise.reject("Socket not connected");

    return new Promise((resolve, reject) => {
      socket.emit(
        'join-room', 
        { 
          roomId, 
          user: {
           
            ...userData // data tambahan
          }
        }, 
        (response) => {
          if (response.success) {
            resolve(response);
          } else {
            reject(response.error);
          }
        }
      );
    });
  };


  // Fungsi untuk leave room
  const leaveRoom = (roomId) => {
    if (!socket || !isConnected) return false;

    return new Promise((resolve, reject) => {
      socket.emit('leave-room', roomId, (response) => {
        if (response.success) {
          setJoinedRooms(prev => prev.filter(id => id !== roomId));
          resolve(response);
        } else {
          reject(response.error);
        }
      });
    });
  };

  useEffect(() => {

    let newSocket;
    try {
      newSocket = io('https://bemysmk.devopsgeming.online/', socketOptions);
      setSocket(newSocket);

      newSocket.on('connect', () => {
        console.log('Socket connected');
        setIsConnected(true);
      });

      newSocket.on('disconnect', () => {
        console.log('Socket disconnected');
        setIsConnected(false);
        setJoinedRooms([]);
      });

      newSocket.on('connect_error', (err) => {
        console.error('Connection error:', err);
      });

      // Listen untuk event room khusus
      newSocket.on('room-message', (data) => {
        console.log('Message from room:', data);
        // Di sini Anda bisa menambahkan handler untuk pesan room
      });

    } catch (error) {
      console.error('Failed to initialize socket:', error);
    }

    return () => {
      if (newSocket) {
        newSocket.off('connect');
        newSocket.off('disconnect');
        newSocket.off('connect_error');
        newSocket.off('room-message');
        newSocket.close();
      }
    };
  }, [socketOptions]);

  const contextValue = useMemo(() => ({
    socket,
    isConnected,
    joinedRooms,
    joinRoom,
    leaveRoom
  }), [socket, isConnected, joinedRooms]);

  return (
    <SocketContext.Provider value={contextValue}>
      {children}
    </SocketContext.Provider>
  );
};

SocketProvider.propTypes = {
  children: PropTypes.node.isRequired
};