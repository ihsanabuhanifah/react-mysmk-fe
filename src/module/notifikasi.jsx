import React from "react";
import { useNavigate } from "react-router-dom";
import { notifikasiAbsensi } from "../api/guru/absensi";
import { notifikasiHalaqoh } from "../api/guru/halaqoh";
import { useQuery } from "react-query";
import dayjs from "dayjs";
export default function Notifikasi() {
  let navigate = useNavigate();
  const [hari, setHari] = React.useState("senin");
  let { data } = useQuery(
    //query key
    ["notifikasi_absensi_kelas"],
    //axios function,triggered when page/pageSize change
    () => notifikasiAbsensi(),
    //configuration
    {
      staleTime: 60 * 1000, // 1 menit,
      select: (response) => {
        return response.data;
      },
    }
  );
  let { data: notifHalaqoh } = useQuery(
    //query key
    ["notifikasi_absensi_halaqoh"],
    //axios function,triggered when page/pageSize change
    () => notifikasiHalaqoh(),
    //configuration
    {
      staleTime: 60 * 1000, // 1 menit,
      select: (response) => {
        return response.data;
      },
    }
  );

  return (
    <div className="mt-5 border p-3 h-9/12 overflow-auto rounded-lg">
      <h3 className="px-2">Notifikasi</h3>
      <div>
        <section>
          {data?.data?.map((value, index) => (
            <div key={index}>
              <button
                onClick={() => {
                  return navigate(
                    `/guru/jadwal/absensi/${value?.kelas?.id}/${
                      value?.mapel?.id
                    }/${dayjs(value?.tanggal).format("YYYY-MM-DD")}`
                  );
                }}
                className="text-xs flex items-center italic text-justify hover:bg-blue-50 p-2 text-red-500 hover:text-red-600"
              >
                <div className="h-10 w-2 bg-green-400  mr-5"></div>
                <div>
                  {" "}
                  Anda Belum melakukan abensi pada mata pelajaran{" "}
                  {value?.mapel?.nama_mapel} di kelas {value?.kelas?.nama_kelas} di tanggal  {dayjs(value?.tanggal).format("YYYY-MM-DD")}
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
                  return navigate(
                    `/guru/halaqoh/${dayjs(value?.tanggal).format(
                      "YYYY-MM-DD"
                    )}`
                  );
                }}
                className="flex items-center  text-xs italic text-justify hover:bg-blue-50 p-2 text-red-500 hover:text-red-600"
              >
                <div className="h-10 w-2 bg-green-400  mr-5"></div>
                <div>
                  {" "}
                  Anda Belum melakukan abensi Halaqoh pada tanggal{" "}
                  {dayjs(value?.tanggal).format("YYYY-MM-DD")}
                </div>
              </button>
            </div>
          ))}
        </section>
      </div>
    </div>
  );
}
