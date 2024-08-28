import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { MdClose, MdLaptopMac } from "react-icons/md";
import { IoCheckmarkDoneOutline, IoPerson, IoStatsChart } from "react-icons/io5";
import LogoMySMK from "../../image/MySMK.png";
import { FaNewspaper } from "react-icons/fa";
import { IoNewspaperOutline } from "react-icons/io5";
export default function SidebarSiswa({ setSidebar }) {
  let date = new Date();
  const santriProfile = useSelector((state) => state.data.profile);

  const handleSiderbar = () => {
    setSidebar(false);
  };

  let { pathname } = useLocation();
  let url = pathname.split("/")[2];

  return (
    <>
      {/* tablet */}
      <div className="xl:hidden flex shadow-lg border-b-2 items-center justify-between h-20  w-full px-5 relative overflow-y-auto ">
        <div className="h-24 w-24  flex-col mt-12 items-center">
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

      {/* laptop */}
      <div className="flex mb-3 items-center bg-[#18a558] mr-2 gap-x-2 rounded-lg p-2">
        <div className="w-10 h-10 rounded-full bg-gray-200"></div>

        <div>
          <p className="m-0 text-sm text-white/80 leading-none">Hello</p>
          <p className="mt-1 text-md text-white font-black leading-none">
            {santriProfile?.nama_siswa?.split(" ")[0]}
          </p>
        </div>
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
            <IoStatsChart
              className={`h-6 w-6 ${
                url === "dashboard" ? "text-[#18a558]" : "text-gray-400"
              }`}
            />
          }
        />
        <NavButton
          handleSidebar={handleSiderbar}
          to="profile"
          path="profile"
          title={"Profile"}
          logo={
            <IoPerson
              className={`h-6 w-6 ${
                url === "profile" ? "text-[#18a558]" : "text-gray-400"
              }`}
            />
          }
        />
		  <NavButton
          handleSidebar={handleSiderbar}
          to="ujian"
          path="ujian"
          title={"Exam"}
          logo={
            <MdLaptopMac
              className={`h-6 w-6 ${
                url === "ujian" ? "text-[#18a558]" : "text-gray-400"
              }`}
            />
          }
        />
		  <NavButton
          handleSidebar={handleSiderbar}
          to="hasil-belajar"
          path="hasil-belajar"
          title={"Hasil Belajar"}
          logo={
            <IoCheckmarkDoneOutline
              className={`h-6 w-6 ${
                url === "hasil-belajar" ? "text-[#18a558]" : "text-gray-400"
              }`}
            />
          }
        />
		  <NavButton
          handleSidebar={handleSiderbar}
          to="laporan-pkl"
          path="laporan-pkl"
          title={"Laporan Pkl"}
          logo={
            <IoNewspaperOutline
              className={`h-6 w-6 ${
                url === "laporan-pkl" ? "text-[#18a558]" : "text-gray-400"
              }`}
            />
          }
        />
      </nav>
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
      className={`flex justify-between group pl-2 items-center h-10`}
    >
      <div className="flex items-center">
        <div>{logo}</div>
        <p
          className={`ml-3 text-xs whitespace-nowrap font-poppins text-left 
       ${
         url === path
           ? "text-[#18a558] font-black text-[0.85rem]"
           : "text-gray-400"
       } group-hover:text-gray-600 group-hover:font-black
         `}
        >
          {title}
        </p>
      </div>
      {url === path && (
        <div className="h-full w-1 bg-[#18a558] rounded-l-md"></div>
      )}
    </button>
  );
}