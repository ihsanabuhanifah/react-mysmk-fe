import React, { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import { MdAssignment, MdClose, MdLaptopMac } from "react-icons/md";
import { IoPerson, IoStatsChart } from "react-icons/io5";
import LogoMySMK from "../../image/MySMK.png";
import ProfileImage from "../../image/ppdb/profile.png";
import {
  getProfileCalonSantri,
  useProfileCalonSantri,
} from "../../api/ppdb/profile"; // Pastikan import dari path yang benar
import { setProfile } from "../../redux/actions"; // Pastikan import dari path yang benar
import { HiUpload } from "react-icons/hi";

export default function SidebarPpdb({ setSidebar }) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const dispatch = useDispatch();
  // const CalonSantriProfile = useSelector((state) => state.data.CalonSantriProfile);
  const { profileData } = useProfileCalonSantri();

  let { pathname } = useLocation();
  let url = pathname.split("/")[2];

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

  const handleSiderbar = () => {
    setSidebar(false);
  };

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
        <div className="w-10 h-10 rounded-full bg-gray-200">
          <img
            className="w-10 h-10 rounded-full bg-gray-100"
            src={profileData?.profilePicture || ProfileImage}
            alt="Profile"
          />
        </div>

        <div>
          <p className="m-0 text-sm text-white/80 leading-none">Hello</p>
          <p className="mt-1 text-md text-white font-black leading-none">
            {profileData?.nama_siswa?.split(" ")[0]}
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
          to="biodata"
          path="biodata"
          title={"Biodata"}
          logo={
            <IoPerson
              className={`h-6 w-6 ${
                url === "biodata" ? "text-[#18a558]" : "text-gray-400"
              }`}
            />
          }
        />
        <NavButton
          handleSidebar={handleSiderbar}
          to="transfer"
          path="transfer"
          title={"Biaya Pendaftaran"}
          logo={
            <HiUpload
              className={`h-6 w-6 ${
                url === "transfer" ? "text-[#18a558]" : "text-gray-400"
              }`}
            />
          }
        />
        <NavButton
          handleSidebar={handleSiderbar}
          to="exam"
          path="exam"
          title={"Ujian"}
          logo={
            <MdAssignment
              className={`h-6 w-6 ${url === "exam" ? "text-[#18a558]" : "text-gray-400"}`}
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
