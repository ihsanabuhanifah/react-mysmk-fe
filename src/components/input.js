import React from "react";

import clsx from "clsx";
export function Input({
  size = "sm",
  disabled = false,
  error = false,
  width = false,
  ...props
}) {
  let cl = clsx(
    `appearance-none border transition-all duration-300 ease-in-out rounded px-1 text-gray-800  leading-tight outline-none    focus:border-2`,
    {
      "bg-gray-100 cursor-not-allowed": disabled,
      "border border-red-400": error,
      "h-8 text-xs": size === "xs",
      "h-10 text-sm": size == "sm",
      "h-12 text-base": size == "normal",
      "w-full" : width === true,
      
    }
  );
  return <input className={cl} {...props} />;
}

export function Label({ children, required = false, ...props }) {
  return (
    <label {...props}>
      {children} {required && <span className="text-red-500">*</span>}
    </label>
  );
}

export function FormText({ children, flexDirection = "col", ...props }) {
  let cl = clsx(`flex  w-full`, {
    "flex-col": flexDirection === "col",
    "flex-row": flexDirection === "row",
  });
  return (
    <section className={cl} {...props}>
      {children}
    </section>
  );
}

export function ErrorMEssage({ children }) {
  return <span className="text-red-500 text-xs font-semibold italic">{children}</span>;
}
