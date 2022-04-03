import React from "react";
import { NavLink, NLink, Outlet } from "react-router-dom";
import { useQuery } from "react-query";
import { authme } from "../api/auth";
import jwt_decode from "jwt-decode";
import Notifikasi from "../module/notifikasi";
import { formatTahun } from "../utils";
import LogoMySMK from "../image/MySMK.png";
import SMKMQ from "../image/MADINATULQURAN.png";
import LogoNotif from "../image/notifikasi.png";
import { Image, Input } from "semantic-ui-react";
import SidebarGuru from "./Sidebar/sidebarGuru";
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

  return (
    <div className="h-screen antialiased text-gray-700 border">
      <header className="h-1/12 w-full pt-5 grid grid-cols-10 gap-x-5 border px-10 " >
        <div className="h-24 w-24 col-span-2 ">
          <Image src={LogoMySMK} />
          <Image src={SMKMQ} />
        </div>
        <div className="rounded-xl col-span-6 ">
          <Input
            classN
            fluid
            loading={false}
            icon="search"
            iconPosition="left"
            placeholder="Search..."
          />
        </div>
        <div className="col-span-2">
          <div className="border-2 h-10 w-10 rounded-full p-2">
            <img className="w-5 h-5" src={LogoNotif} alt="" />
          </div>
        </div>
      </header>
      <main className="grid grid-cols-12 gap-x-2 h-9/12  ">
        <div className="col-span-2 border-r-2 pl-10 pt-5 h-full">
          <SidebarGuru />
        </div>
        <div className="content col-span-8 overflow-auto h-full ">
          <Outlet data={data} />
        </div>
        <div className="content col-span-2 pr-5 h-full ">
          <Notifikasi />
       
        </div>
      </main>
    </div>
  );
}
 