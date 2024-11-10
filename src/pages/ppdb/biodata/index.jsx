import React, { useState, useEffect } from "react";
import LayoutPpdb from "../../../module/layoutPpdb";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import {
  IoChevronForwardOutline,
} from "react-icons/io5";

export default function BiodataPpdb() {
  let { pathname } = useLocation();
  const navigate = useNavigate();
  const [isSidebarVisible, setIsSidebarVisible] = useState(false);
  const [isButtonVisible, setIsButtonVisible] = useState(true); // State untuk visibilitas button

  React.useEffect(() => {
    if (pathname === "/ppdb/biodata") {
      navigate("/ppdb/biodata/update");
    }
  }, [pathname, navigate]);

  // Menambahkan event listener untuk scroll
  useEffect(() => {
    const handleScroll = () => {
      // Sembunyikan tombol jika halaman discroll lebih dari 100px
      if (window.scrollY > 100) {
        setIsButtonVisible(false);
      } else {
        setIsButtonVisible(true);
      }
    };

    window.addEventListener("scroll", handleScroll);

    // Cleanup event listener saat komponen di-unmount
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <LayoutPpdb title="Biodata Calon santri">
      <div className="flex h-full w-full">
        {/* Content Area */}
        <div className="flex-1 h-full bg-white">
          <Outlet />
        </div>
      </div>
    </LayoutPpdb>
  );
}

function ButtonLink({ logo, to, title }) {
  let { pathname } = useLocation();
  const navigate = useNavigate();

  return (
    <button
      onClick={() => {
        return navigate(to);
      }}
      className="flex items-center h-[35px] gap-5 mt-5 pr-2 border-b border-black/5 pb-2"
    >
      <div className="flex flex-1 items-center gap-3">
        <div className="w-[30px]">{logo}</div>
        <p
          className={`font-poppins text-left text-xs ${
            pathname === to
              ? "font-black text-[0.80rem] text-[#18a558]"
              : "text-gray-400"
          }`}
        >
          {title}
        </p>
      </div>
      <div className="w-[20px] h-full flex items-center justify-end">
        {pathname === to && (
          <IoChevronForwardOutline className="text-[#18a558]" />
        )}
      </div>
    </button>
  );
}
