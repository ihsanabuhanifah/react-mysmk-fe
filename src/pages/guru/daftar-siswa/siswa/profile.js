import useToast from "../../../../hook/useToast";
import axios, { syncToken } from "../../../../api/axiosClient";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { useState } from "react";
import { listPelanggaran, listtahunajaran } from "../../../../api/list";

export const useUpdateProfile = (id) => {
  let queryClient = useQueryClient();
  const { successToast, warningToast } = useToast();
  const mutate = useMutation(
    (payload) => {
      console.log(payload);
      return axios.put(`/guru/siswa/update/${id}`, payload);
    },
    {
      onSuccess: (response) => {
        queryClient.invalidateQueries(`/guru/siswa/detail/${id}`);
        successToast(response);
      },

      onError: (error) => {
        warningToast(error);
      },
    }
  );
  return mutate;
};

const getNilaiSiswa = async (id) => {
  const response = await axios.get(`guru/siswa/hasil-belajar/${id}`);
  return response.data; // Hanya mengembalikan data
};

export function useNilaiSiswa(id) {
  const { data, isLoading, error } = useQuery(
    ["guru/siswa/hasil-belajar", id],
    () => getNilaiSiswa(id)
  );
  return { data, isLoading, error };
}

const getNilaiDetail = async (mapelId, siswaId) => {
  const response = await axios.get(
    `/guru/siswa/detail-hasil-belajar/${mapelId}/${siswaId}`
  );
  return response.data; // Pastikan hanya data yang dikembalikan
};

export function useNilaiDetail(mapelId, siswaId) {
  const { data, isLoading, error } = useQuery(
    ["guru/siswa/detail-hasil-belajar", mapelId, siswaId],
    () => getNilaiDetail(mapelId, siswaId),
    {
      enabled: !!mapelId && !!siswaId,
      staleTime: 1000 * 60 * 60 * 24,
    }
  );
  return { data, isLoading, error };
}

export function usePelanggaranSiswa(id) {
  let [params, setParams] = useState({
    page: 1,
    pageSize: 10,
    pelanggaran: "",
    semester: "",
    ta: "",
    kat_pelanggaran: "",
  });

  syncToken();

  let { data: dataTa } = useQuery(
    ["list_tahun_ajaran"],
    () => listtahunajaran(),
    {
      enabled: !!id,
      staleTime: 1000 * 60 * 60 * 24, // 24 jam
      select: (res) => res.data.data,
    }
  );

  let { data: dataPelanggaran } = useQuery(
    ["list_pelanggaran"],
    () => listPelanggaran(),
    {
      enabled: !!id,  
      staleTime: 1000 * 60 * 60 * 24, // 24 jam
      select: (res) => res.data.data,
    }
  );

  let { data, isFetching } = useQuery(
    ["/guru/pelanggaran/detail", [params, id]],
    () =>
      axios
        .get(`/guru/pelanggaran/list/${id}`, { params })
        .then((res) => res.data),
    {
      enabled: !!id,
      staleTime: 1000 * 60 * 60 * 24, // 24 jam
      onSuccess: (res) => {},
      onError: (res) => {},
    }
  );

  return { data, isFetching, setParams, dataTa, params, dataPelanggaran };
}

export function useTa(id) {
  let [params, setParams] = useState({
    page: 1,
    pageSize: 10,
    semester: "",
    ta: "",
  });

  syncToken();

  let { data: dataTa } = useQuery(
    ["list_tahun_ajaran"],
    () => listtahunajaran(),
    {
      enabled: !!id,
      staleTime: 1000 * 60 * 60 * 24, // 24 jam
      select: (res) => res.data.data,
    }
  );

  // let { data, isFetching } = useQuery(['/guru/pelanggaran/detail', [params, id]], () => axios.get(`/guru/pelanggaran/list/${id}`, {params}).then(res => res.data), {
  //   enabled: !!id,
  //   staleTime: 1000 * 60 * 60 * 24, // 24 jam
  //   onSuccess: (res) => {
  //   },
  //   onError: (res) => {
  //   }
  // })

  return { setParams, dataTa, params };
}

export function useListHasilUjian(id) {
  let [params, setParams] = useState({
    nama_mapel: "",
    judul_ujian: "",
    page: 1,
    pageSize: 10,
  });
  syncToken();

  let { data, isFetching } = useQuery(
    [`/guru/siswa/hasil-ujian/detail`, params],
    () => axios.get(`/guru/siswa/hasil-ujian/${id}`, { params }).then((res) => res.data),
    {
      enabled: !!id,
      staleTime: 1000 * 60 * 60 * 24, // 24 jam
      onSuccess: (res) => {},
      onError: (res) => {},
    }
  );

  return { data, isFetching, params, setParams };
}
