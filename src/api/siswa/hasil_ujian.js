import { useQuery } from "react-query";
import { syncToken } from "../axiosClient";
import axios from "../axiosClient";
import { useState } from "react";
import { listKelas, listMapel } from "../list";

export function useListHasilUjian() {
  let [params, setParams] = useState({
    nama_mapel: "",
    judul_ujian: "",
    kelas: "",
    page: 1,
    pageSize: 10,
  });
  syncToken();

  let { data, isFetching } = useQuery(
    ["/santri/hasil-ujian", params],
    () => axios.get("/santri/hasil-ujian", { params }).then((res) => res.data),
    {
      refetchOnWindowFocus: false,
      staleTime: 1000 * 60 * 60 * 5,
      onSuccess: (res) => {},
      onError: (res) => {},
    },
  );

  const { data: dataMapel, isFetching: loadMapel } = useQuery(
    ["/list/mapel"],
    () => listMapel(),
    {
      refetchOnWindowFocus: false,
      staleTime: 1000 * 60 * 60 * 5,
      select: (res) => res.data.data,
    },
  );

  const { data: dataKelas, isFetching: loadKelas } = useQuery(
    ["/list/kelas"],
    () => listKelas(),
    {
      refetchOnWindowFocus: false,
      staleTime: 1000 * 60 * 60 * 5,
      select: (res) => res.data.data,
    },
  );

  return {
    data,
    isFetching,
    params,
    setParams,
    dataMapel,
    loadMapel,
    dataKelas,
    loadKelas,
  };
}
