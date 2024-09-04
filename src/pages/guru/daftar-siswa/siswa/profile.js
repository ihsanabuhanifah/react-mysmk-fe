import useToast from "../../../../hook/useToast";
import axios, { syncToken } from "../../../../api/axiosClient";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { useCallback, useState } from "react";
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

// export function useNilaiSiswa(id) {
//   syncToken();
//   console.log(id);
//   return axios.get(`guru/siswa/hasil-belajar/${id}` );
// }

// const getNilaiDetail = async (mapelId, siswaId) => {
//   return axios.get(`/guru/siswa/detail-hasil-belajar/${mapelId}/${siswaId}`);
// };


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
}

export function useNilaiDetail(mapelId, siswaId) {
  const { data, isLoading, error } = useQuery(
    ["guru/siswa/detail-hasil-belajar", mapelId, siswaId],
    () => getNilaiDetail(mapelId, siswaId),
    {
      enabled: !!mapelId && !!siswaId,
      staleTime : 1000 * 60 * 60 * 24,
    }
  );
  return { data, isLoading, error };
}

// export function useNilaiDetail(mapelId, siswaId) {
//   return useQuery(["nilaiDetailSiswa", mapelId, siswaId], async () => {
//     const { data } = await axios.get(
//       `/guru/siswa/detail-hasil-belajar/${mapelId}/${siswaId}`
//     );
//     console.log("Data detail nilai siswa:", data);
//     return data;
//   });
// }

// const getPelanggaranSiswa = async (id) => {
//   const response = await axios.get(`/guru/pelanggaran/list/${id}`);
//   return response.data; // Hanya mengembalikan data
// };

// export function usePelanggaranSiswa(id) {
//   const { data, isLoading, error } = useQuery(
//     ["/guru/pelanggaran/list", id],
//     () => getPelanggaranSiswa(id)
//   );
//   return { data, isLoading, error };
// }

// Fungsi untuk mendapatkan data pelanggaran siswa dengan pagination
// const getPelanggaranSiswa = async ({ queryKey }) => {
//   const [_, id, params] = queryKey;
//   const response = await axios.get(`/guru/pelanggaran/list/${id}`, { params });
//   return response.data; // Hanya mengembalikan data
// };

// export function usePelanggaranSiswa(id, initialParams = {}) {
//   const [params, setParams] = useState(initialParams);

//   const handlePayload = useCallback((newParams) => {
//     setParams((prevParams) => ({
//       ...prevParams,
//       ...newParams,
//     }));
//   }, []);

//   const handleParams = useCallback(() => {
//     return params;
//   }, [params]);

//   const { data, isLoading, error } = useQuery(
//     ["/guru/pelanggaran/list", id, params],
//     getPelanggaranSiswa,
//     {
//       enabled: !!id, // Query dijalankan hanya jika id ada
//       select: (data) => ({
//         rows: data.data?.rows || [],
//         totalCount: data.data?.count || 0,
//       }),
//     }
//   );

//   return {
//     data,
//     isLoading,
//     error,
//     payload: params,
//     handlePayload,
//     handleParams,
//   };
// }

export function usePelanggaranSiswa(id) {
  let [params, setParams] = useState({
    page: 1,
    pageSize: 10,
    pelanggaran: '',
    semester: '',
    ta: '',
    kat_pelanggaran: ''
  })
  
  syncToken();

  let { data: dataTa } = useQuery(
    ['list_tahun_ajaran'],
    () => listtahunajaran(),
    {
      select: (res) => res.data.data
    }
  )
  
  let { data: dataPelanggaran } = useQuery(
    ['list_pelanggaran'],
    () => listPelanggaran(),
    {
      select: (res) => res.data.data
    }
  )
  
  let { data, isFetching } = useQuery(['/guru/pelanggaran/detail', [params, id]], () => axios.get(`/guru/pelanggaran/list/${id}`, {params}).then(res => res.data), {
    onSuccess: (res) => {
    },
    onError: (res) => {
    }
  })

  return { data, isFetching, setParams, dataTa, params, dataPelanggaran }
}
