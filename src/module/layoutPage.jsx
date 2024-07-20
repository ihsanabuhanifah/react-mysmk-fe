import React from "react";

export default function LayoutPage({ title, children }) {
 
  return (
    <React.Fragment>
      <section className=" mr-5 mb-5 h-full   ">
      
        <div className="h-[5%] px-5 pt-5 flex items-center ">
        <h1 className="text-2xl capitalize mb-5 font-bold font-poppins">{title}</h1>
        </div>
          
      
        <div id="scrollbar" className="h-[95%]  bg-white border-t-2 border-[#01B5AD] w-full px-5  mt-5 pr-0  xl:overflow-auto  xl:pr-2">{children}</div>
      </section>
    </React.Fragment>
  );
}
