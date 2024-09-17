import React from "react";
import { IoNotifications } from "react-icons/io5";
import { useListNotif } from "../api/siswa/exam";
import { useZUStore } from "../zustand/zustore";

export default function LayoutSiswa({ title, children }) {
  const { data, isFetched } = useListNotif();
  const { setShowNotif, showNotif } = useZUStore((state) => state);

  return (
    <div className="flex h-full w-full flex-col">
      <div className="flex w-full items-center justify-between border-b border-black/5 pl-5 pr-12">
        <div className="flex h-[73px] w-full items-center bg-white">
          <h1 className="mb-10 font-poppins text-2xl font-black capitalize">
            {title}
          </h1>
        </div>

        <button
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
        </button>
      </div>

      <div className="w-full flex-1 bg-white ">
        {children}
      </div>
    </div>
  );
}
