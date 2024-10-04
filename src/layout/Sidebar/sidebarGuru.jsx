import React from "react";

import { useLocation, useNavigate } from "react-router-dom";

import { formatTahun } from "../../utils";
import {
  MdClose,
  MdOutlineDashboard,
  MdOutlineLibraryBooks,
  MdLogout,
  MdLaptopMac,
  MdPeople,
  MdOutlineSupervisorAccount,
  MdCheck,
  MdFormatAlignCenter,
  MdKeyboard,
  MdFingerprint,
  MdNavigation,
  MdPhoneForwarded,
  MdPhoneInTalk,
  MdCreate,
  MdLaptopChromebook,
} from "react-icons/md";
import { checkRole } from "../../utils";

import LogoMySMK from "../../image/MySMK.png";
import { ModalLogout } from "../../components";
import useList from "../../hook/useList";

export default function SidebarGuru({ setSidebar }) {
  let date = new Date();
  const { roles } = useList();

  const handleSiderbar = () => {
    setSidebar(false);
  };

  let { pathname } = useLocation();
  let url = pathname.split("/")[2];

  const [open, setOpen] = React.useState(false);

  

  return (
    <>
      <ModalLogout open={open} setOpen={setOpen} />

      <div className="xl:hidden flex shadow-lg border-b-2 items-center justify-between h-20  w-full px-5 relative overflow-y-auto ">
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
      <div className="h-16 w-12  bg-white hidden xl:flex mb-5 p-5">
        <img
          className="absolute"
          style={{ maxWidth: "50%", maxHeight: "50%" }}
          src={LogoMySMK}
          alt={LogoMySMK}
        />
      </div>
      <nav
        id="scrollbar"
        className="flex flex-col space-y-2 p-0  xl:p-0 h-[80%] pt-5 overflow-auto pb-12"
      >
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
          {checkRole(roles, "Guru") && (
          <NavButton
            handleSidebar={handleSiderbar}
            to="monitor/harian"
            path="monitor/harian"
            title={"Monitor KBM"}
            logo={
              <MdLaptopChromebook
                className={`h-8 w-8 ${
                  url === "monitor" ? "text-white-400" : "text-gray-600"
                }`}
              />
            }
          />
        )}
        <NavButton
          handleSidebar={handleSiderbar}
          to="daftar-siswa"
          path="daftar-siswa"
          title={"Daftar Kelas"}
          logo={
            <MdOutlineSupervisorAccount
              className={`h-8 w-8 ${
                url === "daftar-siswa" ? "text-white-400" : "text-gray-600"
              }`}
            />
          }
        />
        <NavButton
          handleSidebar={handleSiderbar}
          to={`halaqoh-siswa`}
          path={"halaqoh-siswa"}
          title={["Daftar Halaqoh"]}
          logo={
            <MdPeople
              className={`h-8 w-8 ${
                url === `halaqoh-siswa` ? "text-white-400" : "text-gray-600"
              }`}
            />
          }
        />
        <NavButton
          handleSidebar={handleSiderbar}
          to="kehadiran-guru"
          path="kehadiran-guru"
          title={["Absensi Guru"]}
          logo={
            <MdFingerprint
              className={`h-8 w-8 ${
                url === "kehadiran-guru" ? "text-white-400" : "text-gray-600"
              }`}
            />
          }
        />
        {checkRole(roles, "Guru") && (
          <NavButton
            handleSidebar={handleSiderbar}
            to="absensi"
            path="absensi"
            title={"Absensi KBM"}
            logo={
              <MdLaptopMac
                className={`h-8 w-8 ${
                  url === "absensi" ? "text-white-400" : "text-gray-600"
                }`}
              />
            }
          />
        )}
       

        <NavButton
          handleSidebar={handleSiderbar}
          to={`halaqoh/absensi/${formatTahun(date)}`}
          path={"halaqoh"}
          title={["Absensi Halaqoh"]}
          logo={
            <MdLaptopChromebook
              className={`h-8 w-8 ${
                url === `halaqoh` ? "text-white-400" : "text-gray-600"
              }`}
            />
          }
        />

        {checkRole(roles, "Guru") && (
          <NavButton
            handleSidebar={handleSiderbar}
            to={`pengampu/halaqoh/absensi`}
            path={"pengampu"}
            title={["Absensi Pengampu"]}
            logo={
              <MdCheck
                className={`h-8 w-8 ${
                  url === `pengampu` ? "text-white-400" : "text-gray-600"
                }`}
              />
            }
          />
        )}
        {checkRole(roles, "Guru") && (
          <NavButton
            handleSidebar={handleSiderbar}
            to={`bank-soal`}
            path={"bank-soal"}
            title={["Bank Soal"]}
            logo={
              <MdFormatAlignCenter
                className={`h-8 w-8 ${
                  url === `bank-soal` ? "text-white-400" : "text-gray-600"
                }`}
              />
            }
          />
        )}
        {checkRole(roles, "Guru") && (
          <NavButton
            handleSidebar={handleSiderbar}
            to={`exam`}
            path={"exam"}
            title={["Assesmen"]}
            logo={
              <MdKeyboard
                className={`h-8 w-8 ${
                  url === `exam` ? "text-white-400" : "text-gray-600"
                }`}
              />
            }
          />
        )}
         {checkRole(roles, "Guru") && (
          <NavButton
            handleSidebar={handleSiderbar}
            to={`hasil-belajar`}
            path={"hasil-belajar"}
            title={["Hasil Belajar"]}
            logo={
              <MdKeyboard
                className={`h-8 w-8 ${
                  url === `hasil-belajar` ? "text-white-400" : "text-gray-600"
                }`}
              />
            }
          />
        )}
        <NavButton
          handleSidebar={handleSiderbar}
          to="sholat"
          path={"sholat"}
          title={["Sholat"]}
          logo={
            <MdNavigation
              className={`h-8 w-8 ${
                url === "sholat" ? "text-white-400" : "text-gray-600"
              }`}
            />
          }
        />
        {/* <NavButton to="mata pelajaran" title={"Mata Pelajaran"} logo={<LogoJadwal />} /> */}
        {/* <NavButton to="kelas" title={"Kelas"} logo={<LogoJadwal />} /> */}
        {checkRole(roles, "Guru") && (
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
        )}
        {checkRole(roles, "Guru") && (
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
        )}
        {/* <NavButton to="penilaian" title={"Penilaian"} logo={<LogoJadwal />} /> */}
        {checkRole(roles, "Guru") && (
          <NavButton
            handleSidebar={handleSiderbar}
            to="perizinan-pulang"
            path="perizinan-pulang"
            title={"Perizinan Pulang"}
            logo={
              <MdPhoneForwarded
                className={`h-8 w-8 ${
                  url === "perizinan-pulang"
                    ? "text-white-400"
                    : "text-gray-600"
                }`}
              />
            }
          />
        )}
        {checkRole(roles, "Guru") && (
          <NavButton
            handleSidebar={handleSiderbar}
            to="perizinan-kunjungan"
            path="perizinan-kunjungan"
            title={"Perizinan Kunjungan"}
            logo={
              <MdPhoneInTalk
                className={`h-8 w-8 ${
                  url === "perizinan-kunjungan"
                    ? "text-white-400"
                    : "text-gray-600"
                }`}
              />
            }
          />
        )}
        {checkRole(roles, "Guru") && (
          <NavButton
            handleSidebar={handleSiderbar}
            to="laporan-guru-piket"
            path="laporan-guru-piket"
            title={"Laporan Guru Piket"}
            logo={
              <MdCreate
                className={`h-8 w-8 ${
                  url === "laporan-guru-piket"
                    ? "text-white-400"
                    : "text-gray-600"
                }`}
              />
            }
          />
        )}

        {/* <NavButton to="pengaturan" title={"Pengaturan"} logo={<LogoJadwal />} />
      <NavButton to="pengguna" title={"Pengguna"} logo={<LogoJadwal />} /> */}
      </nav>
      <div className="h-[10%] pl-3 pt-5">
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
      <div style={{
        zomm : '80%'
      }} className="w-8 h-8 ">{logo}</div>
      <p
        className={`ml-5 text-xs whitespace-nowrap font-poppins text-left 
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
    <button
      onClick={onClick}
      className="flex items-center font-extrabold  h-10  pl-2 "
    >
      <div className="w-8 h-8 ">{logo}</div>
      <p
        className={`font-extrabold ml-5 text-xs  font-poppins text-left ${
          url === to ? "text-white-400 " : "text-gray-600 "
        } font-bold hover:text-green-400`}
      >
        {title}
      </p>
    </button>
  );
}
