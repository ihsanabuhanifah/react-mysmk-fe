import React from "react";
import LayoutSiswa from "../../../module/layoutSiswa";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import {
  IoChevronForwardOutline,
  IoPencilOutline,
  IoShieldOutline,
} from "react-icons/io5";

export default function Profile() {
  let { pathname } = useLocation();
  const navigate = useNavigate();

  React.useEffect(() => {
    if (pathname === "/siswa/profile") {
      navigate("/siswa/profile/edit");
    }
  });

  return (
    <LayoutSiswa title="My Profile">
      <div className="h-full w-full xl:flex">
        <div className="ml-2 hidden h-full w-[185px] flex-col overflow-y-auto bg-white pb-3 xl:flex">
          <ButtonLink
            title="Edit Profile"
            logo={
              <IoPencilOutline
                size={22}
                className={`${pathname === "/siswa/profile/edit" ? "text-[#18a558]" : "text-gray-400"}`}
              />
            }
            to="/siswa/profile/edit"
          />
          <ButtonLink
            title="Password & Security"
            logo={
              <IoShieldOutline
                size={22}
                className={`${pathname === "/siswa/profile/security" ? "text-[#18a558]" : "text-gray-400"}`}
              />
            }
            to="/siswa/profile/security"
          />
        </div>

        <div className="h-full xl:flex-1">
          <Outlet />
        </div>
      </div>
    </LayoutSiswa>
  );
}

function ButtonLink({ logo, to, title }) {
  let { pathname } = useLocation();
  const navigate = useNavigate();

  console.log(pathname);

  return (
    <button
      onClick={() => {
        return navigate(to);
      }}
      className="mt-5 flex h-[35px] items-center gap-5 border-b border-black/5 pb-2 pr-2"
    >
      <div className="flex flex-1 items-center gap-3">
        <div className="w-[30px]">{logo}</div>
        <p
          className={`text-left font-poppins text-xs ${pathname === to ? "text-[0.80rem] font-black text-[#18a558]" : "text-gray-400"}`}
        >
          {title}
        </p>
      </div>
      <div className="flex h-full w-[20px] items-center justify-end">
        {pathname === to && (
          <IoChevronForwardOutline className="text-[#18a558]" />
        )}
      </div>
    </button>
  );
}
