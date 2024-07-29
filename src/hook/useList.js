import React from "react";
import {
  listKelas,
  listMapel,
  listGuru,
  listTahunAjaran,
  listAlquran,
  listHalaqohGroup,
} from "../api/list";
import { getRoleMe } from "../api/auth";
import { useQuery } from "react-query";
import { authme } from "../api/auth";
import jwt_decode from "jwt-decode";

export default function useList() {
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
  let { data: roles } = useQuery(
    //query key
    ["get_role_me"],
    //axios function,triggered when page/pageSize change
    () => getRoleMe(),
    //configuration
    {
      keepPreviousData: true,
      staleTime: 1000 * 60 * 60 * 12,
      refetchOnWindowFocus: false,
      select: (response) => response.data?.role,
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
