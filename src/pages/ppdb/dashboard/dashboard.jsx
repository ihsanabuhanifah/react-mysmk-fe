import React from "react";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import Nav from "../../../components/Nav";

const DashboardPpdb = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    Cookies.remove("mysmk_token");
    navigate("/ppdb/login");
  };

  return (
    <>
    <Nav/>
      <main className="mt-24">
        <div>
          <h1>Dashboard PPDB</h1>
          <button onClick={handleLogout}>Logout</button>
          {/* Konten dashboard lainnya */}
        </div>
      </main>
    </>
  );
};

export default DashboardPpdb;
