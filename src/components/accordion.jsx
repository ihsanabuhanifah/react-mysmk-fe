import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

export function AccordionNavButton({ to, path, title, logo, children }) {
    const [isOpen, setIsOpen] = useState(false);
    const { pathname } = useLocation();
    const url = pathname.split("/")[2];
    const navigate = useNavigate();
  
    const toggleAccordion = () => {
      if (!isOpen) {
        navigate(to);
      }
      setIsOpen(!isOpen);
    };
  
    return (
      <div>
        <button
          onClick={toggleAccordion}
          className={`flex items-center px-5  w-full ${url === path  ? "bg-[#00b5ad] text-white font-black rounded-md" : "text-black"}`}
        >
          <div className="w-8 h-8">{logo}</div>
          <p className={`ml-5 text-xs  font-poppins text-left ${url === path  ? "text-white font-black" : "text-black"}`}>
            {title}
          </p>
        </button>
        {isOpen && (
          <div className="pl-10 flex justify-center flex-col space-y-2">
            {children}
            
          </div>
        )}
      </div>
    );
  }