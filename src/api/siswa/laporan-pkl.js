import { useState, useEffect } from "react";
import { useMutation, useQuery, useQueryClient } from "react-query";
import axios from "../axiosClient";
import { syncToken } from "../axiosClient";
import useToast from "../../hook/useToast";
import usePage from "../../hook/usePage";
import { usePagination } from "../../hook/usePagination";
export function getLaporanPkl(params) {
  syncToken();
  return axios.get("/santri/laporan-harian-pkl/list", { params });
}
export function getLaporanPklDetail(id) {
  syncToken();
  return axios.get(`/santri/laporan-harian-pkl/detail/${id}`);
}
export function getLokasiPkl() {
  syncToken();
  return axios.get("/santri/tempat-pkl/lokasi");
}
export const useLokasiPkl = () => {
  let { page, pageSize, setPage, setPageSize } = usePage();
  let params = {
    page,
    pageSize,
  };
  const { isLoading, data, isFetching } = useQuery(
    ["/santri/tempat-pkl/lokasi", params],
    () => getLokasiPkl(params),
    {
      keepPreviousData: true,
      select: (response) => response.data,
      staleTime: 60 * 1000 * 10,
    }
  );
  return {
    data,
    isFetching,
    isLoading,
    page,
    pageSize,
    setPage,
    pageSize,
    setPageSize,
  };
};

export const useLaporanPklList = () => {
  
  
  let defParams = {
    page : 1,
    pageSize : 10,
  };
  const {
    params,
    setParams,
    handleFilter,
    handleClear,
    handlePageSize,
    handlePage,
    filterParams,
  } = usePagination(defParams);

  const { isLoading, data, isFetching } = useQuery(
    ["/santri/laporan-harian-pkl/list", params],
    () => getLaporanPkl(params),
    {
      keepPreviousData: true,
      select: (response) => response.data,
      staleTime: 60 * 1000 * 10,
    }
  );
  return {
    setParams,
    handleFilter,
    handleClear,
    handlePageSize,
    handlePage,
    filterParams,
    data,
    isFetching,
    isLoading,
    params
  };
};

export const useLaporanPklDetail = (id) => {
  const { data, isLoading, isFetching } = useQuery(
    ["/santri/laporan-harian-pkl/detail/", id],
    () => getLaporanPklDetail(id),
    {
      enabled: id !== undefined,
      select: (response) => response.data.data,
    }
  );
  return { data, isLoading, isFetching };
};
export function createLaporanPkl(payload) {
  syncToken();
  return axios.post("/santri/laporan-harian-pkl/create", payload);
}

export const useCreateLaporanPkl = () => {
  const { successToast, warningToast } = useToast();

  const { mutate, isLoading } = useMutation(
    (payload) => createLaporanPkl(payload),
    {
      onSuccess: (response) => {
        console.log(response);
        successToast(response);
      },
      onError: (err) => {
        console.log(err, "err");
        console.log(err.Error.config.response, "err ddd");
        warningToast(err);
      },
    }
  );
  return { mutate, isLoading };
};

export function updateLaporanPkl(id, payload) {
  syncToken();
  return axios.put(`/santri/laporan-harian-pkl/update/${id}`, payload);
}
export const useUpdateLaporanPkl = (id) => {
  const queryClient = useQueryClient();
  const { successToast, warningToast } = useToast();

  const { mutate, isLoading } = useMutation(
    (payload) => axios.put(`/santri/laporan-harian-pkl/update/${id}`, payload),
    {
      onSuccess: (response) => {
        console.log(response);
        successToast(response);
        queryClient.invalidateQueries("/santri/laporan-harian-pkl/list");
      },
      onError: (err) => {
        console.log(err, "err");
        console.log(err.config.response, "err ddd");
        warningToast(err);
      },
    }
  );
  return { mutate, isLoading };
};
export function createLaporanDiniyyah(payload) {
  syncToken();
  return axios.post("/santri/laporan-diniyyah/create", payload);
}
export const useCreateLaporanDiniyyah = () => {
  const { successToast, warningToast } = useToast();

  const { mutate, isLoading } = useMutation(
    (payload) => createLaporanDiniyyah(payload),
    {
      onSuccess: (response) => {
        console.log(response);
        successToast(response);
      },
      onError: (err) => {
        console.log(err, "err");
        console.log(err.Error.config.response, "err ddd");
        warningToast(err);
      },
    }
  );
  return { mutate, isLoading };
};