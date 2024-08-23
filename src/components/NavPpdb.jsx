/* eslint-disable jsx-a11y/img-redundant-alt */
import React, { useState } from "react";
import LogoPpdb from "../../src/image/ppdb/ppdbwhite.png";
import Profile from "../image/ppdb/profile.png";

const NavPpdb = () => {
  let Links = [
    { name: "Home", link: "/" },
    { name: "Program", link: "/" },
    { name: "Persyaratan", link: "/" },
    { name: "Biaya", link: "/" },
    { name: "Agenda PSB", link: "/" },
    { name: "Kontak", link: "/" },
  ];
  let [open, setOpen] = useState(false);

  return (
    <div className="shadow-md w-full fixed top-0 left-0 z-50"> {/* Ubah fixed menjadi static */}
      <div className="md:flex items-center justify-between bg-customGreen py-4 md:px-10 px-7">
        <img src={LogoPpdb} alt="Logo PPDB" />

        <div
          onClick={() => setOpen(!open)}
          className="text-3xl absolute right-8 top-6 cursor-pointer md:hidden"
        >
          <ion-icon name={open ? "close" : "menu"}></ion-icon>
        </div>

        <ul
          className={`md:flex md:items-center md:pb-0 pb-12 absolute md:static bg-customGreen md:z-auto z-[-1] left-0 w-full md:w-auto md:pl-0 pl-9 transition-all duration-500 ease-in ${
            open ? "top-20 " : "top-[-490px]"
          }`}
        >
          {Links.map((link) => (
            <li key={link.name} className="md:ml-8 text-xl md:my-0 my-7">
              <a
                href={link.link}
                className="text-gray-800 hover:text-white duration-500"
              >
                {link.name}
              </a>
            </li>
          ))}
          <li className="md:ml-8 mt-5 md:mt-0">
            <img
              src={Profile} // Path ke gambar profil
              alt="Profile Image"
              className="rounded-full h-10 w-10 object-cover cursor-pointer"
            />
          </li>
        </ul>
      </div>
    </div>
  );
};

export default NavPpdb;
