// useRoomHandling.js (Custom Hook)
import { useEffect } from "react";

export function useRoomHandling(socket, roomId, data, handleJoinRoom) {
  useEffect(() => {
    if (!socket || !roomId || !data) return;

    // Heartbeat setiap 15 detik
    const heartbeatInterval = setInterval(() => {
      socket.emit("heartbeat", {
        userId: data.id,
        roomId,
      });
    }, 15000);

    // Deteksi sebelumunload (tab/browser close)
    const handleBeforeUnload = () => {
      // Kirim leave request secepat mungkin
      navigator.sendBeacon(
        `${socket.io.uri}/leave-room`,
        JSON.stringify({
          roomId,
          userId: data.id,
        }),
      );
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    // Rejoin saat page visible kembali
    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        handleJoinRoom();
      } else {
        socket.emit("leave-room", { roomId, userId: data.id });
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      clearInterval(heartbeatInterval);
      window.removeEventListener("beforeunload", handleBeforeUnload);
      document.removeEventListener("visibilitychange", handleVisibilityChange);

      // Manual leave jika komponen unmount
      socket.emit("leave-room", { roomId, userId: data.id });
    };
  }, [socket, roomId, data]);
}
