import React from "react";
import { useNavigate } from "react-router-dom";
import { MdClose } from "react-icons/md";
import { showFormattedDate } from "../utils/waktu";
import { useListNotif } from "../api/siswa/exam";
import { useZUStore } from "../zustand/zustore";

export default function Notifikasi() {
  let navigate = useNavigate();
  const { data } = useListNotif();
  const { setShowNotif } = useZUStore((state) => state);

  return (
    <section className="mt-0 h-full w-full overflow-auto p-3 pt-5 xl:h-full border-l-2">
      <div className="mb-4 flex items-center justify-between px-2">
        <h1 className="mb-0 hidden text-lg xl:block">
          {showFormattedDate(new Date())}
        </h1>
        <button className="block" onClick={setShowNotif}>
          <MdClose className="h-6 w-6" />
        </button>
      </div>
      <div className="h-[90%] overflow-visible">
        <h2 className="mb-4 px-2 font-poppins text-xl font-bold">
          Pemberitahuan
        </h2>
        <div>
          {data?.list?.count === 0 ? (
            <p className="p-2 text-[#00b5ad]">Tidak Ada Pemberitahuan</p>
          ) : (
            <>
              <section>
                {data?.list?.rows?.map((value, index) => (
                  <div key={index}>
                    <button
                      onClick={() => {
                        setShowNotif();
                        navigate(`/siswa/ujian`);
                      }}
                      className="flex items-center p-2 text-justify text-sm italic text-white hover:bg-green-400 hover:text-red-600 xl:text-xs xl:text-red-500 xl:hover:bg-blue-50"
                    >
                      <div className="mr-5 h-12 w-2 bg-green-400"></div>
                      <div className="text-red-400">
                        Anda belum mengerjakan ujian mata pelajaran{" "}
                        {value.mapel.nama_mapel} ({value.ujian.judul_ujian})
                      </div>
                    </button>
                  </div>
                ))}
              </section>
            </>
          )}
        </div>
      </div>
    </section>
  );
}
