import axios from "axios";
import axiosClient, { syncToken } from "../axiosClient";
import useToast from "../../hook/useToast";
import { useMutation, useQuery } from "react-query";

import { saveAs } from "file-saver";
import { usePagination } from "../../hook/usePagination";

export function listLaporanPkl(params) {
  syncToken();
  return axiosClient.get("/guru/laporan-harian-pkl/list", { params });
}

export const useLaporanPklList = () => {
  let defParams = {
    page: 1,
    pageSize: 10,
    dariTanggal: null,
    sampaiTanggal: null,
    status_kehadiran: null,
    keyword: "",
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
  console.log(filterParams);

  const { isLoading, data, isFetching } = useQuery(
    ["/guru/laporan-harian-pkl/list", filterParams],
    () => listLaporanPkl(filterParams),
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

export function createLaporanPkl(payload) {
  syncToken();
  console.log(payload);

  return axiosClient.post("/guru/laporan-harian-pkl/create", payload);
}
export function updateLaporanPkl(id, values) {
  syncToken();
  // let payload = values.payload[0];
  console.log("update pkl tes", values);
  return axiosClient.put(`guru/laporan-harian-pkl/update/${id}`, values);
}

export function deleteLaporanPkl(id) {
  syncToken();
  return axiosClient.delete(`guru/laporan-harian-pkl/delete/${id}`);
}

export function detailLaporanPkl(id) {
  syncToken();
  console.log("api detail");
  return axiosClient.get(`guru/laporan-harian-pkl/detail/${id}`);
}

export const useDownloadPdf = () => {
  const { successToast, warningToast } = useToast();
  const defParams = {
    bulan: null,
    tahun: 2024,
    studentId: null,
  };
  // console.log(student_id);

  const { filterParams, setParams, params } = usePagination(defParams);
  const { mutate, isLoading } = useMutation(
    console.log("param", params),
    () =>
      axios.get(`/guru/laporan-harian-pkl/download-pdf`, {
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

// export const useDownloadPdf = () => {
//   const { successToast, warningToast } = useToast();

//   const { mutate, isLoading } = useMutation(
//     ({ id, params }) =>
//       axios.get(`/guru/laporan-harian-pkl/downdload-pdf/${id}`, {
//         params: { bulan: params.bulan, tahun: params.tahun },
//         responseType: "json",
//       }),
//     {
//       onSuccess: (response) => {
//         const data = response.data.data;
//         console.log(data);
//         // Generate HTML for PDF with inline CSS
//         const generateHtml = () => {
//           return `
//             <div style="font-family: Arial, sans-serif; font-size: 14px;">
//               <h1 style="text-align: center; font-size: 24px;">Laporan PKL ${
//                 data[0].siswa.nama_siswa
//               }</h1>
//               <p style="text-align: center; font-size: 16px;">Data laporan Bulan ${dayjs(
//                 data[0].tanggal
//               ).format("MMMM")}
//               <style>
//                 .table {
//                   width: 100%;
//                   border-collapse: collapse;
//                   font-size: 14px;
//                 }
//                 .table th, .table td {
//                   padding: 10px;
//                   border: 1px solid #ddd;
//                   text-align: left;
//                 }
//                 .table thead {
//                   background-color: #f2f2f2;
//                 }
//                 .table thead th {
//                   font-weight: bold;
//                 }
//                 .foto {
//                   width: 100px;
//                   height: auto;
//                 }
//               </style>
//               <table class="table">
//                 <thead>
//                   <tr>
//                     <th>No</th>
//                     <th>Judul Kegiatan</th>
//                     <th>Isi Laporan</th>
//                     <th>Tanggal</th>
//                     <th>Status</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   ${data
//                     .map(
//                       (laporan, index) => `
//                       <tr>
//                         <td>${index + 1}</td>
//                         <td>${laporan.judul_kegiatan}</td>
//                         <td>${laporan.isi_laporan}</td>
//                         <td>${laporan.tanggal}</td>
//                         <td>${laporan.status}</td>
//                       </tr>
//                     `
//                     )
//                     .join("")}
//                 </tbody>
//               </table>
//             </div>
//           `;
//         };

//         const content = generateHtml(data);

//         const opt = {
//           margin: 1,
//           filename: `Laporan_PKL_${data[0].siswa.nama_siswa}-${dayjs(
//             data[0].tanggal
//           ).format("MMMM")}.pdf`,
//           html2canvas: { scale: 2 },
//           jsPDF: { unit: "in", format: "letter", orientation: "portrait" },
//         };

//         html2pdf().from(content).set(opt).save();
//         successToast("PDF berhasil didownload!");
//       },
//       onError: (err) => {
//         console.error("Error saat mendownload PDF:", err);
//         warningToast("Gagal mendownload PDF.");
//       },
//     }
//   );

//   return { mutate, isLoading };
// };

// export const useDownloadPdf = (studentId, bulan, tahun) => {
//   const { successToast, warningToast } = useToast();
//   console.log(studentId)
//   console.log(bulan)

//   const { mutate, isLoading } = useMutation(
//     () =>
//       axios.get(`/guru/laporan-harian-pkl/download-pdf/${studentId}`, {
//         params: { bulan, tahun },
//         responseType: "json",
//       }),
//     {
//       onSuccess: (response) => {
//         const data = response.data.data;

//         const generateHtml = () => {
//           return `
//             <div style="font-family: Arial, sans-serif; font-size: 14px;">
//               <h1 style="text-align: center; font-size: 24px;">Laporan PKL ${
//                 data[0].siswa.nama_siswa
//               }</h1>
//               <p style="text-align: center; font-size: 16px;">Data laporan Bulan ${dayjs(
//                 data[0].tanggal
//               ).format("MMMM")}</p>
//               <style>
//                 .table { width: 100%; border-collapse: collapse; font-size: 14px; }
//                 .table th, .table td { padding: 10px; border: 1px solid #ddd; text-align: left; }
//                 .table thead { background-color: #f2f2f2; }
//                 .table thead th { font-weight: bold; }
//               </style>
//               <table class="table">
//                 <thead>
//                   <tr>
//                     <th>No</th>
//                     <th>Judul Kegiatan</th>
//                     <th>Isi Laporan</th>
//                     <th>Tanggal</th>
//                     <th>Status</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   ${data
//                     .map(
//                       (laporan, index) => `
//                       <tr>
//                         <td>${index + 1}</td>
//                         <td>${laporan.judul_kegiatan}</td>
//                         <td>${laporan.isi_laporan}</td>
//                         <td>${laporan.tanggal}</td>
//                         <td>${laporan.status}</td>
//                       </tr>`
//                     )
//                     .join("")}
//                 </tbody>
//               </table>
//             </div>
//           `;
//         };

//         const content = generateHtml();

//         const opt = {
//           margin: 1,
//           filename: `Laporan_PKL_${data[0].siswa.nama_siswa}-${dayjs(
//             data[0].tanggal
//           ).format("MMMM")}.pdf`,
//           html2canvas: { scale: 2 },
//           jsPDF: { unit: "in", format: "letter", orientation: "portrait" },
//         };

//         html2pdf().from(content).set(opt).save();
//         successToast("PDF berhasil didownload!");
//       },
//       onError: (err) => {
//         console.error("Error saat mendownload PDF:", err);
//         warningToast("Gagal mendownload PDF.");
//       },
//     }
//   );

//   return { mutate, isLoading };
// };

export const useDownloadPdfBulanan = (id) => {
  const { successToast, warningToast } = useToast();

  const { mutate, isLoading } = useMutation(
    () =>
      axios.get(`/guru/laporan-harian-pkl/downdload-pdf-bulanan/${id}`, {
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
