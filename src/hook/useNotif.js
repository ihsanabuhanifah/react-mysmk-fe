import { notifikasiAbsensi } from "../api/guru/absensi";
import { notifikasiHalaqoh } from "../api/guru/halaqoh";
import { getNotifikasiGuruPiket } from "../api/guru/laporan";
import { useQuery } from "react-query";
import useList from "./useList";
import { notifikasiExam } from "../api/guru/ujian";

export default function useNotif() {
  let { roles } = useList();

  let { data: notifAbsensi } = useQuery(
    //query key
    ["notifikasi_absensi_kelas"],
    //axios function,triggered when page/pageSize change
    () => notifikasiAbsensi(),
    //configuration
    {
      enabled: roles?.role?.toLowerCase() === "guru",
      staleTime: 60 * 1000 * 5, // 1 menit,
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
      enabled: roles?.role?.toLowerCase() === "guru",
      staleTime: 60 * 1000 * 5, // 1 menit,
      select: (response) => {
        return response.data;
      },
    }
  );
  let { data: notifPiket } = useQuery(
    //query key
    ["notifikasi_guru_piket"],
    //axios function,triggered when page/pageSize change
    () => getNotifikasiGuruPiket(),
    //configuration
    {
      enabled: roles?.role?.toLowerCase() === "guru",
      staleTime: 60 * 1000 * 5, // 1 menit,
      select: (response) => {
        return response.data;
      },
    }
  );

  let { data: notifExam } = useQuery(
    //query key
    ["/guru//nilai/notifikasi"],
    //axios function,triggered when page/pageSize change
    () => notifikasiExam(),
    //configuration
    {
      enabled: roles?.role?.toLowerCase() === "guru",
      staleTime: 60 * 1000 * 5, // 1 menit,
      select: (response) => {
        return response.data;
      },
    }
  );

  let jumlah =
    notifAbsensi?.data.length +
    notifHalaqoh?.data.length +
    notifPiket?.data.length  + notifExam?.data.length
   

  return { notifAbsensi, notifHalaqoh, notifPiket, jumlah, notifExam };
}
