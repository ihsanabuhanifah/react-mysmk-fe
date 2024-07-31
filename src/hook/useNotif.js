
import { notifikasiAbsensi } from "../api/guru/absensi";
import { notifikasiHalaqoh } from "../api/guru/halaqoh";
import { getNotifikasiGuruPiket } from "../api/guru/laporan";
import { useQuery } from "react-query";
import useList from "./useList";

export default function useNotif() {

  let {roles} = useList()

  console.log('role', roles)
  let { data: notifAbsensi } = useQuery(
    //query key
    ["notifikasi_absensi_kelas"],
    //axios function,triggered when page/pageSize change
    () => notifikasiAbsensi(),
    //configuration
    {
      enabled : roles?.role?.toLowerCase() === 'guru',
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
      enabled : roles?.role?.toLowerCase() === 'guru',
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
      enabled : roles?.role?.toLowerCase() === 'guru',
      staleTime: 60 * 1000 * 5, // 1 menit,
      select: (response) => {
        return response.data;
      },
    }
  );

  let jumlah =
    notifAbsensi?.data.length +
    notifHalaqoh?.data.length +
    notifPiket?.data.length;

    

  return { notifAbsensi, notifHalaqoh, notifPiket, jumlah };
}
