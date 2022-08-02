import React from "react";

import useShowNotif from "../hook/useShowNotif";

export default function LayoutPage({ title, children }) {
 
  return (
    <React.Fragment>
      <section className=" mr-5 mb-5 h-full  ">
      
        <div className="h-[5%] px-5 pt-5">
        <h1 className="text-2xl capitalize mb-5 font-poppins sticky">{title}</h1>
        </div>
          
      
        <div id="scrollbar" className="h-[95%] w-full px-5 overflow-auto mt-2 pr-0   xl:pr-2">{children}</div>
      </section>
    </React.Fragment>
  );
}
