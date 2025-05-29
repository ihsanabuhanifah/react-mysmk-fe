


import { useContext, useEffect, useState, useMemo } from "react";
import { SocketContext } from "../SocketProvider";
import { useRoomHandling } from "../hook/useRoomHandling";
import { formatHariInd, formatJam } from "../utils/waktu";
import { FiSearch, FiUser } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";

// Variants untuk animasi
const memberVariants = {
  hidden: { opacity: 0, y: -10 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.3 }
  },
  exit: { 
    opacity: 0, 
    x: 50,
    transition: { duration: 0.2 }
  }
};

const RoomMembers = ({ roomId, data }) => {
  const [members, setMembers] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const { socket } = useContext(SocketContext);

  useEffect(() => {
    if (!socket) return;
    
    const handleRoomUpdate = (data) => {
      console.log("Room update:", data);
      setMembers(data.members);
    };

     socket.emit('get-members', roomId, (response) => {
      if (response.success) setMembers(response.members);
    });

    socket.on("room-update", handleRoomUpdate);
   
    return () => {
      socket.off("room-update", handleRoomUpdate);
    };
  }, [socket]);

  const filteredMembers = useMemo(() => {
    return members.filter(member => 
      member.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [members, searchQuery]);

  return (
    <section className="bg-white rounded-lg shadow-sm p-4 h-full border border-gray-200 flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-800">Online Members</h3>
        <motion.span 
          key={filteredMembers.length}
          initial={{ scale: 1.2 }}
          animate={{ scale: 1 }}
          className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full"
        >
          {filteredMembers.length} online
        </motion.span>
      </div>
      
      <div className="relative mb-4">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <FiSearch className="text-gray-400" />
        </div>
        <input
          type="text"
          className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          placeholder="Search by name..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>
      
      <div className="flex-1 overflow-y-auto">
        {filteredMembers.length > 0 ? (
          <div className="space-y-3">
            <AnimatePresence>
              {filteredMembers.reverse().map((member) => (
                <motion.div
                  key={member.id}
                  layout
                  variants={memberVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  className="flex items-center p-2 hover:bg-gray-50 rounded-lg transition-colors"
                >
                  <div className="relative">
                    <motion.div
                      layout
                      className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-medium"
                    >
                      {member.name.charAt(0).toUpperCase()}
                    </motion.div>
                    <motion.span 
                      layout
                      className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"
                    />
                  </div>
                  
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-800">
                      {member.name} 
                      <span className="text-red-500"> {member.role === "Siswa" ? "(Siswa)" : ""}</span>
                    </p>
                    <p className="text-xs text-gray-500">
                      Joined at {formatJam(member.joinedAt)} 
                    </p>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        ) : (
          <div className="h-full flex flex-col items-center justify-center text-center py-4 text-gray-500">
            <FiUser className="w-12 h-12 mb-2 text-gray-300" />
            {searchQuery ? (
              <p>No members found for "{searchQuery}"</p>
            ) : (
              <p>No members online</p>
            )}
          </div>
        )}
      </div>
    </section>
  );
};

export default RoomMembers;