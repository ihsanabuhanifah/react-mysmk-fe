import React from "react";
import clsx from "clsx";
import PropTypes from "prop-types";

import { AsyncPaginate } from "react-select-async-paginate";

export function Select({
  size = "sm",
  disabled = false,
  error = false,
  children,
  errors,
  width = true,
  ...props
}) {
  let cl = clsx(
    `appearance-none border transition-all duration-300 ease-in-out rounded px-1 text-gray-800  leading-tight outline-none   focus:border-2`,
    {
      "bg-gray-100 cursor-not-allowed": disabled,
      "border border-red-400": error,
      "h-8 text-xs": size === "xs",
      "h-10 text-sm": size === "sm",
      "h-12 text-base": size === "normal",
    }
  );
  let clDiv = clsx("lock w-full relative  ", {
    "border border-red-400": error === true,
    "border border-red-400": errors !== undefined,
    "w-full": width === true,
  });

  return (
    <div className={clDiv}>
      <select className={cl} {...props}>
        {children}
      </select>
      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
        <svg
          className="fill-current h-4 w-4"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
        >
          <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
        </svg>
      </div>
    </div>
  );
}

export function ReactSelectAsync({
  error = false,
  size = "default",
  zIndex = null,
  ...props
}) {
  let cl = clsx(" rounded-md", {
    "  w-full": error === true,
  });

  const customStyles = {
    input: (provided, state) => ({
      ...provided,
      borderColor: error ? "#e0b4b4" : null,
      color: "#9f3a38",
      width: 150,
    }),
    menuPortal: (provided) => {
      return { ...provided, zIndex: 9999 };
    },
    control: (provided, state) => ({
      ...provided,

      borderColor: error ? "#e0b4b4" : "#e2e8f0",
      fontSize: "0.875rem",
      backgroundColor: error ? "#fff6f6" : "",
      paddingLeft: 5,
      color: "rgba(0,0,0,.87)",
    }),
    placeholder: (provided, state) => ({
      ...provided,
      color: "rgba(0,0,0,.87)",
      fontSize: "1em",
      fontFamily: 'Lato'
      
    }),
    container: (provided, state) => ({
      ...provided,
      backgroundColor: '#fff',
      fontSize: '1em',
      zIndex: zIndex,
    }),
  };

  return (
    <div className={cl}>
      <AsyncPaginate
        menuPortalTarget={document.body}
        styles={customStyles}
        defaultOptions
        {...props}
      />
    </div>
  );
}

ReactSelectAsync.propTypes = {
  error: PropTypes.bool,
};
