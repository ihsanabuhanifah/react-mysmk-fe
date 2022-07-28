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

  console.log(sidebar);

  return (
    <div className="h-screen antialiased text-gray-700 border ">
      <header className="h-1/12 w-full pt-5 grid grid-cols-10 gap-x-5 border  ">
        <div className="h-24 w-36 mt-2 col-span-4 lg:col-span-2 pl-5 lg:pl-10 ">
          <Image src={LogoMySMK} />
          <Image src={SMKMQ} />
        </div>
        <div className="rounded-xl hidden lg:block lg:col-span-6 ">
          <div className="hidden lg:block">
            <Input
              classN
              fluid
              loading={false}
              icon="search"
              iconPosition="left"
              placeholder="Search..."
            />
          </div>
        </div>
        <div className=" col-span-6 lg:col-span-2 flex justify-end space-x-5 pr-5 lg:pr-10 ">
          <div className="border-2 lg:h-12 lg:w-12 w-10 h-10 rounded-full p-2">
            <img
              onClick={() => {
                setNotif(!notif);
              }}
              className="w-5 h-5"
              src={LogoNotif}
              alt=""
            /> 
          </div>
          <div className="lg:block hidden lg:h-12 lg:w-12 border bg-green-200 rounded-full"></div>
          <div className="block lg:hidden">
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
      <main className="flex gap-x-2 h-9/12 lg:h-full   ">
        <div
          className={` w-full h-full  bg-[#46C7C7] text-white lg:text-gray-700 lg:bg-white  border-r-2 pl-0 lg:pl-10 pt-5   ${
            !sidebar
              ? "transform -translate-y-full   lg:-translate-y-0"
              : "transform -translate-y-0 transition  duration-500 "
          } h-full z-10 fixed top-0 bottom-0 lg:w-[15%]  lg:relative  `}
        >
          <SidebarGuru setSidebar={setSidebar} />
        </div>
        <div className="content  overflow-auto h-full w-full lg:w-[65%] ">
          <Outlet data={data} />
        </div>
        <div
          className={` w-full h-full   bg-[#46C7C7] text-white lg:text-gray-700 lg:bg-white  border-r-2 pl-0 lg:pl-10 pt-5   ${
            !notif
              ? "transform -translate-y-full   lg:-translate-y-0"
              : "transform -translate-y-0 transition  duration-500 "
          } h-full z-10 fixed top-0 bottom-0 lg:w-[20%]  lg:relative  `}
        >
          <Notifikasi setNotif={setNotif} />
        </div>
      </main>
    </div>
  );
}

// className={`w-full h-full flex  h-full z-10 fixed top-0 bottom-0 lg:w-3/12  lg:relative text-white`}
