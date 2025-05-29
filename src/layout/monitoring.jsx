import { useContext, useEffect, useState, useMemo } from "react";
import { SocketContext } from "../SocketProvider";
import { useRoomHandling } from "../hook/useRoomHandling";
import { formatHariInd, formatJam } from "../utils/waktu";
import { FiSearch, FiUser } from "react-icons/fi";

const RoomCatatan = ({ roomId, data }) => {
  const [members, setMembers] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const { socket } = useContext(SocketContext);

  useEffect(() => {
    if (!socket) return;
    
    const handleRoomUpdate = (data) => {
      setMembers(data.catatanUjian);
    };

    socket.emit('get-catatan', roomId, (response) => {
      if (response.success) setMembers(response.catatanUjian);
    });

    socket.on("catatan.reply", handleRoomUpdate);
   
    return () => {
      socket.off("catatan.reply", handleRoomUpdate);
    };
  }, [socket]);

  const filteredMembers = useMemo(() => {
    return members.filter(member => 
      member.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [members, searchQuery]);

  // Function to style the text based on content
  const formatActivityText = (text) => {
    if (text.includes('masuk')) {
      return <span className="text-green-600">{text}</span>;
    } else if (text.includes('keluar')) {
      return <span className="text-red-600">{text}</span>;
    } else if (text.includes('mulai')) {
      return <span className="text-blue-600">{text}</span>;
    }else if (text.includes('Menyelesaikan')) {
      return <span className="text-green-700">{text}</span>;
    }      
    return text;
  };

  return (
    <section className="bg-white rounded-lg shadow-sm p-4 h-full border border-gray-200 flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-800">Exam Activity Log</h3>
        <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
          {filteredMembers.length} activities
        </span>
      </div>
      
      {/* Search Bar */}
      <div className="relative mb-4">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <FiSearch className="text-gray-400" />
        </div>
        <input
          type="text"
          className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          placeholder="Search activities..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>
      
      <div className="flex-1 overflow-y-auto">
        {filteredMembers.length > 0 ? (
          <div className="space-y-2">
            {filteredMembers.map((member, index) => (
              <div 
                key={index} 
                className="flex items-start p-2 hover:bg-gray-50 rounded-lg transition-colors"
              >
                <div className="flex-shrink-0">
                  {member.includes('masuk') ? (
                    <div className="w-2 h-2 rounded-full bg-green-500"></div>
                  ) :   member.includes('keluar') ? (
                    <div className="w-2 h-2 rounded-full bg-red-500"></div>
                  ) : member.includes('mulai') ? (
                    <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                  ) : member.includes('Menyelesaikan') ? (
                    <div className="w-2 h-2 rounded-full bg-green-600"></div>
                  ) : (
                    <div className="w-2 h-2 rounded-full bg-gray-400"></div>
                  )}
                </div>
                <p className="text-xs ml-2">
                  {formatActivityText(member)}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <div className="h-full flex flex-col items-center justify-center text-center py-4 text-gray-500">
            <FiUser className="w-12 h-12 mb-2 text-gray-300" />
            {searchQuery ? (
              <p>No activities found for "{searchQuery}"</p>
            ) : (
              <p>No activities recorded</p>
            )}
          </div>
        )}
      </div>
    </section>
  );
};

export default RoomCatatan;