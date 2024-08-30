import React, { useState, useEffect } from "react";
import LogoPpdb from "../../src/image/ppdb/ppdb.png";
import { Link } from "react-router-dom";

const Nav = () => {
  let Links = [
    { name: "Home", link: "/" },
    { name: "Jurusan", link: "#" }, // Update the link to prevent page reload
    { name: "Biaya", link: "/" },
    { name: "Persyaratan", link: "/" },
  ];

  const [open, setOpen] = useState(false);
  const [showNav, setShowNav] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const controlNavbar = () => {
    if (window.scrollY > lastScrollY) {
      // Hide navbar background when scrolling down
      setShowNav(false);
    } else {
      // Show navbar background when scrolling up
      setShowNav(true);
    }
    setLastScrollY(window.scrollY);
  };

  useEffect(() => {
    window.addEventListener("scroll", controlNavbar);

    return () => {
      window.removeEventListener("scroll", controlNavbar);
    };
  }, [lastScrollY]);

  return (
    <div
      className={`shadow-md w-full fixed top-0 left-0 z-50 transition-all duration-300 ${
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
              onMouseEnter={() => index === 1 && setDropdownOpen(true)}
              onMouseLeave={() => index === 1 && setDropdownOpen(false)}
            >
              <a
                href={link.link}
                className={`${
                  showNav ? "text-gray-800" : "text-green-500"
                } hover:text-customGreen duration-500`}
              >
                {link.name}
              </a>
              {/* Dropdown Menu for "Jurusan" */}
              {index === 1 && dropdownOpen && (
                <ul className="absolute top-full left-0 shadow-lg py-2 bg-white">
                  <Link to="ppdb/jurusan-rpl">
                    <li className="px-4 py-2 hover:bg-gray-100">
                      <a className="text-green-500">RPL</a>
                    </li>
                  </Link>
                  <li className="px-4 py-2 hover:bg-gray-100">
                    <a href="/program2" className="text-green-500">
                      TKJ
                    </a>
                  </li>
                </ul>
              )}
            </li>
          ))}

          {/* Add Login/Register Buttons */}
          <li className="md:ml-8 text-xl md:my-0 my-7">
            <Link to="/login">
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

export default Nav;
