import { useContext, useEffect, useState, useMemo, useRef } from "react";
import { SocketContext } from "../SocketProvider";
import { formatJam, formatWaktu } from "../utils/waktu";
import { FiSearch, FiUser, FiSend, FiMessageSquare, FiX } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";
import Chat from "./Chat";

const RoomMembers = ({ roomId, data, selectedUser, setSelectedUser }) => {
  const [members, setMembers] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  const [message, setMessage] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [chatMessages, setChatMessages] = useState(() => {
    // Initialize from sessionStorage if available
    const savedMessages = sessionStorage.getItem(`chatMessages-${roomId}`);
    return savedMessages ? JSON.parse(savedMessages) : [];
  });

  const { socket } = useContext(SocketContext);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    sessionStorage.setItem(
      `chatMessages-${roomId}`,
      JSON.stringify(chatMessages),
    );
  }, [chatMessages, roomId]);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    scrollToBottom();
  }, [chatMessages, selectedUser]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (!socket) return;

    const handleRoomUpdate = (data) => {
      setMembers(data.members);
    };

    const handleNewMessage = (messageData) => {
      setChatMessages((prev) => {
        const newMessages = [...prev, messageData];
        // Update sessionStorage immediately
        sessionStorage.setItem(
          `chatMessages-${roomId}`,
          JSON.stringify(newMessages),
        );
        return newMessages;
      });

      // If the message is for the current chat and modal is closed, show notification
      if (
        (messageData.senderId === selectedUser?.id ||
          messageData.recipientId === selectedUser?.id) &&
        !selectedUser
      ) {
        // You could add a notification system here
        console.log("New message from:", messageData.senderName);
      }
    };

    socket.emit("get-members", roomId, (response) => {
      if (response.success) setMembers(response.members);
    });

    socket.on("room-update", handleRoomUpdate);
    socket.on("kirim-pesan.reply", handleNewMessage);

    return () => {
      socket.off("room-update", handleRoomUpdate);
      socket.off("kirim-pesan.reply", handleNewMessage);
    };
  }, [socket, roomId, selectedUser]);

  const filteredMembers = useMemo(() => {
    return members.filter((member) =>
      member.name.toLowerCase().includes(searchQuery.toLowerCase()),
    );
  }, [members, searchQuery]);

  const handleSendMessage = (file) => {
    try {


      console.log("ok")
      if ((!message.trim() && file) || !selectedUser || !socket) return;

      console.log("file", file)

      setIsSending(true);

      const messageData = {
        recipientId: selectedUser.id,
        recipientName: selectedUser.name,
        senderId: data.id,
        senderName: data.name,
        message: message,
        timestamp: new Date().toISOString(),
        roomId: roomId,
        file : file
      };

      
      socket.emit("kirim-pesan", { data: messageData }, (response) => {


        setIsSending(false);
        if (response.success) {
          setMessage("");
          setChatMessages((prev) => {
            const newMessages = [...prev, messageData];
            sessionStorage.setItem(
              `chatMessages-${roomId}`,
              JSON.stringify(newMessages),
            );
            return newMessages;
          });
        } else {
          console.error("Failed to send message:", response.error);
        }
      });
    } catch (err) {
      console.log("err", err);
    }
  };

  const getMessagesWithUser = (userId) => {
    return chatMessages.filter(
      (msg) =>
        (msg.senderId === userId && msg.recipientId === data.id) ||
        (msg.senderId === data.id && msg.recipientId === userId),
    );
  };

  return (
    <section className="flex h-full flex-col rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-800">Online Members</h3>
        <motion.span
          key={filteredMembers.length}
          initial={{ scale: 1.2 }}
          animate={{ scale: 1 }}
          className="rounded-full bg-blue-100 px-2 py-1 text-xs text-blue-800"
        >
          {filteredMembers.length} online
        </motion.span>
      </div>

      <div className="relative mb-4">
        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
          <FiSearch className="text-gray-400" />
        </div>
        <input
          type="text"
          className="focus:outline-none block w-full rounded-md border border-gray-300 bg-white py-2 pl-10 pr-3 leading-5 placeholder-gray-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 sm:text-sm"
          placeholder="Search by name..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <div className="flex-1 overflow-y-auto">
        {filteredMembers.length > 1 ? (
          <div className="space-y-3">
            <AnimatePresence>
              {filteredMembers
                .reverse()
.filter((i)=> i.id !== data.id)
                .map((member) => (
                  <motion.div
                    key={member.id}
                    layout
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: 50 }}
                    transition={{ duration: 0.3 }}
                    className="flex cursor-pointer items-center rounded-lg p-2 transition-colors hover:bg-gray-50"
                    onClick={() => {
                      setSelectedUser(member);
                    }}
                  >
                    <div className="relative">
                      <motion.div
                        layout
                        className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-500 font-medium text-white"
                      >
                        {member.name.charAt(0).toUpperCase()}
                      </motion.div>
                      <motion.span
                        layout
                        className="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-white bg-green-500"
                      />
                    </div>

                    <div className="ml-3 flex-1">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium text-gray-800">
                          {member.name}
                          <span className="text-red-500">
                            {" "}
                            {member.role === "Siswa" ? "(Siswa)" : ""}
                          </span>
                        </p>
                        <button
                          className="p-1 text-blue-500 hover:text-blue-700"
                          onClick={(e) => {
                            e.stopPropagation();

                            setSelectedUser(member);
                          }}
                        >
                          <FiMessageSquare size={16} />
                        </button>
                      </div>
                      <p className="text-xs text-gray-500">
                        Joined at {formatJam(member.joinedAt)}
                      </p>
                    </div>
                  </motion.div>
                ))}
            </AnimatePresence>
          </div>
        ) : (
          <div className="flex h-full flex-col items-center justify-center py-4 text-center text-gray-500">
            <FiUser className="mb-2 h-12 w-12 text-gray-300" />
            {searchQuery ? (
              <p>No members found for "{searchQuery}"</p>
            ) : (
              <p>No other online</p>
            )}
          </div>
        )}
      </div>

      {/* Chat Modal */}
      <Chat
        selectedUser={selectedUser}
        getMessagesWithUser={getMessagesWithUser}
        setSelectedUser={setSelectedUser}
        data={data}
        messagesEndRef={messagesEndRef}
        message={message}
        setMessage={setMessage}
        handleSendMessage={handleSendMessage}
        isSending={isSending}
      />
    </section>
  );
};

export default RoomMembers;
