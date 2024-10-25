import React, { useState, useEffect } from "react";
import LogoPpdb from "../../src/image/ppdb/ppdb.png";
import { Link } from "react-router-dom";

const Nav = () => {
  let Links = [
    { name: "Home", link: "/" },
    { name: "Jurusan", link: "#" }, // Prevent reload
    { name: "Biaya", link: "/ppdb/biaya" },
    { name: "Persyaratan", link: "/" },
  ];

  const [open, setOpen] = useState(false);
  const [showNav, setShowNav] = useState(false); // Start with false to hide navbar initially
  const [lastScrollY, setLastScrollY] = useState(0);
  const [dropdownOpen, setDropdownOpen] = useState(false); // Dropdown state

  const controlNavbar = () => {
    if (window.scrollY < lastScrollY) {
      // Show navbar when scrolling up
      setShowNav(false);
    } else {
      // Keep white background when scrolling down
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

  // Function to handle the dropdown toggle
  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  return (
    <div
      className={`shadow-md w-full fixed top-0 left-0 z-50 transition-all duration-300 ${
        showNav ? "bg-white" : "bg-transparent"
      }`}
    >
      <div className="md:flex items-center justify-between py-4 md:px-10 px-7">
        {/* Logo with Link to the landing page */}
        <Link to="/ppdb">
          <img
            src={LogoPpdb}
            alt="PPDB Logo"
            className="h-8 w-28 lg:w-52 lg:h-16"
          />
        </Link>

        {/* Toggle button for mobile view */}
        <div
          onClick={() => setOpen(!open)}
          className="text-3xl absolute right-8 top-6 cursor-pointer text-customGreen md:hidden"
        >
          <ion-icon name={open ? "close" : "menu"}></ion-icon>
        </div>

        {/* Full-screen mobile menu overlay */}
        <div
          className={`absolute top-0 left-0 w-full h-screen bg-black bg-opacity-50 transition-opacity duration-500 z-40 ${
            open ? "opacity-100" : "opacity-0 pointer-events-none"
          }`}
          onClick={() => setOpen(false)}
        ></div>

        {/* Main menu: always visible on desktop, hidden on mobile unless open */}
        <ul
          className={`md:flex md:items-center md:pb-0 pb-12 absolute md:static bg-white md:bg-transparent w-full md:w-auto md:pl-0 pl-9 transition-all duration-500 ease-in-out ${
            open ? "top-16 opacity-100 z-50" : "top-[-490px] opacity-0"
          } md:opacity-100 md:top-auto`}
        >
          {Links.map((link, index) => (
            <li
              key={link.name}
              className={`md:ml-8 text-lg md:my-0 my-7 relative ${
                dropdownOpen && index > 1 ? "mt-12" : ""
              }`} // Add margin when dropdown is open
            >
              <a
                href={link.link}
                className={`${
                  showNav ? "text-black" : "text-black"
                } hover:text-green-500 duration-500`}
                onClick={index === 1 ? toggleDropdown : null} // Toggle dropdown on click for "Jurusan"
              >
                {link.name}
              </a>

              {/* Dropdown for "Jurusan" */}
              {index === 1 && (
                <ul
                  className={`absolute md:left-0 w-40 bg-white rounded-lg shadow-lg py-2 z-50 transition-all duration-300 ease-in-out ${
                    dropdownOpen
                      ? "opacity-100 transform translate-y-0"
                      : "opacity-0 transform -translate-y-4 pointer-events-none"
                  } md:w-40 md:ml-0 ${
                    open ? "w-full left-0 mt-2" : "" // Ensure full-width on mobile
                  }`}
                >
                  <li>
                    <Link to="/ppdb/jurusan-rpl">
                      <a className="block px-4 py-2 text-black hover:bg-gray-100 hover:text-green-500">
                        RPL
                      </a>
                    </Link>
                  </li>
                  <li>
                    <Link to="/ppdb/jurusan-tkj">
                      <a className="block px-4 py-2 text-black hover:bg-gray-100 hover:text-green-500">
                        TKJ
                      </a>
                    </Link>
                  </li>
                </ul>
              )}
            </li>
          ))}

          {/* Add Login/Register Buttons */}
          <li className="md:ml-8 text-lg md:my-0 my-7">
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
