import React from "react";
import { NavLink, NLink, Outlet } from "react-router-dom";
import { useQuery } from "react-query";
import { authme } from "../api/auth";
import jwt_decode from "jwt-decode";
import Notifikasi from "../module/notifikasi";
import { formatTahun } from "../utils";

export default function Guru() {
  let date = new Date();
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

  console.log(data);
  return (
    <div className="h-screen">
      <h1>Welcome to the ustadz {data?.name}!</h1>
      <div className="grid grid-cols-12 gap-x-2 h-full">
        <div className="col-span-1">
          {" "}
          <nav className="flex flex-col">
            <NavLink to="dashboard">Dashboard</NavLink>
            <NavLink to="jadwal">Jadwal KBM</NavLink>
            <NavLink to={`halaqoh/${formatTahun(date)}`}>Halaqoh</NavLink>
          </nav>
        </div>
        <div className="content col-span-9 overflow-auto">
          <Outlet data={data} />
        </div>
        <div className="content col-span-2">
          <Notifikasi />
        </div>
      </div>
    </div>
  );
}
