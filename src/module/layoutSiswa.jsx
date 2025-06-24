

export default function LayoutSiswa({ title, children }) {





  return (
    <section className="  mb-5 h-full   ">
      <div className=" px-5 py-5 flex items-center ">
          <h1 className="text-2xl capitalize mb-10 font-bold font-poppins">
            {title}
          </h1>
        </div>

        {/* <button
          onClick={() => {
            setShowNotif();
          }}
          className="relative hidden xl:block"
        >
          <IoNotifications size={30} className="" />
          {isFetched && (
            <span className="absolute right-1 top-1 inline-flex -translate-y-1/2 translate-x-1/2 transform items-center justify-center rounded-full bg-red-600 px-2 py-1 text-xs font-bold leading-none text-white">
              {data?.list?.count}
            </span>
          )}
        </button> */}
     

        <div
          id="scrollbar"
          className="h-[95%]  bg-white border-t-2  w-full px-2 lg:px-5 pb-10 pt-5 overflow-auto  "
        >

          {/* <BackButton onClick={() => navigate(-1)}/> */}
          
          {children}
        </div>
    </section>
  );
}