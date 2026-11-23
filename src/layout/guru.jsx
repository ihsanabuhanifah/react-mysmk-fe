import React, { useContext, useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import Notifikasi from "../module/notifikasi";
import LogoMySMK from "../image/MySMK.png";
import SidebarGuru from "./Sidebar/sidebarGuru";
import { MdMenu, MdClose } from "react-icons/md";
import { IoIosNotifications, IoIosPeople, IoIosEye } from "react-icons/io";
import useNotif from "../hook/useNotif";
import useList from "../hook/useList";
import { syncToken } from "../api/axiosClient";
import { SocketContext } from "../SocketProvider";
import RoomMembers from "./member";
import { useRoomHandling } from "../hook/useRoomHandling";
import RoomCatatan from "./monitoring";
import MessagePopup from "../pages/guru/MessagePopup";
import UserMenu from "../components/UserMenu";
export const roomId = "SMKMQ-ROOM";

export default function Guru() {
  React.useEffect(() => {
    document.title = "MySMK";
  });
  syncToken();
  const { identitas: data } = useList();
  const [sidebar, setSidebar] = React.useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [showPanel, setShowPanel] = useState("notifications"); // 'notifications', 'members', or 'monitoring'
  const [hover, setHover] = useState(false);
  const [pinned, setPinned] = useState(() => {
    try {
      return localStorage.getItem("mysmk_sidebar_pinned") === "1";
    } catch {
      return false;
    }
  });
  const togglePin = () =>
    setPinned((p) => {
      try {
        localStorage.setItem("mysmk_sidebar_pinned", p ? "0" : "1");
      } catch {}
      return !p;
    });
  const expanded = pinned || hover;
  let { jumlah } = useNotif();

  const [selectedUser, setSelectedUser] = useState(null);

  const { socket,joinRoom } =
    useContext(SocketContext);

  const handleJoinRoom = async () => {
    try {
      const result = await joinRoom(roomId, {
        email: data?.email,
        name: data?.name,
        id: data?.id,
      });

      console.log("res", result)

    } catch (error) {
      console.error("Failed to join room:", error);
    }
  };

  useEffect(() => {

    console.log('sic', socket)
    console.log("ata", data)
    if (!socket && !data) return;
    handleJoinRoom();
  }, [socket, data]);

  // useRoomHandling(socket, roomId, data, handleJoinRoom);

  return (
    <div className="h-screen overflow-hidden text-gray-700 antialiased">
      <header className="w-fullx grid h-[8%] grid-cols-10 items-center gap-x-5 border lg:h-1/12 xl:hidden xl:h-1/12">
        <div className="relative col-span-4 flex h-full w-full items-center pl-5 lg:pl-2 xl:col-span-2 xl:pl-5 2xl:pl-10">
          <img
            className="absolute"
            style={{ maxWidth: "60%", maxHeight: "60%" }}
            src={LogoMySMK}
            alt={LogoMySMK}
          />
        </div>

        <div className="relative col-span-6 flex h-full w-full items-center justify-end space-x-5 xl:col-span-2">
          <button
            onClick={() => setNotifOpen((o) => !o)}
            className={`relative`}
          >
            <IoIosNotifications className="h-8 w-8" />
            {jumlah > 0 && (
              <div
                style={{ fontSize: "8px" }}
                className="absolute right-0 top-0 z-10 h-4 w-4 rounded-full bg-red-400 pt-1 text-white"
              >
                {jumlah}
              </div>
            )}
          </button>
          <UserMenu compact />
          <div className="block h-10 w-10 xl:hidden xl:h-12 xl:w-12">
            <button
              className="mb-5"
              onClick={() => {
                setSidebar(!sidebar);
              }}
            >
              <MdMenu className="h-10 w-10" />
            </button>
          </div>
        </div>
      </header>
      <main className="lg:h-11/12 xl:h-11/12 flex h-[92%] xl:h-full">
        {/* Sidebar: mobile = laci; desktop = ikon saja, melebar saat hover, bisa dikunci */}
        <div
          className={`fixed inset-y-0 left-0 z-40 w-full transform transition-transform duration-300 sm:w-72 ${
            sidebar ? "translate-x-0" : "-translate-x-full"
          } xl:relative xl:z-30 xl:flex-shrink-0 xl:translate-x-0 xl:transition-all ${
            pinned ? "xl:w-64" : "xl:w-[72px]"
          }`}
        >
          <div
            onMouseEnter={() => setHover(true)}
            onMouseLeave={() => setHover(false)}
            className={`h-full w-full border-r bg-white xl:absolute xl:inset-y-0 xl:left-0 xl:transition-all xl:duration-200 ${
              expanded ? "xl:w-64" : "xl:w-[72px]"
            } ${hover && !pinned ? "xl:shadow-2xl" : ""}`}
          >
            <SidebarGuru
              setSidebar={setSidebar}
              collapsed={!expanded}
              pinned={pinned}
              onTogglePin={togglePin}
            />
          </div>
        </div>

        <div className="content relative h-full min-w-0 flex-1 overflow-auto xl:overflow-hidden">
          <div className="absolute right-20 top-2 z-30 hidden xl:block">
            <UserMenu />
          </div>
          <button
            onClick={() => setNotifOpen((o) => !o)}
            title="Notifikasi"
            className={`absolute right-5 top-2 z-30 hidden rounded-full p-2 xl:block ${
              notifOpen ? "bg-[#00BFBF] text-white" : "hover:bg-[#E6F9F9]"
            }`}
          >
            <IoIosNotifications className="h-8 w-8" />
            {jumlah > 0 && (
              <div
                style={{ fontSize: "8px" }}
                className="absolute right-2 top-1 z-10 h-4 w-4 rounded-full bg-red-400 pt-1 text-white"
              >
                {jumlah}
              </div>
            )}
          </button>
          <div id="sidebar" className="h-full w-full">
            <Outlet data={data} />
          </div>
        </div>

        {/* Panel notifikasi: tertutup default, terbuka saat lonceng diklik */}
        {notifOpen && (
          <div
            className="fixed inset-0 z-40"
            style={{ background: "rgba(0,0,0,0.2)" }}
            onClick={() => setNotifOpen(false)}
          />
        )}
        <aside
          className={`fixed inset-y-0 right-0 z-50 flex w-full flex-col bg-white text-gray-700 shadow-2xl transition-transform duration-300 sm:w-[380px] ${
            notifOpen ? "translate-x-0" : "translate-x-full"
          }`}
        >
          <div className="flex items-center justify-between border-b px-4 py-3">
            <span className="text-lg font-semibold">Notifikasi</span>
            <button
              onClick={() => setNotifOpen(false)}
              className="rounded-full p-1 text-gray-500 hover:bg-gray-100"
              title="Tutup"
            >
              <MdClose className="h-6 w-6" />
            </button>
          </div>
          <div className="flex border-b">
            <button
              className={`flex-1 py-2 ${showPanel === "notifications" ? "bg-[#00BFBF] text-white" : "bg-gray-100"}`}
              onClick={() => setShowPanel("notifications")}
            >
              <div className="flex items-center justify-center gap-2">
                <IoIosNotifications />
                <span className="text-xs">Notifikasi</span>
                {jumlah > 0 && (
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs text-white">
                    {jumlah}
                  </span>
                )}
              </div>
            </button>
            <button
              className={`flex-1 py-2 ${showPanel === "members" ? "bg-[#00BFBF] text-white" : "bg-gray-100"}`}
              onClick={() => setShowPanel("members")}
            >
              <div className="flex items-center justify-center gap-2">
                <IoIosPeople />
                <span className="text-xs">Online</span>
              </div>
            </button>
            <button
              className={`flex-1 py-2 ${showPanel === "monitoring" ? "bg-[#00BFBF] text-white" : "bg-gray-100"}`}
              onClick={() => setShowPanel("monitoring")}
            >
              <div className="flex items-center justify-center gap-2">
                <IoIosEye />
                <span className="text-xs">Monitoring</span>
              </div>
            </button>
          </div>
          <div className="min-h-0 flex-1 overflow-y-auto">
            {showPanel === "notifications" && <Notifikasi setNotif={setNotifOpen} />}
            {showPanel === "members" && (
              <RoomMembers
                selectedUser={selectedUser}
                setSelectedUser={setSelectedUser}
                roomId={roomId}
                data={data}
              />
            )}
            {showPanel === "monitoring" && <RoomCatatan roomId={roomId} />}
          </div>
        </aside>
      </main>

    { <MessagePopup
        selectedUser={selectedUser}
        socket={socket}
        setSelectedUser={setSelectedUser}
        userId={data?.id}
      />}
    </div>
  );
}
