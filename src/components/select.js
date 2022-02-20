import React from "react";
import clsx from "clsx";
import { Children } from "react";

export function Select({
    size = "sm",
    disabled = false,
    error = false,
    children,
    ...props
  }) {
    let cl = clsx(
      `appearance-none border transition-all duration-300 ease-in-out rounded px-1 text-gray-800  leading-tight outline-none  w-full  focus:border-2`,
      {
        "bg-gray-100 cursor-not-allowed": disabled,
        "border border-red-400": error,
        "h-8 text-xs": size === "xs",
        "h-10 text-sm": size == "sm",
        "h-12 text-base": size == "normal",
      }
    );
    return (
        <select className={cl} {...props}>
            {children}
        </select>
    );
  }