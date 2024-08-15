import { useState, useEffect } from "react";
import { useMutation, useQuery, useQueryClient } from "react-query";
import axios from "../axiosClient";
import { syncToken } from "../axiosClient";
import useToast from "../../hook/useToast";
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
  let [params, setParams] = useState({ page: 1, pageSize: 10 });
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
  };
};

export const useLaporanPklList = () => {
  let [params, setParams] = useState({ page: 1, pageSize: 10 });
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
    data,
    isFetching,
    isLoading,
  };
};

export const useLaporanPklDetail = (id) => {
  const { data, isLoading, isFetching } = useQuery(
    ["/santri/laporan-harian-pkl/detail", id],
    () => getLaporanPklDetail(id),
    {
      enabled: id !== undefined,
      select: (response) => response,
    }
  );
};
export function createLaporanPkl(payload) {
  syncToken();
  return axios.post("/santri/laporan-harian-pkl/create", payload);
}

export const useCreateLaporanPkl = () => {
  const { successToast, warningToast } = useToast();

  const mutate = useMutation((payload) => createLaporanPkl(payload), {
    onSuccess: (response) => {
      successToast(response);
    },
    onError: (err) => {
      warningToast(err);
    },
  });
  return mutate;
};
