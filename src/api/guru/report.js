//guru

import { useMutation, useQuery, useQueryClient } from "react-query";
import axios from "../axiosClient";
import { syncToken } from "../axiosClient";
import useToast from "../../hook/useToast";
import { usePagination } from "../../hook/usePagination";
export function listUjian(params) {
  return axios.get("/guru/ujian/list", { params });
}

export const useGenerateReport = () => {
  let queryClient = useQueryClient();
  const { successToast, warningToast } = useToast();
  const mutate = useMutation(
    (payload) => {
      return axios.post(`/guru/report/generate`, payload);
    },
    {
      onSuccess: (response) => {
        queryClient.invalidateQueries("/guru/nilai/list/teacher");
        successToast(response);
      },

      onError: (error) => {
        warningToast(error);
      },
    }
  );
  return mutate;
};

export function listReport(params) {
  syncToken();
  return axios.get("/guru/report/list", { params });
}

export const useListReport = () => {
  const {
    params,
    keyword,
    setParams,
    handleFilter,
    handleClear,
    handlePageSize,
    handlePage,
    filterParams,
    handlePayload,
    handleSearch,
  } = usePagination({
    nama_siswa: "",
    kelas_id: "",
    mapel_id: "",
    ta_id: "",
    page: 1,
    pageSize: 10,
  });

  const { isLoading, data, isFetching } = useQuery(
    ["/guru/nilai/list/teacher", [filterParams]],
    () => listReport(filterParams),
    {
      keepPreviousData: true,
      select: (response) => response.data,
      refetchOnWindowFocus : false,
      staleTime: 1000 * 60 * 60 * 5,
    }
  );

  return {
    isLoading,
    data,
    isFetching,
    params,
    keyword,
    setParams,
    handleFilter,
    handleClear,
    handlePageSize,
    handlePage,
    filterParams,
    handleSearch,
    handlePayload,
  };
};
