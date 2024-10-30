import React, { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import { MdAssignment, MdClose, MdLaptopMac } from "react-icons/md";
import {
  IoPerson,
  IoStatsChart,
  IoShieldOutline,
  IoPencilOutline,
  IoDocumentTextOutline,
} from "react-icons/io5";
import LogoMySMK from "../../image/MySMK.png";
import ImageWithFallback from "../../components/ImageWithFallback.js";
import {
  getProfileCalonSantri,
  useProfileCalonSantri,
} from "../../api/ppdb/profile"; // Ensure correct path
import { setProfile } from "../../redux/actions"; // Ensure correct path
import ProfileImage from "../../image/ppdb/profile.png";

export default function SidebarPpdb({ setSidebar }) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const dispatch = useDispatch();
  const { profileData } = useProfileCalonSantri();
  const [isSelect, setIsSelect] = useState(false);

  let { pathname } = useLocation();
  let url = pathname.split("/")[2];
  let url2 = pathname.split("/")[3];

  const handleSiderbar = () => {
    setSidebar(false);
  };

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        // Ganti dengan ID yang sesuai, misalnya dari state atau props
        const id = useParams;
        const response = await getProfileCalonSantri(id);
        dispatch(setProfile(response.data));
        setLoading(false);
      } catch (err) {
        setError(err);
        setLoading(false);
      }
    };

    fetchProfile();
  }, [dispatch]);

  return (
    <>
      {/* Tablet */}
      <div className="relative mb-2 flex h-20 w-full items-center justify-between px-1 xl:hidden">
        <div className="mt-12 h-24 w-24 flex-col items-center">
          <img
            className="absolute"
            style={{ maxWidth: "60%", maxHeight: "60%" }}
            src={LogoMySMK}
            alt="Logo My SMK"
          />
        </div>

        <button className="text-gray-700" onClick={handleSiderbar}>
          <MdClose className="h-10 w-10" />
        </button>
      </div>

      {/* Laptop */}
      <div className="mb-3 mr-2 flex items-center gap-x-2 rounded-lg bg-[#18a558] p-2">
        <div className="h-10 w-10 rounded-full bg-gray-200">
        <img
            className="w-10 h-10 rounded-full bg-gray-100"
            src={profileData?.profilePicture || ProfileImage}
            alt="Profile"
          />
        </div>

        <div>
          <p className="m-0 text-sm leading-none text-white/80">Hello</p>
          <p className="text-md mt-1 font-black leading-none text-white">
            {profileData?.nama_siswa?.split(" ")[0]}
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
          title={"Dashboard"}
          logo={
            <IoStatsChart
              className={
                url === "dashboard" ? "text-[#18a558]" : "text-gray-400"
              }
            />
          }
        />
        <NavButton
          isSelect={isSelect}
          setIsSelect={setIsSelect}
          handleSidebar={handleSiderbar}
          to="biodata"
          path="biodata"
          title={"biodata"}
          logo={
            <IoPerson
              className={
                url === "biodata" || isSelect
                  ? "text-[#18a558]"
                  : "text-gray-400"
              }
            />
          }
        />
        {isSelect && (
          <div className="ml-5 border-l border-gray-400 pl-3 xl:hidden">
            <NavButton
              handleSidebar={handleSiderbar}
              to="profile/edit"
              path="edit"
              title={"Edit Profile"}
              logo={
                <IoPencilOutline
                  className={
                    url2 === "edit" ? "text-[#18a558]" : "text-gray-400"
                  }
                />
              }
            />
            <NavButton
              handleSidebar={handleSiderbar}
              to="profile/security"
              path="security"
              title={"Password & Security"}
              logo={
                <IoShieldOutline
                  className={
                    url2 === "security" ? "text-[#18a558]" : "text-gray-400"
                  }
                />
              }
            />
          </div>
        )}
        <NavButton
          handleSidebar={handleSiderbar}
          to="bukti-transfer"
          path="bukti-transfer"
          title={"Bukti Transfer"}
          logo={
            <MdLaptopMac
              className={
                url === "bukti-transfer" ? "text-[#18a558]" : "text-gray-400"
              }
            />
          }
        />
        <NavButton
          handleSidebar={handleSiderbar}
          to="exam"
          path="exam"
          title={"Ujian"}
          logo={
            <IoDocumentTextOutline
              className={url === "exam" ? "text-[#18a558]" : "text-gray-400"}
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
      className="flex justify-between group pl-2 items-center h-10"
    >
      <div className="flex items-center">
        <div>{logo}</div>
        <p
          className={`ml-3 text-xs whitespace-nowrap font-poppins text-left ${
            url === path
              ? "text-[#18a558] font-black text-[0.85rem]"
              : "text-gray-400"
          } group-hover:text-gray-600 group-hover:font-black`}
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
