import { useQuery } from "react-query";
import { syncToken } from "../axiosClient";
import axios from "../axiosClient";
import { useState } from "react";
import { listKelas, listtahunajaran } from "../list";

export function useGetHasilBelajar() {
  let [params, setParams] = useState({
    nama_mapel: "",
    ta_id: "",
    tanggal: "",
    nama_kelas: "",
  });

  syncToken();

  let { data: dataTa } = useQuery(
    ["list_tahun_ajaran"],
    () => listtahunajaran(),
    {
      refetchOnWindowFocus: false,
      staleTime: 1000 * 60 * 60 * 5,
      select: (res) => res.data.data,
    },
  );

  let { data: dataKelas } = useQuery(["list_kelas"], () => listKelas(), {
    refetchOnWindowFocus: false,
    staleTime: 1000 * 60 * 60 * 5,
    select: (res) => res.data.data,
  });

  let { data, isFetching } = useQuery(
    ["/santri/hasil-belajar", params],
    () =>
      axios.get("/santri/hasil-belajar", { params }).then((res) => res.data),
    {
      refetchOnWindowFocus: false,
      staleTime: 1000 * 60 * 60 * 5,
      onSuccess: (res) => {},
      onError: (res) => {},
    },
  );

  return { data, isFetching, setParams, dataTa, params, dataKelas };
}

export function useGetHasilBelajarDetail(id, ta_id) {
  syncToken();

  const { data, isLoading } = useQuery(
    ["/santri/hasil-belajar-detail"],
    () =>
      axios
        .get(`/santri/hasil-belajar-detail/${id}/${ta_id}`)
        .then((res) => res.data),
    {
      refetchOnWindowFocus: false,
      staleTime: 1000 * 60 * 60 * 5,
      onSuccess: (res) => {},
      onError: (res) => {},
    },
  );

  return { data, isLoading };
}
