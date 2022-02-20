import React from "react";
import { useNavigate } from "react-router-dom";
import { notifikasiAbsensi } from "../api/guru/absensi";
import { useQuery } from "react-query";
import dayjs from "dayjs";
export default function Notifikasi() {
  let navigate = useNavigate();
  const [hari, setHari] = React.useState("senin");
  let { data, isLoading, isFetching } = useQuery(
    //query key
    ["notifikasi"],
    //axios function,triggered when page/pageSize change
    () => notifikasiAbsensi(),
    //configuration
    {
      staleTime: 60 * 1000, // 1 menit,
      select: (response) => {
        console.log(response);
        return response.data;
      },
    }
  );

  console.log(data);
  return (
    <React.Fragment>
      <h2 className="px-2">Notifikasi</h2>
      <div>
        {data?.data?.map((value, index) => (
          <div key={index}>
            <button
              onClick={() => {
                return navigate(
                  `/guru/jadwal/absensi/${value?.kelas?.id}/${value?.mapel?.id}/${dayjs(value?.tanggal).format('YYYY-MM-DD')}`
                );
              }}
              className="text-xs text-justify hover:bg-blue-50 p-2 text-red-500 hover:text-red-600"
            >
              Anda Belum melakukan abensi pada mata pelajaran{" "}
              {value?.mapel?.nama_mapel} di kelas {value?.kelas?.nama_kelas}
            </button>
          </div>
        ))}
      </div>
    </React.Fragment>
  );
}
