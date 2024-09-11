import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { MdClose, MdLaptopMac } from "react-icons/md";
import {
  IoCheckmarkDoneOutline,
  IoDocumentTextOutline,
  IoLogOutOutline,
  IoPerson,
  IoStatsChart,
} from "react-icons/io5";
import LogoMySMK from "../../image/MySMK.png";
import { IoNewspaperOutline } from "react-icons/io5";
import ImageWithFallback from "../../components/ImageWithFallback";
import { useZUStore } from "../../zustand/zustore";
import { LogoutButton } from "../siswa";

export default function SidebarSiswa({ setSidebar }) {
  let date = new Date();
  const { profile } = useZUStore((state) => state);

  const handleSiderbar = () => {
    setSidebar(false);
  };

  let { pathname } = useLocation();
  let url = pathname.split("/")[2];

  return (
    <>
      {/* tablet */}
      <div className="relative mb-2 flex h-20 w-full items-center justify-between px-1 xl:hidden">
        <div className="mt-12 h-24 w-24 flex-col items-center">
          <img
            className="absolute"
            style={{ maxWidth: "60%", maxHeight: "60%" }}
            src={LogoMySMK}
            alt={LogoMySMK}
          />
        </div>

        <button className="text-gray-700" onClick={handleSiderbar}>
          <MdClose className="h-10 w-10" />
        </button>
      </div>

      {/* laptop */}
      <div className="mb-3 mr-2 flex items-center gap-x-2 rounded-lg bg-[#18a558] p-2">
        <div className="h-10 w-10 rounded-full bg-gray-200">
          <ImageWithFallback
            src={profile.user.image}
            alt="You"
            fallbackSrc="/blankprofile.jpg"
          />
        </div>

        <div>
          <p className="m-0 text-sm leading-none text-white/80">Hello</p>
          <p className="text-md mt-1 font-black leading-none text-white">
            {profile?.nama_siswa?.split(" ")[0]}
          </p>
        </div>
      </div>

      <nav
        id="scrollbar"
        className="flex h-[80%] flex-col space-y-2 overflow-auto p-0 pb-12 pt-5 xl:p-0"
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
          title={"Ujian"}
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
          to="hasil-ujian"
          path="hasil-ujian"
          title={"Hasil Ujian"}
          logo={
            <IoCheckmarkDoneOutline
              className={`h-6 w-6 ${
                url === "hasil-ujian" ? "text-[#18a558]" : "text-gray-400"
              }`}
            />
          }
        />
        <NavButton
          handleSidebar={handleSiderbar}
          to="rapor"
          path="rapor"
          title={"Rapor"}
          logo={
            <IoDocumentTextOutline
              className={`h-6 w-6 ${
                url === "rapor" ? "text-[#18a558]" : "text-gray-400"
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
      <div className="mb-4 ml-2 mt-5 block xl:hidden">
        <LogoutButton
          onClick={() => {
            return setSidebar(true);
          }}
          title={"Logout"}
          logo={
            <IoLogOutOutline
              className={`h-6 w-6 text-gray-700 group-hover:text-[#18a558]`}
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
      className={`group flex h-10 items-center justify-between pl-2`}
    >
      <div className="flex items-center">
        <div>{logo}</div>
        <p
          className={`ml-3 whitespace-nowrap text-left font-poppins text-xs ${
            url === path
              ? "text-[0.85rem] font-black text-[#18a558]"
              : "text-gray-400"
          } group-hover:font-black group-hover:text-gray-600`}
        >
          {title}
        </p>
      </div>
      {url === path && (
        <div className="h-full w-1 rounded-l-md bg-[#18a558]"></div>
      )}
    </button>
  );
}
