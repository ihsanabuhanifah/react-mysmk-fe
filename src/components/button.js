import React from "react";

import clsx from "clsx";

export function Button({ block = false, children, ...props }) {
  let cl = clsx(
    "bg-blue-300 hover:bg-blue-500 text-white font-bold h-12 rounded-md ",
    {
      "w-full": block === true,
      "w-24" : block === false
    }
  );
  return (
    <button className={cl} {...props}>
      <span>{children}</span>
    </button>
  );
}
