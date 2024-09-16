import { useState, useEffect } from "react";
import { useMutation, useQuery, useQueryClient } from "react-query";
import axios from "../axiosClient";
import { syncToken } from "../axiosClient";
import useToast from "../../hook/useToast";
import usePage from "../../hook/usePage";
import { usePagination } from "../../hook/usePagination";
import { useNavigate } from "react-router-dom";
import { saveAs } from "file-saver";
import html2pdf from "html2pdf.js";
import dayjs from "dayjs";
import "dayjs/locale/id";
import { formatTanggalIndo } from "../../utils/formatTanggal";
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
    ["/santri/laporan-harian-pkl/list", filterParams],
    () => getLaporanPkl(filterParams),
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
      keepPreviousData: true
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
  const defParams = {
    bulan: null,
    tahun: 2024,
  };

  const { filterParams, setParams, params } = usePagination(defParams);
  const { mutate, isLoading } = useMutation(
    () =>
      axios.get(`/santri/laporan-harian-pkl/downdload-pdf`, {
        params: params,
        responseType: "json",
      }),
    {
      onSuccess: (response) => {
        const data = response.data.data;
        console.log(data);
        // Generate HTML for PDF with inline CSS
        const generateHtml = () => {
          return `
            <div style="font-family: Arial, sans-serif; font-size: 14px;">
              <h1 style="text-align: center; font-size: 24px;">Laporan PKL ${
                data[0].siswa.nama_siswa
              }</h1>
              <p style="text-align: center; font-size: 16px;">Data laporan Bulan ${dayjs(
                data[0].tanggal
              ).format("MMMM")}
              <style>
                .table {
                  width: 100%;
                  border-collapse: collapse;
                  font-size: 14px;
                }
                .table th, .table td {
                  padding: 10px;
                  border: 1px solid #ddd;
                  text-align: left;
                }
                .table thead {
                  background-color: #f2f2f2;
                }
                .table thead th {
                  font-weight: bold;
                }
                .foto {
                  width: 100px;
                  height: auto;
                }
              </style>
              <table class="table">
                <thead>
                  <tr>
                    <th>No</th>
                    <th>Judul Kegiatan</th>
                    <th>Isi Laporan</th>
                    <th>Tanggal</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  ${data
                    .map(
                      (laporan, index) => `
                      <tr>
                        <td>${index + 1}</td>
                        <td>${laporan.judul_kegiatan}</td>
                        <td>${laporan.isi_laporan}</td>
                        <td>${laporan.tanggal}</td>
                        <td>${laporan.status}</td>
                      </tr>
                    `
                    )
                    .join("")}
                </tbody>
              </table>
            </div>
          `;
        };

        const content = generateHtml(data);

        const opt = {
          margin: 1,
          filename: `Laporan_PKL_${data[0].siswa.nama_siswa}-${dayjs(
            data[0].tanggal
          ).format("MMMM")}.pdf`,
          html2canvas: { scale: 2 },
          jsPDF: { unit: "in", format: "letter", orientation: "portrait" },
        };

        html2pdf().from(content).set(opt).save();
        successToast("PDF berhasil didownload!");
      },
      onError: (err) => {
        console.error("Error saat mendownload PDF:", err);
        warningToast("Gagal mendownload PDF.");
      },
    }
  );

  return { mutate, isLoading, filterParams, setParams, params };
};



export const useDownloadPdfBulanan = () => {
  const { successToast, warningToast } = useToast();

  const { mutate, isLoading } = useMutation(
    () =>
      axios.get(`/santri/laporan-harian-pkl/downdload-data-bulanan`, {
        responseType: "json",
      }),
    {
      onSuccess: (response) => {
        console.log(response.data);

        // Generate HTML for PDF with inline CSS
        const generateHtml = (data) => {
          let data1 = data.data;
          return `
            <div style="font-family: Arial, sans-serif; font-size: 14px;">
              <h1 style="text-align: center; font-size: 24px;">Laporan PKL ${
                data1.nama_siswa
              }</h1>
              <p style="text-align: center; font-size: 16px;">Dari tanggal ${
                data1.tanggal_mulai
              } sampai dengan ${data1.tanggal_selesai}</p>
              <style>
                .table {
                  width: 100%;
                  border-collapse: collapse;
                  font-size: 14px;
                }
                .table th, .table td {
                  padding: 10px;
                  border: 1px solid #ddd;
                  text-align: left;
                }
                .table thead {
                  background-color: #f2f2f2;
                }
                .table thead th {
                  font-weight: bold;
                }
              </style>
              <table class="table">
                <thead>
                  <tr>
                    <th>No</th>
                    <th>Judul Laporan</th>
                    <th>Isi Laporan</th>
                    <th>Tanggal Dibuat</th>
                  </tr>
                </thead>
                <tbody>
                  ${data1.laporan
                    .map(
                      (laporan, index) => `
                      <tr>
                        <td>${index + 1}</td>
                        <td>${laporan.judul_kegiatan}</td>
                        <td>${laporan.isi_laporan}</td>
                        <td>${laporan.tanggal_dibuat}</td>
                      </tr>
                    `
                    )
                    .join("")}
                </tbody>
              </table>
            </div>
          `;
        };

        const content = generateHtml(response.data);

        const opt = {
          margin: 1,
          filename: `Laporan_PKL_${response.data.data.nama_siswa}-${response.data.data.tanggal_mulai}/${response.data.data.tanggal_selesai}.pdf`,
          html2canvas: { scale: 2 },
          jsPDF: { unit: "in", format: "letter", orientation: "portrait" },
        };

        html2pdf().from(content).set(opt).save();
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
