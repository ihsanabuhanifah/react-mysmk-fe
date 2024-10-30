import React, { useState, useEffect } from "react";
import LogoPpdb from "../../src/image/ppdb/ppdb.png";
import { Link } from "react-router-dom";

const NavPpdb = () => {
  const Links = [
    { name: "Home", link: "/landingpage" },
    { name: "Jurusan", link: "#" },
    { name: "Biaya", link: "/" },
    { name: "Persyaratan", link: "/" },
  ];

  const [open, setOpen] = useState(false);
  const [showNav, setShowNav] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const controlNavbar = () => {
    if (window.scrollY > 50) {
      setShowNav(true);
    } else {
      setShowNav(false);
    }
    setLastScrollY(window.scrollY);
  };

  useEffect(() => {
    window.addEventListener("scroll", controlNavbar);

    return () => {
      window.removeEventListener("scroll", controlNavbar);
    };
  }, [lastScrollY]);

  // Handle click outside of the dropdown to close it
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownOpen && !event.target.closest(".dropdown")) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownOpen]);

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  return (
    <div
      className={`w-full fixed top-0 left-0 z-50 transition-all duration-300 ${
        showNav ? "bg-white" : "bg-transparent"
      }`}
    >
      <div className="md:flex items-center justify-between py-4 md:px-10 px-7">
        <img src={LogoPpdb} alt="PPDB Logo" />

        {/* Toggle button for mobile view */}
        <div
          onClick={() => setOpen(!open)}
          className="text-3xl absolute right-8 top-6 cursor-pointer md:hidden"
        >
          <ion-icon name={open ? "close" : "menu"}></ion-icon>
        </div>

        <ul
          className={`md:flex md:items-center md:pb-0 pb-12 absolute md:static md:z-auto z-[-1] left-0 w-full md:w-auto md:pl-0 pl-9 transition-all duration-500 ease-in ${
            open ? "top-20 " : "top-[-490px]"
          }`}
        >
          {Links.map((link, index) => (
            <li
              key={link.name}
              className="md:ml-8 text-xl md:my-0 my-7 relative"
            >
              <a
                href={link.link}
                className={`${
                  showNav ? "text-gray-800" : "text-white"
                } hover:text-customGreen duration-500`}
                onClick={index === 1 ? toggleDropdown : null}
              >
                {link.name}
              </a>
              {/* Dropdown Menu for "Jurusan" */}
              {index === 1 && dropdownOpen && (
                <div className="absolute top-full left-0 mt-2 w-48 bg-white md:bg-white border border-gray-200 rounded-lg shadow-lg dropdown">
                  <ul className="py-2">
                    <Link to="/landingpage/jurusan-rpl">
                      <li className="px-4 py-2 hover:bg-green-100 cursor-pointer">
                        <span className="text-green-500 font-semibold">
                          RPL
                        </span>
                      </li>
                    </Link>
                    <Link to="/landingpage/jurusan-tkj">
                      <li className="px-4 py-2 hover:bg-green-100 cursor-pointer">
                        <span className="text-green-500 font-semibold">
                          TKJ
                        </span>
                      </li>
                    </Link>
                  </ul>
                </div>
              )}
            </li>
          ))}

          {/* Add Login/Register Buttons */}
          <li className="md:ml-8 text-xl md:my-0 my-7">
            <Link to="/ppdb/login">
              <button className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 duration-300">
                Login
              </button>
            </Link>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default NavPpdb;
