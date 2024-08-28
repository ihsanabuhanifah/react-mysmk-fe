import React, { useState } from "react";
import LayoutPpdb from "../../../module/layoutPpdb";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import {
  IoChevronForwardOutline,
  IoPencilOutline,
  IoShieldOutline,
  IoMenu,
} from "react-icons/io5";

export default function BiodataPpdb() {
  let { pathname } = useLocation();
  const navigate = useNavigate();
  const [isSidebarVisible, setIsSidebarVisible] = useState(false);

  React.useEffect(() => {
    if (pathname === "/ppdb/biodata") {
      navigate("/ppdb/biodata/update");
    }
  }, [pathname, navigate]);

  return (
    <LayoutPpdb title="Biodata Calon santri">
      <div className="flex h-full w-full">
        {/* Sidebar */}
        <div
          className={`${
            isSidebarVisible ? 'block' : 'hidden'
          } sm:flex flex-col bg-white border-r border-black/5 h-full w-[185px] ml-2`}
        >
          <ButtonLink
            title="Edit Profile"
            logo={
              <IoPencilOutline
                size={22}
                className={`${
                  pathname === "/ppdb/biodata/update"
                    ? "text-[#18a558]"
                    : "text-gray-400"
                }`}
              />
            }
            to="/ppdb/biodata/update"
          />
          <ButtonLink
            title="Berkas Profile"
            logo={
              <IoShieldOutline
                size={22}
                className={`${
                  pathname === "/ppdb/biodata/berkas"
                    ? "text-[#18a558]"
                    : "text-gray-400"
                }`}
              />
            }
            to="/ppdb/biodata/berkas"
          />
        </div>

        {/* Content Area */}
        <div className="flex-1 h-full bg-white">
          <Outlet />
        </div>

        {/* Toggle Button */}
        <button
          className="sm:hidden fixed bottom-4 right-4 bg-blue-500 text-white px-4 py-2 rounded"
          onClick={() => setIsSidebarVisible(!isSidebarVisible)}
        >
          <IoMenu size={24} />
        </button>
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
