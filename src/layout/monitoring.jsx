import { useContext, useEffect, useState, useMemo } from "react";
import { SocketContext } from "../SocketProvider";
import { FiSearch, FiUser, FiAlertCircle, FiCheckCircle, FiLogIn, FiLogOut, FiSend } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";
import useList from "../hook/useList";

const RoomCatatan = ({ roomId, data }) => {
  const [activities, setActivities] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);
  const [message, setMessage] = useState("");
  const [isSending, setIsSending] = useState(false);
  const { socket } = useContext(SocketContext);
  const {identitas} = useList()

  useEffect(() => {
    if (!socket) return;
    
    const handleRoomUpdate = (data) => {
      setActivities(data.catatanUjian);
    };

    socket.emit('get-catatan', roomId, (response) => {
      if (response.success) setActivities(response.catatanUjian);
    });

    socket.on("catatan.reply", handleRoomUpdate);
   
    return () => {
      socket.off("catatan.reply", handleRoomUpdate);
    };
  }, [socket, roomId]);

  const filteredActivities = useMemo(() => {
    return activities.filter(activity => 
      activity.message.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [activities, searchQuery]);

  const extractNameFromMessage = (message) => {
    const parts = message.split(' ');
    if (parts.length > 1) {
      return parts[0] + ' ' + parts[1];
    }
    return parts[0];
  };

  const handleNameClick = (activity) => {
    const name = extractNameFromMessage(activity.message);
    setSelectedUser({
      id: activity.userId,
      name: name
    });
  };

  const handleSendMessage = () => {
    if (!message.trim() || !selectedUser || !socket) return;
    
    setIsSending(true);
    
    const messageData = {
      recipientId: selectedUser.id,
      message: message,
      timestamp: new Date().toISOString(),
      senderId: identitas.name // Assuming data contains current user's id
    };

    socket.emit("kirim-pesan", { data: messageData }, (response) => {
      setIsSending(false);
      if (response.success) {
        setMessage("");
        setSelectedUser(null);
      } else {
        console.error("Failed to send message:", response.error);
      }
    });
  };

  const getActivityType = (text) => {
    if (text.message.includes('masuk')) return 'enter';
    if (text.message.includes('toleransi')) return 'exit';
    if (text.message.includes('keluar')) return 'exit';
    if (text.message.includes('mulai')) return 'start';
    if (text.message.includes('Menyelesaikan')) return 'complete';
    if (text.message.includes('progress')) return 'progress';
    return 'other';
  };

  const activityConfig = {
    enter: {
      icon: <FiLogIn className="text-green-500" />,
      bg: "bg-green-50",
      text: "text-green-700"
    },
    exit: {
      icon: <FiLogOut className="text-red-500" />,
      bg: "bg-red-50",
      text: "text-red-700"
    },
    start: {
      icon: <FiAlertCircle className="text-blue-500" />,
      bg: "bg-blue-50",
      text: "text-blue-700"
    },
    complete: {
      icon: <FiCheckCircle className="text-green-600" />,
      bg: "bg-green-200",
      text: "text-green-900"
    },
    progress: {
      icon: <FiCheckCircle className="text-green-600" />,
      bg: "bg-green-100",
      text: "text-green-800"
    },
    other: {
      icon: <FiUser className="text-gray-500" />,
      bg: "bg-gray-50",
      text: "text-gray-700"
    }
  };

  return (
    <section className="bg-white rounded-xl shadow-sm p-4 h-full border border-gray-100 flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-800 flex items-center">
          <FiAlertCircle className="mr-2 text-blue-500" />
          Exam Activity Log
        </h3>
        <span className="bg-blue-100 text-blue-800 text-xs px-2.5 py-1 rounded-full font-medium">
          {filteredActivities.length} {filteredActivities.length === 1 ? 'activity' : 'activities'}
        </span>
      </div>
      
      {/* Search Bar */}
      <div className="relative mb-4">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <FiSearch className="text-gray-400" />
        </div>
        <input
          type="text"
          className="block w-full pl-10 pr-3 py-2.5 border border-gray-200 rounded-lg leading-5 bg-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-300 text-sm"
          placeholder="Search activities..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>
      
      {/* Message Modal */}
      <AnimatePresence>
        {selectedUser && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
            onClick={() => setSelectedUser(null)}
          >
            <motion.div 
              className="bg-white rounded-lg p-6 w-full max-w-md"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-lg font-medium mb-4">
                Send message to {selectedUser.name}
              </h3>
              <textarea
                className="w-full border border-gray-300 rounded-lg p-3 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-100"
                rows="4"
                placeholder="Type your message here..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              />
              <div className="flex justify-end space-x-2">
                <button
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                  onClick={() => setSelectedUser(null)}
                >
                  Cancel
                </button>
                <button
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center disabled:opacity-50"
                  onClick={handleSendMessage}
                  disabled={!message.trim() || isSending}
                >
                  {isSending ? (
                    "Sending..."
                  ) : (
                    <>
                      <FiSend className="mr-2" />
                      Send
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      
      <div id="scrollbar" className="flex-1 overflow-y-auto">
        {filteredActivities.length > 0 ? (
          <div className="space-y-2">
            <AnimatePresence>
              {filteredActivities.map((activity, index) => {
                const type = getActivityType(activity);
                const config = activityConfig[type];
                const name = extractNameFromMessage(activity.message);
                
                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2 }}
                     onClick={() => handleNameClick(activity)}
                    className={`flex items-start p-3 rounded-lg transition-colors ${config.bg} hover:bg-opacity-70`}
                  >
                    <div className="flex-shrink-0 mt-0.5 mr-3">
                      {config.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={`text-sm font-medium ${config.text} break-words`}>
                        {activity.message.split(' ').map((word, i, arr) => {
                          if (i < 2 && name.includes(word)) {
                            return (
                              <span 
                                key={i} 
                                className="cursor-pointer hover:underline font-semibold"
                               
                              >
                                {word}{i < arr.length - 1 ? ' ' : ''}
                              </span>
                            );
                          }
                          return word + (i < arr.length - 1 ? ' ' : '');
                        })}
                      </p>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        ) : (
          <div className="h-full flex flex-col items-center justify-center text-center py-4 text-gray-400">
            <FiUser className="w-14 h-14 mb-3 text-gray-200" />
            {searchQuery ? (
              <p className="text-gray-500">No activities found for "{searchQuery}"</p>
            ) : (
              <>
                <p className="font-medium text-gray-500">No activities recorded</p>
                <p className="text-xs mt-1">Exam activities will appear here</p>
              </>
            )}
          </div>
        )}
      </div>
    </section>
  );
};

export default RoomCatatan;