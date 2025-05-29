// import React from "react";
// import { useNavigate } from "react-router-dom";
// import { MdClose } from "react-icons/md";
// import { showFormattedDate } from "../utils/waktu";
// import { useListNotif } from "../api/siswa/exam";
// import { useZUStore } from "../zustand/zustore";

// export default function Notifikasi() {
//   let navigate = useNavigate();
//   const { data } = useListNotif();
//   const { setShowNotif } = useZUStore((state) => state);

//   return (
//     <section className="mt-0 h-full w-full overflow-auto p-3 pt-5 xl:h-full border-l-2">
//       <div className="mb-4 flex items-center justify-between px-2">
//         <h1 className="mb-0 hidden text-lg xl:block">
//           {showFormattedDate(new Date())}
//         </h1>
//         <button className="block" onClick={setShowNotif}>
//           <MdClose className="h-6 w-6" />
//         </button>
//       </div>
//       <div className="h-[90%] overflow-visible">
//         <h2 className="mb-4 px-2 font-poppins text-xl font-bold">
//           Pemberitahuan
//         </h2>
//         <div>
//           {data?.list?.count === 0 ? (
//             <p className="p-2 text-[#00b5ad]">Tidak Ada Pemberitahuan</p>
//           ) : (
//             <>
//               <section>
//                 {data?.list?.rows?.map((value, index) => (
//                   <div key={index}>
//                     <button
//                       onClick={() => {
//                         setShowNotif();
//                         navigate(`/siswa/ujian`);
//                       }}
//                       className="flex items-center p-2 text-justify text-sm italic text-white hover:bg-green-400 hover:text-red-600 xl:text-xs xl:text-red-500 xl:hover:bg-blue-50"
//                     >
//                       <div className="mr-5 h-12 w-2 bg-green-400"></div>
//                       <div className="text-red-400">
//                         Anda belum mengerjakan ujian mata pelajaran{" "}
//                         {value.mapel.nama_mapel} ({value.ujian.judul_ujian})
//                       </div>
//                     </button>
//                   </div>
//                 ))}
//               </section>
//             </>
//           )}
//         </div>
//       </div>
//     </section>
//   );
// }

import React from "react";
import { useNavigate } from "react-router-dom";
import { MdClose } from "react-icons/md";
import dayjs from "dayjs";
import useNotif from "../hook/useNotif";
import { showFormattedDate } from "../utils/waktu";
export default function Notifikasi({ setNotif }) {
  let navigate = useNavigate();
  // eslint-disable-next-line no-empty-pattern
  const [] = React.useState("senin");
  const { notifAbsensi, notifHalaqoh, notifPiket, jumlah, notifExam } =
    useNotif();

  const handleNotif = () => {
    setNotif(false);
  };



  return (
    <section className="mt-0 overflow-auto p-3 h-full xl:h-full xl:border-l-2">
      <h1 className="text-lg xl:block hidden px-2 mb-5">
        {showFormattedDate(new Date())}
      </h1>
      <div className="h-[90%] overflow-visible">
        <div className="px-2 flex items-center justify-between ">
          <h2 className="font-poppins font-bold text-xl ">Pemberitahuan</h2>
          <button className="mb-5 xl:hidden block" onClick={handleNotif}>
            <MdClose className="w-10 h-10" />
          </button>
        </div>
        <div>
          {jumlah === 0 ? (
            <p className="p-2 text-[#00b5ad]">Tidak Ada Pemberitahuan</p>
          ) : (
            <>
              <section>
                {notifExam &&
                  notifExam?.data?.map((value, index) => (
                    <div key={index}>
                      <button
                        onClick={() => {
                          setNotif(false);
                          return navigate(
                            `/guru/exam/penilaian/${value?.ujian_id}/${value?.mapel?.nama_mapel}}`
                          );
                        }}
                        className=" text-sm xl:text-xs flex items-center italic text-justify hover:bg-green-400 xl:hover:bg-blue-50 p-2  text-white xl:text-red-500 hover:text-red-600"
                      >
                        <div className="h-12 w-2 bg-green-400  mr-5"></div>
                        <div>
                          {" "}
                          Anda Belum melakukan Penialian {
                            value.jenis_ujian
                          }{" "}
                          pada mata pelajaran pada mata pelajaran{" "}
                          {value?.mapel?.nama_mapel}
                          di kelas {value?.kelas?.nama_kelas}
                        </div>
                      </button>
                    </div>
                  ))}
              </section>
              <section>
                {notifAbsensi?.data?.map((value, index) => (
                  <div key={index}>
                    <button
                      onClick={() => {
                        setNotif(false);
                        return navigate(
                          `/guru/absensi/${value?.kelas?.id}/${
                            value?.mapel?.id
                          }/${dayjs(value?.tanggal).format("YYYY-MM-DD")}`
                        );
                      }}
                      className=" text-sm xl:text-xs flex items-center italic text-justify hover:bg-green-400 xl:hover:bg-blue-50 p-2  text-white xl:text-red-500 hover:text-red-600"
                    >
                      <div className="h-12 w-2 bg-green-400  mr-5"></div>
                      <div>
                        {" "}
                        Anda Belum melakukan abensi pada mata pelajaran{" "}
                        {value?.mapel?.nama_mapel} di kelas{" "}
                        {value?.kelas?.nama_kelas} di tanggal{" "}
                        {dayjs(value?.tanggal).format("DD-MM-YYYY")}
                      </div>
                    </button>
                  </div>
                ))}
              </section>
              <section>
                {notifHalaqoh?.data?.map((value, index) => (
                  <div key={index}>
                    <button
                      onClick={() => {
                        setNotif(false);
                        return navigate(
                          `/guru/halaqoh/absensi/${dayjs(value?.tanggal).format(
                            "YYYY-MM-DD"
                          )}?halaqoh=${value.waktu}`
                        );
                      }}
                      className="flex items-center   text-sm xl:text-xs italic text-justify hover:bg-green-400 xl:hover:bg-blue-50 p-2 text-white xl:text-red-500 hover:text-red-600"
                    >
                      <div className="h-12 w-2 bg-green-400  mr-5"></div>
                      <div>
                        {" "}
                        Anda Belum melakukan abensi Halaqoh {value?.waktu} pada
                        tanggal {dayjs(value?.tanggal).format("DD-MM-YYYY")}
                      </div>
                    </button>
                  </div>
                ))}
              </section>
              <section>
                {notifPiket?.data?.map((value, index) => (
                  <div key={index}>
                    <button
                      onClick={() => {
                        setNotif(false);
                        return navigate(
                          `/guru/laporan-guru-piket/buat-laporan/${
                            value?.id
                          }/${dayjs(value?.tanggal).format("YYYY-MM-DD")}`
                        );
                      }}
                      className="flex items-center   text-sm xl:text-xs italic text-justify hover:bg-green-400 xl:hover:bg-blue-50 p-2 text-white xl:text-red-500 hover:text-red-600"
                    >
                      <div className="h-4 w-2 bg-green-400  mr-5"></div>
                      <div>
                        {" "}
                        Anda belum membuat laporan guru piket{" "}
                        {dayjs(value?.tanggal).format("DD-MM-YYYY")}
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