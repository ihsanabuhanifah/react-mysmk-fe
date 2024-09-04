import { useState, useEffect } from "react";
import { useMutation, useQuery, useQueryClient } from "react-query";
import axios from "../axiosClient";
import { syncToken } from "../axiosClient";
import useToast from "../../hook/useToast";
import usePage from "../../hook/usePage";
import { usePagination } from "../../hook/usePagination";
import { useNavigate } from "react-router-dom";
import { saveAs } from "file-saver";
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
    page: 1,
    pageSize: 10,
    dariTanggal: null,
    sampaiTanggal: null,
    status_kehadiran: null,
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
    params,
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
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { mutate, isLoading } = useMutation(
    (payload) => createLaporanPkl(payload),
    {
      onSuccess: (response) => {
        console.log(response);
        successToast(response);
        queryClient.invalidateQueries("/santri/laporan-harian-pkl/list");
        navigate("/siswa/laporan-pkl");
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
  const queryClient = useQueryClient();

  const { mutate, isLoading } = useMutation(
    (payload) => createLaporanDiniyyah(payload),
    {
      onSuccess: (response) => {
        console.log(response);
        successToast(response);
        queryClient.invalidateQueries(["/santri/laporan-diniyyah/detailPkl/"]);
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

export function getLaporanPklDiniyyahDetail(id) {
  syncToken();
  return axios.get(`/santri/laporan-diniyyah/detailPkl/${id}`);
}
export const useLaporanPklDiniyyahDetail = (id) => {
  const { data, isLoading, isFetching } = useQuery(
    ["/santri/laporan-diniyyah/detailPkl/", id],
    () => getLaporanPklDiniyyahDetail(id),
    {
      enabled: id !== undefined,
      select: (response) => response.data.data,
    }
  );
  return { data, isLoading, isFetching };
};
export function updateLaporanDiniyyah(id, payload) {
  syncToken();
  return axios.put(`/santri/laporan-diniyyah/update/${id}`, payload);
}
export const useUpdateLaporanDiniyyah = (id) => {
  const queryClient = useQueryClient();
  const { successToast, warningToast } = useToast();

  const { mutate, isLoading } = useMutation(
    (payload) => axios.put(`/santri/laporan-diniyyah/update/${id}`, payload),
    {
      onSuccess: (response) => {
        console.log(response);
        successToast(response);
        queryClient.invalidateQueries("/santri/laporan-diniyyah/detail");
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

export const useDownloadPdf = () => {
  const { successToast, warningToast } = useToast();

  const { mutate, isLoading } = useMutation(
    () =>
      axios.get(`/santri/laporan-harian-pkl/downdload-pdf?bulan=8&tahun=2024`, {
        responseType: "blob", // tambahkan ini untuk memastikan response berbentuk blob
      }),
    {
      onSuccess: (response) => {
        const contentDisposition = response.headers["content-disposition"];
        const filename = contentDisposition
          ? contentDisposition.split("filename=")[1].replace(/"/g, "")
          : "Laporan_PKL.pdf"; 

        const blob = new Blob([response.data], { type: "application/pdf" });
        saveAs(blob, filename); 
        successToast("PDF berhasil didownload!");
      },
      onError: (err) => {
        console.error("Error saat mendownload PDF:", err);
        warningToast("Gagal mendownload PDF.");
      },
    }
  );

  return { mutate, isLoading };
};
