import React from "react";

export default function LayoutPage({ title, children }) {
  return (
    <React.Fragment>
      <section className="mt-5 ml-5 mr-5 mb-5">
        <h1 className="text-2xl capitalize mb-5 font-poppins">{title}</h1>
       
        <div className="h-full">{children}</div>
      </section>
    </React.Fragment>
  );
}
