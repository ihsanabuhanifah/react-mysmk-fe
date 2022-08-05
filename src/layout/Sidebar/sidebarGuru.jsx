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

import LogoMySMK from "../../image/MySMK.png";
import { ModalLogout } from "../../components";

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

      <div className="xl:hidden flex border-b-2 items-center justify-between h-20  w-full px-5 relative ">
        <div className="h-24 w-24   flex-col mt-12 items-center">
          <img
            className="absolute"
            style={{ maxWidth: "60%", maxHeight: "60%" }}
            src={LogoMySMK}
            alt={LogoMySMK}
          />
        </div>

        <button className="" onClick={handleSiderbar}>
          <MdClose className="w-10 h-10" />
        </button>
      </div>
      <nav className="flex flex-col space-y-2 p-0  xl:p-0">
        <div className="h-12 w-12  hidden xl:flex mb-10 p-5">
          <img
            className="absolute"
            style={{ maxWidth: "50%", maxHeight: "50%" }}
            src={LogoMySMK}
            alt={LogoMySMK}
          />
        </div>
        <NavButton
          handleSidebar={handleSiderbar}
          to="dashboard"
          path="dashboard"
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
          path="jadwal"
          title={"Jadwal dan Rekap"}
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
          path={"halaqoh"}
          title={["Halaqoh"]}
          logo={
            <MdOutlineLibraryBooks
              className={`h-8 w-8 ${
                url === `halaqoh`
                  ? "text-white-400"
                  : "text-gray-600"
              }`}
            />
          }
        />
        <NavButton
          handleSidebar={handleSiderbar}
          to="sholat"
          path={"sholat"}
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
          path="pelanggaran"
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
          path="prestasi"
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
          path="perizinan-pulang"
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
          path="perizinan-kunjungan"
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
        <NavButton
          handleSidebar={handleSiderbar}
          to="laporan-guru-piket"
          path="laporan-guru-piket"
          title={"Laporan Guru Piket"}
          logo={
            <MdOutlineLibraryBooks
              className={`h-8 w-8 ${
                url === "laporan-guru-piket"
                  ? "text-white-400"
                  : "text-gray-600"
              }`}
            />
          }
        />

        {/* <NavButton to="pengaturan" title={"Pengaturan"} logo={<LogoJadwal />} />
      <NavButton to="pengguna" title={"Pengguna"} logo={<LogoJadwal />} /> */}
      </nav>

      <div className="fixed bottom-0 left-5 p-5">
        <LogoutButton
          onClick={() => {
            return setOpen(true);
          }}
          title={"Logout"}
          logo={
            <MdLogout
              className={`h-8 w-8 ${
                url === "laporan-guru-piket"
                  ? "text-white-400"
                  : "text-gray-600"
              }`}
            />
          }
        />
      </div>
    </>
  );
}

function NavButton({ to, path, title, logo, handleSidebar }) {
  let { pathname } = useLocation();
  let url = pathname.split("/")[2];
  const navigate = useNavigate();

  return (
    <button
      onClick={() => {
        handleSidebar();
        return navigate(to);
      }}
      className={`flex items-center px-5  h-10 ${
        url === path
          ? "bg-[#00b5ad] rounded-lg text-white font-black"
          : "text-black"
      }`}
    >
      <div className="w-8 h-8 ">{logo}</div>
      <p
        className={`ml-5 text-sm xl:text-md 2xl:text-md font-extrabold font-poppins text-left 
       ${url === path ? "text-white font-black" : "text-black"}
         `}
      >
        {title}
      </p>
    </button>
  );
}

function LogoutButton({ to, title, logo, onClick }) {
  let { pathname } = useLocation();
  let url = pathname.split("/")[2];

  return (
    <button onClick={onClick} className="flex items-center  h-10  pl-2 ">
      <div className="w-8 h-8 ">{logo}</div>
      <p
        className={`ml-5 text-sm xl:text-md 2xl:text-md font-poppins text-left ${
          url === to ? "text-white-400 " : "text-gray-600 "
        } font-bold hover:text-green-400`}
      >
        {title}
      </p>
    </button>
  );
}
