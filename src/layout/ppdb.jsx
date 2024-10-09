import React, { useEffect, useState } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import Notifikasi from "../module/notifikasi";
import LogoMySMK from "../image/MySMK.png";
import { MdMenu } from "react-icons/md";
import useShowNotif from "../hook/useShowNotif";
import { IoIosNotifications } from "react-icons/io";
import useNotif from "../hook/useNotif";
import useList from "../hook/useList";
import { syncToken } from "../api/axiosClient";
import SidebarPpdb from "../layout/Sidebar/sideBarPpdb";
import { useQuery } from "react-query";
import { getProfile } from "../api/siswa/profile";
import { useDispatch } from "react-redux";
import { setProfile } from "../redux/actions";
import { IoLogOutOutline } from "react-icons/io5";
import ModalLogoutPpdb from "../components/ModalLogoutPpdb";
import { getProfileCalonSantri } from "../api/ppdb/profile";

// Loading Component
const Loading = () => (
  <div className="flex items-center justify-center h-full">
    <div className="animate-spin rounded-full h-24 w-24 border-t-4 border-blue-500 border-solid"></div>
  </div>
);

export default function Ppdb() {
  let { pathname } = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const id = "1";
  React.useEffect(() => {
    document.title = "MySMK";
  }, []);

  syncToken();
  const { dataCalonSantri: data } = useList();
  let { isLoading } = useQuery(
    [`/ppdb/detail-calsan/{id}`],
    () => getProfileCalonSantri(id),
    {
      onSuccess: (response) => {
        dispatch(setProfile(response));
      },
      refetchOnWindowFocus: false,
      select: (response) => {
        return response.data.calon_santri;
      },
    }
  );

  const [sidebar, setSidebar] = React.useState(false);
  const [notif, setNotif] = React.useState(false);
  let [showNotif, setShowNotf] = useShowNotif();
  let { jumlah } = useNotif();

  const [open, setOpen] = React.useState(false);

  // Redirect to dashboard if on /ppdb
  React.useEffect(() => {
    if (pathname === "/ppdb") {
      navigate("/ppdb/dashboard");
    }
  }, [pathname, navigate]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="loader"></div>
      </div>
    );
  }

  return (
    <>
      <ModalLogoutPpdb open={open} setOpen={setOpen} />

      <div className="h-screen antialiased text-gray-700 overflow-hidden">
        {/* tablet */}
        <header className="h-[8%] xl:hidden lg:h-1/12 xl:h-1/12 w-fullx items-center grid grid-cols-10 gap-x-5 border">
          <div className="col-span-4 xl:col-span-2 pl-5 lg:pl-2 xl:pl-5 2xl:pl-10 h-full w-full relative flex items-center">
            <img
              className="absolute"
              style={{ maxWidth: "60%", maxHeight: "60%" }}
              src={LogoMySMK}
              alt={LogoMySMK}
            />
          </div>

          <div className="col-span-6 xl:col-span-2 flex items-center justify-end space-x-5 h-full w-full relative">
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
                  className="w-4 h-4 pt-1 absolute z-10 top-0 right-0 bg-red-400 text-white rounded-full"
                >
                  {jumlah}
                </div>
              )}
            </button>
            <div className="xl:block hidden xl:h-12 xl:w-12 w-10 h-10 bg-green-200 rounded-full"></div>
            <div className="block xl:hidden xl:h-12 xl:w-12 w-10 h-10">
              <button
                className="mb-5"
                onClick={() => {
                  setSidebar(!sidebar);
                }}
              >
                <MdMenu className="w-10 h-10" />
              </button>
            </div>
          </div>
        </header>

        <main className="flex h-[92%] lg:h-11/12 xl:h-11/12 xl:h-full">
          <div
            className={`w-full h-full xl:rounded-r-3xl bg-[#46C7C7] text-white xl:bg-gray-50 pl-2 ${
              !sidebar
                ? "transform -translate-x-full -z-50 xl:-translate-x-0"
                : "transform -translate-x-0 z-10 transition duration-500"
            } h-full fixed top-0 bottom-0 xl:w-[200px] xl:relative xl:flex xl:flex-col`}
          >
            <div className="hidden xl:block mb-8 mt-4 pl-3">
              <img className="w-[65%]" src={LogoMySMK} alt={LogoMySMK} />
            </div>

            <div className="flex-1">
              <SidebarPpdb setSidebar={setSidebar} />
            </div>

            <div className="mt-5 mb-4 ml-2 group inline-block">
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
          </div>

          <div
            className={`content relative h-full w-full overflow-auto xl:overflow-hidden ${
              showNotif ? "xl:w-[100%]" : "xl:w-[100%]"
            }`}
          >
            <div id="sidebar" className="h-full w-full">
              {/* <Outlet data={data} /> */}
              <Outlet />
            </div>
          </div>
        </main>
      </div>
    </>
  );
}

function LogoutButton({ to, title, logo, onClick }) {
  let { pathname } = useLocation();
  let url = pathname.split("/")[2];

  return (
    <button onClick={onClick} className="flex items-center font-extrabold">
      <div>{logo}</div>
      <p
        className={`font-extrabold ml-2 text-xs text-gray-900 font-poppins text-left ${
          url === to ? "text-white-400" : "text-gray-600"
        } font-bold group-hover:text-[#18a558]`}
      >
        {title}
      </p>
    </button>
  );
}
