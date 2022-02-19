import React from "react";
import { Link, Outlet } from "react-router-dom";
import { useQuery } from "react-query";
import { authme } from "../api/auth";
import jwt_decode from "jwt-decode";

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

  console.log(data);
  return (
    <div>
      <h1>Welcome to the ustadz {data?.name}!</h1>
      <nav>
        <Link to="dashboard">Invoices</Link> |{" "}
        <Link to="jadwal">Jadwal</Link>
        
      </nav>
      <div className="content">
        <Outlet data={data} />
      </div>
    </div>
  );
}
