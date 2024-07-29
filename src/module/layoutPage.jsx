import React from "react";

export default function LayoutPage({ title, children }) {
  return (
    <React.Fragment>
      <section className="  mb-5 h-screen   ">
        <div className=" px-5 py-3 flex items-center ">
          <h1 className="text-2xl capitalize mb-10 font-bold font-poppins">
            {title}
          </h1>
        </div>

        <div
          id="scrollbar"
          className="h-[95%]  bg-white border-t-2  w-full px-5 lg:px-2 pb-10 overflow-auto  "
        >
          {children}
        </div>
      </section>
    </React.Fragment>
  );
}
