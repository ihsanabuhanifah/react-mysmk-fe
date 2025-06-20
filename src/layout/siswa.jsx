import React, { useContext, useEffect, useRef } from "react";
import { Outlet } from "react-router-dom";

import Notifikasi from "../module/notifikasi";
import LogoMySMK from "../image/MySMK.png";

import SidebarSiswa from "./Sidebar/sidebarSiswa";
import { MdMenu } from "react-icons/md";
import useShowNotif from "../hook/useShowNotif";
import { IoIosNotifications } from "react-icons/io";
import useNotif from "../hook/useNotif";
import useList from "../hook/useList";
import { syncToken } from "../api/axiosClient";
import { SocketContext } from "../SocketProvider";
import { useRoomHandling } from "../hook/useRoomHandling";
import useForceFullscreen from "../hook/useFullScreebDetector";
import MessagePopup from "../pages/siswa/MessagePopUp";
const roomId = "SMKMQ-ROOM";
export default function Guru() {
  React.useEffect(() => {
    document.title = "MySMK";
    // requestToken();
  });
  syncToken();
  const { identitas: data } = useList();

  const containerRef = useRef(null);
  const [sidebar, setSidebar] = React.useState(false);
  const [notif, setNotif] = React.useState(false);
  let [showNotif, setShowNotf] = useShowNotif();
  let { jumlah } = useNotif();

  const { socket, joinRoom } =
    useContext(SocketContext);

  const handleJoinRoom = async () => {
    try {
      const result = await joinRoom("SMKMQ-ROOM", {
        email: data.email,
        name: data.name,
        id: data.id,
        role: "Siswa",
      });
      console.log(result);
    } catch (error) {
      console.error("Failed to join room:", error);
    }
  };

  useEffect(() => {
    if (!socket && !data) return; // Hanya lanjutkan jika socket sudah ada

    handleJoinRoom();
  }, [socket, data]);

  // useRoomHandling(socket, roomId, data, handleJoinRoom);
  const isFullscreen = useForceFullscreen(containerRef);
  //  const handleViolation = (type) => {
  //     alert(`Pelanggaran terdeteksi: ${type}`);
  //     // Kirim log ke server jika diperlukan
  //   };

  //   usePreventCheating(handleViolation);

  return (
    <div
      ref={containerRef}
      className="h-screen overflow-hidden text-gray-700 antialiased"
    >
      <MessagePopup socket={socket} userId={data?.id} />
      <header className="w-fullx grid h-[8%] grid-cols-10 items-center gap-x-5 border lg:h-1/12 xl:hidden xl:h-1/12">
        <div className="relative col-span-4 flex h-full w-full items-center pl-5 lg:pl-2 xl:col-span-2 xl:pl-5 2xl:pl-10">
          <img
            className="absolute"
            style={{ maxWidth: "60%", maxHeight: "60%" }}
            src={LogoMySMK}
            alt={LogoMySMK}
          />
        </div>
        {/* {isFullscreen ? (
          "Anda sedang dalam fullscreen"
        ) : (
          <ForceFullscreenModal />
        )} */}

        <div className="relative col-span-6 flex h-full w-full items-center justify-end space-x-5 xl:col-span-2">
          <button
            onClick={() => {
              return setNotif(!notif);
            }}
            className={`relative`}
          >
            <IoIosNotifications
              className={`h-8 w-8 ${showNotif ? "text-white" : ""}`}
            />
            {jumlah > 0 && (
              <div
                style={{ fontSize: "8px" }}
                className="absolute right-0 top-0 z-10 h-4 w-4 rounded-full bg-red-400 pt-1 text-white"
              >
                {jumlah}
              </div>
            )}
          </button>
          <div className="hidden h-10 w-10 rounded-full bg-green-200 xl:block xl:h-12 xl:w-12"></div>
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
        <div
          className={`h-full w-full border-r-2 bg-[#46C7C7] px-2 text-white shadow-lg xl:bg-white xl:text-gray-700 ${
            !sidebar
              ? "-z-50 -translate-x-full transform xl:-translate-x-0"
              : "z-10 -translate-x-0 transform transition duration-500"
          } fixed bottom-0 top-0 h-full xl:relative xl:w-[15%]`}
        >
          <SidebarSiswa setSidebar={setSidebar} />
        </div>
        <div
          className={`content relative h-full w-full overflow-auto xl:overflow-hidden ${
            showNotif ? "xl:w-[85%]" : "xl:w-[85%]"
          }`}
        >
          <div className="bg-blue-400">
            <button
              onClick={() => {
                return setShowNotf(!showNotif);
              }}
              className={`absolute right-5 top-1 z-50 hidden rounded-full p-2 xl:block ${
                showNotif ? "bg-red-400" : ""
              }`}
            >
              <IoIosNotifications
                className={`h-8 w-8 ${showNotif ? "text-white" : ""}`}
              />
              {jumlah > 0 && (
                <div
                  style={{ fontSize: "8px" }}
                  className="absolute right-2 top-1 z-10 h-4 w-4 rounded-full bg-red-400 pt-1 text-white"
                >
                  {jumlah}
                </div>
              )}
            </button>
          </div>
          <div id="sidebar" className="h-full w-full">
            <Outlet data={data} />
          </div>
        </div>
        <div
          className={`h-full w-full bg-[#46C7C7] pl-0 text-white xl:bg-white xl:pl-2 xl:text-gray-700 ${
            !notif
              ? "-translate-y-full transform xl:-translate-y-0"
              : "-translate-y-0 transform transition duration-500"
          } fixed bottom-0 top-0 z-10 h-full ${
            !showNotif ? "xl:w-[20%]" : "xl:hidden"
          } xl:relative`}
        >
          <Notifikasi setNotif={setNotif} />
        </div>
      </main>
    </div>
  );
}

// className={`w-full h-full flex z-10 fixed top-0 bottom-0 xl:w-3/12  xl:relative text-white`}

function ForceFullscreenModal({ onRequestFullscreen }) {
  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black bg-opacity-90 text-white">
      <div className="px-6 text-center">
        <h1 className="mb-4 text-2xl font-bold">
          Aplikasi membutuhkan mode fullscreen
        </h1>
        <p className="mb-6">Silakan aktifkan fullscreen untuk melanjutkan.</p>
      </div>
    </div>
  );
}
