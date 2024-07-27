//guru

import { useMutation, useQuery, useQueryClient } from "react-query";
import axios from "../axiosClient";
import { syncToken } from "../axiosClient";
import { toast } from "react-toastify";
export function listUjian(params) {
  return axios.get("/guru/ujian/list", { params });
}

export function createUjian(payload) {
  return axios.post("/guru/ujian/create", payload);
}

export function deleteUjian(id) {
  return axios.delete(`guru/ujian/delete/${id}`);
}

export function detailUjian(id) {
  return axios.get(`guru/ujian/detail/${id}`);
}

export function updateUjian(id, values) {
  let payload = values.payload[0];

  return axios.put(`guru/ujian/update/${id}`, payload);
}

export const useCreatePenilaian = () => {
  let queryClient = useQueryClient();

  const mutate = useMutation(
    (payload) => {
      return axios.post(`/guru/nilai/create`, {
        id: payload.id,
        waktu_mulai: payload.waktu_mulai,
        waktu_selesai: payload.waktu_selesai,
        kelas_id: payload.kelas_id,
        durasi : payload.durasi
      });
    },
    {
      onSuccess: (response) => {
        queryClient.invalidateQueries("/ujian/list");
        return toast.success(response?.data?.msg, {
          position: "top-right",
          autoClose: 1000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "colored",
        });
      },

      onError: (error) => {
        alert("ok");
      },
    }
  );
  return mutate;
};

export function listPenilaianMateri(params) {
  syncToken();
  return axios.get("/guru/nilai/list/teacher", { params });
}

export const usePenilaian = (payload) => {
  const { isLoading, data, isFetching } = useQuery(
    ["/guru/nilai/list/teacher", payload],
    () => listPenilaianMateri(payload),
    {
      keepPreviousData: true,
      select: (response) => response.data,
      staleTime: 60 * 1000 * 10,
    }
  );

  return { isLoading, data, isFetching };
};
