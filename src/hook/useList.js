import React from "react";
import { listKelas, listMapel, listGuru, listTahunAjaran } from "../api/list";
import { useQuery } from "react-query";
import { authme } from "../api/auth";
import jwt_decode from "jwt-decode";
export default function useList() {
    let { data:identitas } = useQuery(
        //query key
        ["authme"],
        //axios function,triggered when page/pageSize change
        () => authme(),
        //configuration
        {
          staleTime: 60 * 1000 * 60 * 12, // 12 jam,
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
      staleTime: 60 * 1000 * 60 * 12, // 12 jam,
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
      staleTime: 60 * 1000 * 60 * 12, // 12 jam,
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
      staleTime: 60 * 1000 * 60 * 12, // 12 jam,
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
      staleTime: 60 * 1000 * 60 * 12, // 12 jam,
      select: (response) => response.data,
    }
  );

  return { dataKelas, dataGuru, dataMapel, dataTa };
}
