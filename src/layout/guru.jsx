import React from "react";
import { Outlet } from "react-router-dom";
import { useQuery } from "react-query";
import { authme } from "../api/auth";
import jwt_decode from "jwt-decode";
import Notifikasi from "../module/notifikasi";
import LogoMySMK from "../image/MySMK.png";
import SMKMQ from "../image/MADINATULQURAN.png";
import LogoNotif from "../image/notifikasi.png";
import { Image, Input } from "semantic-ui-react";
import SidebarGuru from "./Sidebar/sidebarGuru";
import { MdMenu } from "react-icons/md";
import useShowNotif from "../hook/useShowNotif";
import { IoIosNotifications } from "react-icons/io";
export default function Guru() {
  React.useEffect(() => {
    document.title = "Guru";
  });

  let { data } = useQuery(
    //query key
    ["authme"],
    //axios function,triggered when page/pageSize change
    () => authme(),
    //configuration
    {
      staleTime: 60 * 1000 * 60 * 12, // 12 jam,
      select: (response) => {
        const data = response?.data?.token;

        let decoded = jwt_decode(data);
        return decoded;
      },
    }
  );

  const [sidebar, setSidebar] = React.useState(false);
  const [notif, setNotif] = React.useState(false);
  let [showNotif, setShowNotf] = useShowNotif();

  
  return (
    <div className="h-screen antialiased text-gray-700 border ">
      <header className="h-[8%] block  xl:hidden  lg:h-1/12 xl:h-1/12 w-full flex items-center grid grid-cols-10 gap-x-5 border  ">
        <div className=" col-span-4 xl:col-span-2 pl-5 lg:pl-2  xl:pl-5 2xl:pl-10  h-full w-full   relative flex items-center">
          <img
            className="absolute"
            style={{ maxWidth: "60%", maxHeight: "60%" }}
            src={LogoMySMK}
            alt={LogoMySMK}
          />
        </div>

        <div className=" col-span-6 xl:col-span-2 flex items-center justify-end space-x-5 pr-5 xl:pr-10  h-full w-full ">
          <div className="border-2 xl:h-12 xl:w-12 w-10 h-10 rounded-full p-2">
            <img
              onClick={() => {
                setNotif(!notif);
              }}
              className="w-5 h-5"
              src={LogoNotif}
              alt=""
            />
          </div>
          <div className="xl:block hidden xl:h-12 xl:w-12 w-10 h-10 border bg-green-200 rounded-full"></div>
          <div className="block xl:hidden  xl:h-12 xl:w-12 w-10 h-10 ">
            <button
              className="mb-5 "
              onClick={() => {
                setSidebar(!sidebar);
              }}
            >
              <MdMenu className="w-10 h-10" />
            </button>
          </div>
        </div>
      </header>
      <main className="flex  h-[92%] lg:h-11/12 xl:h-11/12 xl:h-full      ">
        <div
          className={` w-full h-full   bg-[#46C7C7] text-white xl:text-gray-700 xl:bg-white  border-r-2 px-2  ${
            !sidebar
              ? "transform -translate-y-full   xl:-translate-y-0"
              : "transform -translate-y-0 transition  duration-500 "
          } h-full z-10 fixed top-0 bottom-0 xl:w-[15%]  xl:relative  `}
        >
          <SidebarGuru setSidebar={setSidebar} />
        </div>
        <div
          className={`content relative  h-full w-full pl-0 xl:pl-5   overflow-auto xl:overflow-hidden ${
            showNotif ? "xl:w-[85%]" : "xl:w-[85%]"
          }`}
        >
          <div >
            <button
              onClick={() => {
               
                return setShowNotf(!showNotif);
              }}
              className={`border rounded-full p-2 hidden xl:block absolute  right-5 top-5 z-50 ${
                showNotif ? "bg-red-400" : ""
              }`}
            >
              <IoIosNotifications
                className={`h-6 w-6 ${showNotif ? "text-white" : ""}`}
              />
            </button>
          </div>
       <div className="h-full w-full">
       <Outlet data={data} />
       </div>
        </div>
        <div
          className={` w-full h-full   bg-[#46C7C7] text-white xl:text-gray-700 xl:bg-white  border-r-2 pl-0 xl:pl-2      ${
            !notif
              ? "transform -translate-y-full   xl:-translate-y-0"
              : "transform -translate-y-0 transition  duration-500 "
          } h-full z-10 fixed top-0 bottom-0 ${
            !showNotif ? "xl:w-[20%]" : "xl:hidden"
          } xl:relative  `}
        >
          <Notifikasi setNotif={setNotif} />
        </div>
      </main>
    </div>
  );
}

// className={`w-full h-full flex z-10 fixed top-0 bottom-0 xl:w-3/12  xl:relative text-white`}
