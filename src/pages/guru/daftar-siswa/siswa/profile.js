import useToast from "../../../../hook/useToast";
import axios, { syncToken } from "../../../../api/axiosClient";
import { useMutation, useQuery, useQueryClient } from "react-query";

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

// const getNilaiDetail = async (mapelId, siswaId) => {
//   return axios.get(`/guru/siswa/detail-hasil-belajar/${mapelId}/${siswaId}`);
// };

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
