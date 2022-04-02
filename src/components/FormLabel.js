import React from "react";

export function FormLabel({ label, htmlFor, children }) {
  return (
    <React.Fragment>
      <div className=" w-full ">
        <label htmlFor={htmlFor}>{label}</label>
        <div className="w-full overflow-auto">{children}</div>
      </div>
    </React.Fragment>
  );
}
