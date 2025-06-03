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
import axios from "../api/axiosClient";

import Cookies from "js-cookie";
import { getProfile, getProfileSiswa } from "../api/guru/profile";

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
  // let { data: dataPembimbing } = useQuery(
  //   //query key
  //   ["pembimbing"],
  //   //axios function,triggered when page/pageSize change
  //   () => listPembimbing(),
  //   //configuration
  //   {
  //     keepPreviousData: true,
  //     staleTime: 1000 * 60 * 60 * 12,
  //     refetchOnWindowFocus: false,
  //     select: (response) => response.data,
  //   }
  // );
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
  async function listDataAlquran(keyword, loadedOptions, additional) {
    let result = await axios.get(`/list/alquran`, {
      params: {
        page: additional.page,
        pageSize: 115,
        keyword,
      },
    });

    result = result.data;

    let options = result.data.map((item) => ({
      label: item.nama_surat,
      value: item.nama_surat,
    }));

    return {
      options: options,
      hasMore: result.pagination?.current_page < result.pagination?.total_page,
      additional: {
        page: additional?.page + 1,
        scope_of_service: additional?.scope_of_service,
      },
    };
  }


  let { data: profile, isFetching:profileFetching } = useQuery(
    //query key
    ["santri/profile"],
    //axios function,triggered when page/pageSize change
    () => getProfileSiswa(),
    //configuration
    {
      keepPreviousData: true,
      staleTime: 1000 * 60 * 60 * 12,
      enabled : roles?.role === "santri" || roles?.role === "siswa",
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
    listDataAlquran,
    profile,
    profileFetching

  };
}
