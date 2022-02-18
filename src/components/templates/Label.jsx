import React from "react";

export default function Label({ label, children }) {
  return (
    <label className="font-bold text-gray-500 uppercase" htmlFor={label}>
      {children}
    </label>
  );
}
