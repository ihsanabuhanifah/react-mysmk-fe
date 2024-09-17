import React, { useEffect, useState } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";

import Notifikasi from "../module/notifikasi";
import LogoMySMK from "../image/MySMK.png";

import { MdMenu } from "react-icons/md";
import useShowNotif from "../hook/useShowNotif";
import useNotif from "../hook/useNotif";
import useList from "../hook/useList";
import { syncToken } from "../api/axiosClient";
import SidebarSiswa from "./Sidebar/sidebarSiswa";
import { useQuery } from "react-query";
import { getProfile } from "../api/siswa/profile";
import { IoLogOutOutline, IoNotifications } from "react-icons/io5";
import { LoadingPage, ModalLogout } from "../components";
import { useZUStore } from "../zustand/zustore";
import { Menu, Sidebar } from "semantic-ui-react";
import { useListNotif } from "../api/siswa/exam";

export default function Siswa() {
  let { pathname } = useLocation();
  const navigate = useNavigate();
  React.useEffect(() => {
    document.title = "MySMK";
    // requestToken();
  });

  syncToken();

  const { setShowNotif, showNotif, setProfile } = useZUStore((state) => state);

  // const { data: dataNotif, isFetched } = useListNotif();

  const { identitas: data } = useList();
  let { isLoading } = useQuery(["/santri/profile"], () => getProfile(), {
    onSuccess: (response) => {
      setProfile(response);
    },
    refetchOnWindowFocus: false,
    select: (response) => {
      return response.data.siswa;
    },
  });

  const [sidebar, setSidebar] = React.useState(false);
  let { jumlah } = useNotif();

  const [open, setOpen] = React.useState(false);

  React.useEffect(() => {
    if (pathname === "/siswa") {
      navigate("/siswa/dashboard");
    }
  }, [pathname, navigate]);

  if (isLoading) {
    return <LoadingPage />;
  }

  return (
    <>
      <ModalLogout open={open} setOpen={setOpen} />

      <div className="h-screen overflow-hidden text-gray-700 antialiased">
        {/* tablet */}
        <header className="grid h-[8%] w-full grid-cols-10 items-center gap-x-5 border lg:h-1/12 xl:hidden xl:h-1/12">
          <div className="relative col-span-4 flex h-full w-full items-center pl-5">
            <img
              className="absolute"
              style={{ maxWidth: "60%", maxHeight: "60%" }}
              src={LogoMySMK}
              alt={LogoMySMK}
            />
          </div>

          <div className="relative col-span-6 flex h-full w-full items-center justify-end space-x-4 pr-5 xl:col-span-2">
            <button
              onClick={() => {
                setShowNotif();
              }}
              className="relative block xl:hidden"
            >
              <IoNotifications size={26} className="" />
              {/* {isFetched && (
                <span className="absolute right-1 top-1 inline-flex -translate-y-1/2 translate-x-1/2 transform items-center justify-center rounded-full bg-red-600 px-2 py-1 text-xs font-bold leading-none text-white">
                  {dataNotif?.list?.count}
                </span>
              )} */}
            </button>

            <div className="flex items-center justify-center xl:hidden">
              <button
                onClick={() => {
                  setSidebar(!sidebar);
                }}
              >
                <MdMenu size={35} />
              </button>
            </div>
          </div>
        </header>
        {/* tablet */}

        <main className="h-full xl:flex xl:h-full">
          <div
            className={`h-screen w-full bg-gray-50 pl-2 text-white xl:rounded-r-3xl xl:bg-gray-50 ${
              !sidebar
                ? "-z-50 -translate-x-full transform xl:-translate-x-0"
                : "z-10 -translate-x-0 transform transition duration-500"
            } fixed bottom-0 top-0 flex h-full flex-col xl:relative xl:w-[200px]`}
          >
            {/* laptop */}
            <div className="mb-8 mt-4 hidden pl-3 xl:block">
              {/* <img style={{ maxWidth: '60%', maxHeight: '60%' }} src={LogoMySMK} alt={LogoMySMK} /> */}
              <img className="w-[65%]" src={LogoMySMK} alt={LogoMySMK} />
            </div>
            {/* laptop */}

            <div className="flex h-full flex-col xl:flex-1 xl:overflow-y-auto">
              <SidebarSiswa setSidebar={setSidebar} />
            </div>

            {/* laptop */}
            <div className="mb-4 ml-2 mt-5 hidden xl:block">
              <LogoutButton
                onClick={() => {
                  return setOpen(true);
                }}
                title={"Logout"}
                logo={
                  <IoLogOutOutline
                    className={`h-6 w-6 text-gray-900 group-hover:text-[#18a558]`}
                  />
                }
              />
            </div>
            {/* laptop */}
          </div>

          <div id="sidebar" className="w-full h-full">
            <Outlet data={data} />
          </div>
        </main>
        {/* notif */}
      </div>

      {showNotif && (
        <div
          onClick={() => {
            setShowNotif();
          }}
          className="fixed top-0 right-0 left-0 bottom-0 bg-transparent"
        ></div>
      )}
      <div
        className={`fixed right-0 top-0 h-full transform bg-white text-gray-700 w-full sm:w-[70%] md:w-[30%] xl:w-[20%] ${showNotif ? "translate-x-0" : "translate-x-full"} z-10 transition-transform duration-500`}
      >
        <Notifikasi />
      </div>
    </>
  );
}

export function LogoutButton({ to, title, logo, onClick }) {
  let { pathname } = useLocation();
  let url = pathname.split("/")[2];

  return (
    <button
      onClick={onClick}
      className="group flex flex-grow-0 items-center font-extrabold"
    >
      <div>{logo}</div>
      <p
        className={`ml-2 text-left font-poppins text-xs font-extrabold text-gray-900 ${url === to ? "text-white-400" : "text-gray-600"} font-bold group-hover:text-[#18a558]`}
      >
        {title}
      </p>
    </button>
  );
}
