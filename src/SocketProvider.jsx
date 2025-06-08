// SocketProvider.js (updated)
import { createContext, useEffect, useState, useMemo } from "react";
import { io } from "socket.io-client";
import PropTypes from "prop-types";

export const SocketContext = createContext();

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [joinedRooms, setJoinedRooms] = useState([]);
  const [activityIntervals, setActivityIntervals] = useState({});

  const socketOptions = useMemo(
    () => ({
      autoConnect: true,
      reconnection: true,
      reconnectionAttempts: Infinity,
      reconnectionDelay: 1000,
    }),
    [],
  );

  // Fungsi untuk join room dengan aktivitas tracking
  const joinRoom = (roomId, userData) => {
    if (!socket) return Promise.reject("Socket not connected");

    return new Promise((resolve, reject) => {
      socket.emit(
        "join-room",
        {
          roomId,
          user: {
            id: userData.id,
            name: userData.name,
            role: userData.role,
            // tambahkan properti user lainnya jika diperlukan
          },
        },
        (response) => {
          if (response.success) {
            setJoinedRooms((prev) => [...prev, roomId]);
            
            // Mulai mengirim aktivitas setiap 25 detik
            const interval = setInterval(() => {
              socket.emit("user-activity", { roomId, userId: userData.id });
            }, 25000);
            
            setActivityIntervals(prev => ({
              ...prev,
              [roomId]: interval
            }));
            
            resolve(response);
          } else {
            reject(response.error);
          }
        },
      );
    });
  };

  // Fungsi untuk leave room
  const leaveRoom = (roomId) => {
    if (!socket || !isConnected) return false;

    return new Promise((resolve, reject) => {
      socket.emit(
        "leave-room", 
        { roomId, userId: socket.id }, // Sesuaikan dengan server implementation
        (response) => {
          if (response.success) {
            setJoinedRooms((prev) => prev.filter((id) => id !== roomId));
            
            // Hentikan interval aktivitas untuk room ini
            if (activityIntervals[roomId]) {
              clearInterval(activityIntervals[roomId]);
              setActivityIntervals(prev => {
                const newIntervals = {...prev};
                delete newIntervals[roomId];
                return newIntervals;
              });
            }
            
            resolve(response);
          } else {
            reject(response.error);
          }
        },
      );
    });
  };

  // Fungsi untuk mengirim pesan
  const sendMessage = (roomId, messageData) => {
    if (!socket || !isConnected) return false;
    
    socket.emit("kirim-pesan", { 
      data: {
        ...messageData,
        roomId,
        senderId: socket.id, // atau userId dari state/context
        timestamp: new Date().toISOString()
      }
    });
    
    // Juga kirim aktivitas
    socket.emit("user-activity", { roomId, userId: socket.id });
  };

  // Fungsi untuk mengirim catatan
  const sendNote = (roomId, noteData) => {
    if (!socket || !isConnected) return false;
    
    socket.emit("catatan", {
      ...noteData,
      roomId,
      userId: socket.id // atau userId dari state/context
    });
    
    // Juga kirim aktivitas
    socket.emit("user-activity", { roomId, userId: socket.id });
  };

  useEffect(() => {
    let newSocket;
    try {
      newSocket = io(process.env.REACT_APP_API_URL, socketOptions);
      setSocket(newSocket);

      newSocket.on("connect", () => {
        console.log("Socket connected");
        setIsConnected(true);
      });

      newSocket.on("disconnect", () => {
        console.log("Socket disconnected");
        setIsConnected(false);
        
        // Hentikan semua interval aktivitas
        Object.values(activityIntervals).forEach(interval => {
          clearInterval(interval);
        });
        setActivityIntervals({});
        setJoinedRooms([]);
      });

      newSocket.on("connect_error", (err) => {
        console.error("Connection error:", err);
      });

      // Listen untuk event room update
      newSocket.on("room-update", (data) => {
        console.log("Room update:", data);
        if (data.type === "user-left" || data.type === "user-timeout") {
          // Update UI jika ada user yang keluar
        }
      });

      // Listen untuk pesan baru
      newSocket.on("kirim-pesan.reply", (data) => {
        console.log("New message:", data);
        // Handle new message
      });

      // Listen untuk catatan baru
      newSocket.on("catatan.reply", (data) => {
        console.log("New note:", data);
        // Handle new note
      });

    } catch (error) {
      console.error("Failed to initialize socket:", error);
    }

    return () => {
      if (newSocket) {
        newSocket.off("connect");
        newSocket.off("disconnect");
        newSocket.off("connect_error");
        newSocket.off("room-update");
        newSocket.off("kirim-pesan.reply");
        newSocket.off("catatan.reply");
        newSocket.close();
      }
      
      // Hentikan semua interval saat unmount
      Object.values(activityIntervals).forEach(interval => {
        clearInterval(interval);
      });
    };
  }, [socketOptions]);

  const contextValue = useMemo(
    () => ({
      socket,
      isConnected,
      joinedRooms,
      joinRoom,
      leaveRoom,
      sendMessage,
      sendNote,
    }),
    [socket, isConnected, joinedRooms, activityIntervals],
  );

  return (
    <SocketContext.Provider value={contextValue}>
      {children}
    </SocketContext.Provider>
  );
};

SocketProvider.propTypes = {
  children: PropTypes.node.isRequired,
};