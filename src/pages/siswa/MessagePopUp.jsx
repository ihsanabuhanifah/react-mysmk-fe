import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiX, FiMessageSquare } from 'react-icons/fi';

const MessagePopup = ({ socket, userId }) => {
  const [incomingMessage, setIncomingMessage] = useState(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (!socket) return;

    const handleIncomingMessage = (data) => {
      console.log("data", data)
      console.log("user", userId)
      if (data.recipientId === userId) {
        setIncomingMessage(data);
        setIsVisible(true);
        
        // Auto hide after 30 seconds
        const timer = setTimeout(() => {
          setIsVisible(false);
        }, 30000);
        
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
  };

  return (
    <AnimatePresence>
      {isVisible && incomingMessage && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="fixed top-4 right-4 z-[99999]"
        >
          <div className="bg-white rounded-lg shadow-lg w-80 border border-red-200 overflow-hidden flex flex-col max-h-[80vh]">
            <div className="bg-red-600 text-white px-4 py-3 flex justify-between items-center flex-shrink-0">
              <div className="flex items-center">
                <FiMessageSquare className="mr-2" />
                <span className="font-medium">Pesan Masuk</span>
              </div>
              <button 
                onClick={handleClose}
                className="text-white hover:text-red-200 transition-colors"
              >
                <FiX />
              </button>
            </div>
            <div className="p-4 overflow-y-auto flex-grow">
              <p className="text-gray-700 mb-2 truncate">
                <span className="font-semibold">From: </span>
                {incomingMessage.senderId}
              </p>
              <div className="bg-red-50 p-3 rounded-md break-words whitespace-pre-wrap overflow-auto max-h-[200px] border border-red-100">
                <p className="text-gray-800">{incomingMessage.message}</p>
              </div>
              <p className="text-xs text-gray-500 mt-2">
                {new Date(incomingMessage.timestamp).toLocaleTimeString()}
              </p>
            </div>
            <div className="px-4 py-2 bg-gray-50 flex justify-end flex-shrink-0 border-t border-red-100">
              <button
                onClick={handleClose}
                className="text-sm text-red-600 hover:text-red-800 font-medium transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default MessagePopup;