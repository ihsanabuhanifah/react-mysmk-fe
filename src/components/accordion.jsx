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
          className={`flex items-center px-5 h-10 w-full ${url === path || isOpen ? "bg-[#00b5ad] text-white font-black" : "text-black"}`}
        >
          <div className="w-8 h-8">{logo}</div>
          <p className={`ml-5 text-xs whitespace-nowrap font-poppins text-left ${url === path || isOpen ? "text-white font-black" : "text-black"}`}>
            {title}
          </p>
        </button>
        {isOpen && (
          <div className="pl-10 space-y-2">
            {children}
            
          </div>
        )}
      </div>
    );
  }