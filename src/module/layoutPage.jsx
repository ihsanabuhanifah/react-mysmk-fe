import React from "react";
import { useNavigate } from "react-router-dom";
import { BackButton } from "../components/buttonAksi/editButton";
import { LoadingPage } from "../components";

export default function LayoutPage({ title, children, isLoading }) {
  const navigate = useNavigate();


  if(isLoading){
    return <LoadingPage/>
  }
  return (
    <React.Fragment>
      <section className="  mb-5 h-full   ">
        <div className=" px-5 py-5 flex items-center ">
          <h1 className="text-2xl capitalize mb-10 font-bold font-poppins">
            {title}
          </h1>
        </div>

        <div
          id="scrollbar"
          className="h-[95%]  bg-white border-t-2  w-full px-2 lg:px-5 pb-10 pt-5 overflow-auto  "
        >

          {/* <BackButton onClick={() => navigate(-1)}/> */}
          
          {children}
        </div>
      </section>
    </React.Fragment>
  );
}
