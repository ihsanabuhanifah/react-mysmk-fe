import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiX, FiMessageSquare, FiSend, FiArrowRight } from "react-icons/fi";

const MessagePopup = ({ socket, userId, setSelectedUser,   }) => {
  const [incomingMessage, setIncomingMessage] = useState(null);
  const [isVisible, setIsVisible] = useState(false);
  const [isReplying, setIsReplying] = useState(false);
  const [replyMessage, setReplyMessage] = useState("");

  useEffect(() => {
    if (!socket) return;

    const handleIncomingMessage = (data) => {
      if (data.recipientId === userId) {
        setIncomingMessage(data);

         setIsVisible(true);
       

        // Auto hide after 10 seconds
        const timer = setTimeout(() => {
          setIsVisible(false);
        }, 10000);

        return () => clearTimeout(timer);
      }
    };

    socket.on("kirim-pesan.reply", handleIncomingMessage);

    return () => {
      socket.off("kirim-pesan.reply", handleIncomingMessage);
    };
  }, [socket, userId]);

  const handleClose = () => {
    setIsVisible(false);
    setIsReplying(false);
    setReplyMessage("");
  };

  const handleReply = () => {
    setIsReplying(true);
  };

  const handleSendReply = () => {
    if (!replyMessage.trim() || !incomingMessage || !socket) return;

    const replyData = {
      recipientId: incomingMessage.senderId,
      recipientName: incomingMessage.senderName,
      senderId: userId,
      senderName: "You", // Replace with actual sender name if available
      message: replyMessage,
      timestamp: new Date().toISOString(),
      roomId: incomingMessage.roomId,
    };

    socket.emit("kirim-pesan", { data: replyData }, (response) => {
      if (response.success) {
        setReplyMessage("");
        setIsReplying(false);
setIsVisible(false);
       

        // Optionally open chat with the user

      }
    });
  };

  return (
    <AnimatePresence>
      {isVisible && incomingMessage && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          className="fixed bottom-4 right-4 z-[99999]"
        >
          <div className="flex max-h-[80vh] w-80 flex-col overflow-hidden rounded-lg border border-gray-200 bg-white shadow-lg">
            <div className="flex items-center justify-between bg-blue-600 px-4 py-3 text-white">
              <div className="flex items-center">
                <FiMessageSquare className="mr-2" />
                <span className="font-medium">New Message</span>
              </div>
              <button
                onClick={handleClose}
                className="text-white transition-colors hover:text-blue-200"
              >
                <FiX />
              </button>
            </div>

            <div className="flex-grow overflow-y-auto p-4">
              <div className="mb-3">
                <p className="mb-1 text-sm text-gray-600">From:</p>
                <p className="flex items-center font-medium text-gray-800">
                  <span className="mr-2 flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 text-blue-600">
                    {incomingMessage.senderName.charAt(0).toUpperCase()}
                  </span>
                  {incomingMessage.senderName}
                </p>
              </div>

              <div className="mb-3">
                <p className="mb-1 text-sm text-gray-600">Message:</p>
                <div className="whitespace-pre-wrap break-words rounded-md bg-blue-50 p-3">
                  <p className="text-gray-800">{incomingMessage.message}</p>
                </div>
              </div>

              <p className="text-right text-xs text-gray-500">
                {new Date(incomingMessage.timestamp).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
            </div>

            {isReplying ? (
              <div className="border-t bg-gray-50 px-4 py-3">
                <div className="mb-2 flex items-center">
                  <FiArrowRight className="mr-2 text-blue-500" />
                  <span className="text-sm font-medium text-gray-700">
                    Replying to {incomingMessage.senderName}
                  </span>
                </div>
                <textarea
                  className="mb-2 w-full rounded-md border border-gray-300 p-2 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
                  rows="2"
                  placeholder="Type your reply..."
                  value={replyMessage}
                  onChange={(e) => setReplyMessage(e.target.value)}
                  autoFocus
                />
                <div className="flex justify-end space-x-2">
                  <button
                    onClick={() => setIsReplying(false)}
                    className="px-3 py-1.5 text-sm text-gray-600 hover:text-gray-800"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSendReply}
                    disabled={!replyMessage.trim()}
                    className="flex items-center rounded-md bg-blue-600 px-3 py-1.5 text-sm text-white hover:bg-blue-700 disabled:opacity-50"
                  >
                    <FiSend className="mr-1" /> Send
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex justify-between border-t bg-gray-50 px-4 py-3">
                <button
                  onClick={handleClose}
                  className="px-3 py-1.5 text-sm text-gray-600 hover:text-gray-800"
                >
                  Tutup
                </button>

                 <button
                  onClick={()=> {
                    handleClose()
                     setSelectedUser({
          id: incomingMessage.senderId,
          name: incomingMessage.senderName,
        });
                  }}
                  className="px-3 py-1.5 text-sm text-gray-600 hover:text-gray-800"
                >
                  Buka Chat
                </button>
                <button
                  onClick={handleReply}
                  className="flex items-center rounded-md bg-blue-600 px-3 py-1.5 text-sm text-white hover:bg-blue-700"
                >
                  <FiMessageSquare className="mr-1" /> Balas
                </button>
              </div>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default MessagePopup;


       