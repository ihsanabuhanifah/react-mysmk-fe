import {
  listKelas,
  listMapel,
  listGuru,
  listTahunAjaran,
  listAlquran,
  listHalaqohGroup,
} from "../api/list";
import { useQuery } from "react-query";
import { authme } from "../api/auth";
import jwt_decode from "jwt-decode";

import Cookies from "js-cookie";
import { listCalonSiswa } from "../api/guru/calonSiswa";
import { listPembayaran } from "../api/guru/pembayaran";


export default function useList() {
  let roles = jwt_decode(Cookies.get("mysmk_token"));
  let { data: identitas } = useQuery(
    //query key
    ["authme"],
    //axios function,triggered when page/pageSize change
    () => authme(),
    //configuration
    {
      staleTime: 1000 * 60 * 60 * 12,
      refetchOnWindowFocus: false,
      select: (response) => {
        const data = response?.data?.token;

        let decoded = jwt_decode(data);
        return decoded;
      },
    }
  );

  let { data: dataPembayaran } = useQuery(
    //query key
    ["list_pembayaran"],
    //axios function,triggered when page/pageSize change
    () => listPembayaran(),
    //configuration
    {
      keepPreviousData: true,
      staleTime: 1000 * 60 * 60 * 12,
      refetchOnWindowFocus: false,
      select: (response) => response.data,
    }
  );

  let { data: dataCalon } = useQuery(
    //query key
    ["list_calsan"],
    //axios function,triggered when page/pageSize change
    () => listCalonSiswa(),
    //configuration
    {
      keepPreviousData: true,
      staleTime: 1000 * 60 * 60 * 12,
      refetchOnWindowFocus: false,
      select: (response) => response.data,
    }
  );


  let { data: dataKelas } = useQuery(
    //query key
    ["list_kelas"],
    //axios function,triggered when page/pageSize change
    () => listKelas(),
    //configuration
    {
      keepPreviousData: true,
      staleTime: 1000 * 60 * 60 * 12,
      refetchOnWindowFocus: false,
      select: (response) => response.data,
    }
  );
  let { data: dataHalaqoh } = useQuery(
    //query key
    ["list_halaqoh_grup"],
    //axios function,triggered when page/pageSize change
    () => listHalaqohGroup(),
    //configuration
    {
      keepPreviousData: true,
      staleTime: 1000 * 60 * 60 * 12,
      refetchOnWindowFocus: false,
      select: (response) => response.data,
    }
  );
  let { data: dataMapel } = useQuery(
    //query key
    ["list_mapel"],
    //axios function,triggered when page/pageSize change
    () => listMapel(),
    //configuration
    {
      keepPreviousData: true,
      staleTime: 1000 * 60 * 60 * 12,
      refetchOnWindowFocus: false,
      select: (response) => response.data,
    }
  );
  let { data: dataGuru } = useQuery(
    //query key
    ["list_guru"],
    //axios function,triggered when page/pageSize change
    () => listGuru(),
    //configuration
    {
      keepPreviousData: true,
      staleTime: 1000 * 60 * 60 * 12,
      refetchOnWindowFocus: false,
      select: (response) => response.data,
    }
  );
  let { data: dataTa } = useQuery(
    //query key
    ["list_tahun_ajaran"],
    //axios function,triggered when page/pageSize change
    () => listTahunAjaran(),
    //configuration
    {
      keepPreviousData: true,
      staleTime: 1000 * 60 * 60 * 12,
      refetchOnWindowFocus: false,
      select: (response) => response.data,
    }
  );
  let { data: dataAlquran } = useQuery(
    //query key
    ["list_alquran"],
    //axios function,triggered when page/pageSize change
    () => listAlquran(),
    //configuration
    {
      keepPreviousData: true,
      staleTime: 1000 * 60 * 60 * 12,
      refetchOnWindowFocus: false,
      select: (response) => response.data,
    }
  );

  return {
    dataKelas,
    dataGuru,
    dataMapel,
    dataTa,
    identitas,
    roles,
    dataAlquran,
    dataHalaqoh,
  };
}
