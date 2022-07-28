import React from "react";

import { useLocation, useNavigate } from "react-router-dom";

import { formatTahun } from "../../utils";
import {
  MdClose,
  MdOutlineDashboard,
  MdOutlineCalendarToday,
  MdOutlineLibraryBooks,
  MdLogout,
} from "react-icons/md";
import { Image, Input, Button, Header, Icon, Modal } from "semantic-ui-react";
import LogoMySMK from "../../image/MySMK.png";
import SMKMQ from "../../image/MADINATULQURAN.png";
import useDelete from "../../hook/useDelete";
import Cookies from "js-cookie";
import { ModalLogout } from "../../components";

let date = new Date();
export default function SidebarGuru({ setSidebar }) {
  let date = new Date();

  const handleSiderbar = () => {
    setSidebar(false);
  };

  let { pathname } = useLocation();
  let url = pathname.split("/")[2];

  const [open, setOpen] = React.useState(false);

  return (
    <>
      <ModalLogout open={open} setOpen={setOpen} />

      <div className="lg:hidden block border-b-2 flex items-center justify-between h-12 w-full px-5 mt-5">
        <div className="h-24 w-24  flex-col mt-12 items-center">
          <Image src={LogoMySMK} />
          <Image src={SMKMQ} />
        </div>

        <button className="mb-5" onClick={handleSiderbar}>
          <MdClose className="w-10 h-10" />
        </button>
      </div>
      <nav className="flex flex-col space-y-5 p-5 lg:p-0">
        <NavButton
          handleSidebar={handleSiderbar}
          to="dashboard"
          title={["Dashboard"]}
          logo={
            <MdOutlineDashboard
              className={`h-8 w-8 ${
                url === "dashboard" ? "text-white-400" : "text-gray-600"
              }`}
            />
          }
        />
        <NavButton
          handleSidebar={handleSiderbar}
          to="jadwal"
          title={"Jadwal"}
          logo={
            <MdOutlineCalendarToday
              className={`h-8 w-8 ${
                url === "jadwal" ? "text-white-400" : "text-gray-600"
              }`}
            />
          }
        />
        <NavButton
          handleSidebar={handleSiderbar}
          to={`halaqoh/absensi/${formatTahun(date)}`}
          title={["Halaqoh"]}
          logo={
            <MdOutlineLibraryBooks
              className={`h-8 w-8 ${
                url === `halaqoh/absensi/${formatTahun(date)}`
                  ? "text-white-400"
                  : "text-gray-600"
              }`}
            />
          }
        />
        <NavButton
          handleSidebar={handleSiderbar}
          to="sholat"
          title={["Sholat"]}
          logo={
            <MdOutlineLibraryBooks
              className={`h-8 w-8 ${
                url === "sholat" ? "text-white-400" : "text-gray-600"
              }`}
            />
          }
        />
        {/* <NavButton to="mata pelajaran" title={"Mata Pelajaran"} logo={<LogoJadwal />} /> */}
        {/* <NavButton to="kelas" title={"Kelas"} logo={<LogoJadwal />} /> */}
        <NavButton
          handleSidebar={handleSiderbar}
          to="pelanggaran"
          title={"Pelanggaran"}
          logo={
            <MdOutlineLibraryBooks
              className={`h-8 w-8 ${
                url === "pelanggaran" ? "text-white-400" : "text-gray-600"
              }`}
            />
          }
        />
        <NavButton
          handleSidebar={handleSiderbar}
          to="prestasi"
          title={"Prestasi"}
          logo={
            <MdOutlineLibraryBooks
              className={`h-8 w-8 ${
                url === "prestasi" ? "text-white-400" : "text-gray-600"
              }`}
            />
          }
        />
        {/* <NavButton to="penilaian" title={"Penilaian"} logo={<LogoJadwal />} /> */}
        <NavButton
          handleSidebar={handleSiderbar}
          to="perizinan-pulang"
          title={"Perizinan Pulang"}
          logo={
            <MdOutlineLibraryBooks
              className={`h-8 w-8 ${
                url === "perizinan-pulang" ? "text-white-400" : "text-gray-600"
              }`}
            />
          }
        />
        <NavButton
          handleSidebar={handleSiderbar}
          to="perizinan-kunjungan"
          title={"Perizinan Kunjungan"}
          logo={
            <MdOutlineLibraryBooks
              className={`h-8 w-8 ${
                url === "perizinan-kunjungan"
                  ? "text-white-400"
                  : "text-gray-600"
              }`}
            />
          }
        />

        {/* <NavButton to="pengaturan" title={"Pengaturan"} logo={<LogoJadwal />} />
      <NavButton to="pengguna" title={"Pengguna"} logo={<LogoJadwal />} /> */}
      </nav>

      <div className="fixed bottom-0 ">
        <button
          className="mb-5 flex items-center px-5 lg:px-0 text-gray-700"
          onClick={() => {
            return setOpen(true);
          }}
        >
          <MdLogout className="w-10 h-10" />
          <div className="h-10 w-10 ml-2 mt-2 ">
            <button
              className={`ml-5 text-lg font-poppins 
           text-gray-600 
         font-bold `}
            >
              Logout
            </button>
          </div>
        </button>
      </div>
    </>
  );
}

function NavButton({ to, title, logo, handleSidebar }) {
  let { pathname } = useLocation();
  let url = pathname.split("/")[2];
  const navigate = useNavigate();

  return (
    <div className="flex items-center  ">
      <div className="w-8 h-8">{logo}</div>
      <button
        className={`ml-5 text-lg font-poppins ${
          url === to ? "text-white-400 " : "text-gray-600 "
        } font-bold hover:text-green-400`}
        onClick={() => {
          handleSidebar();
          return navigate(to);
        }}
      >
        {title}
      </button>
    </div>
  );
}
