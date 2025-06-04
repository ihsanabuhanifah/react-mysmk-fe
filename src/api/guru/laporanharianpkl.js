import axios from "axios";
import axiosClient, { syncToken } from "../axiosClient";
import useToast from "../../hook/useToast";
import { useMutation, useQuery } from "react-query";
import { usePagination } from "../../hook/usePagination";
import dayjs from "dayjs";
import { html2pdf } from "html2pdf.js";

export function listLaporanPkl(params) {
  syncToken();
  return axiosClient.get("/guru/laporan-harian-pkl/list", { params });
}
export function getLaporanPkl(params) {
  syncToken();
  return axios.get("/guru/laporan-harian-pkl/list", { params });
}
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
    ["/guru/laporan-harian-pkl/list", filterParams],
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

// export const useDownloadPdf = () => {
//   const { successToast, warningToast } = useToast();
//   const defParams = {
//     bulan: null,
//     tahun: 2024,
//     // tahun: null,
//     // studentId: null,
//     studentId:null
//   };
//   // console.log(student_id);

//   const { filterParams, setParams, params } = usePagination(defParams);
//   const { mutate, isLoading } = useMutation(
//     console.log("param", params),
//     () =>
//       axios.get(`/guru/laporan-harian-pkl/download-pdf`, {
//         params: params,
//         responseType: "json",
//       }),
//     {
//       onSuccess: (response) => {
//         console.log('berhasil');
        
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

//   return { mutate, isLoading, filterParams, setParams, params };
// };

export const useDownloadPdf = () => {
  const { successToast, warningToast } = useToast();
  const defParams = {
    bulan: null,
    tahun: 2024,
    studentId : null
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
console.log(data)
        // Generate HTML untuk PDF
        const generateHtml = (data) => {
          return `
            <div style="font-family: Arial, sans-serif; font-size: 14px; padding: 20px;">
              <div style="text-align: center;">
                <img  alt="Kop Surat" style="width: 100%; height: auto;" />
              </div>
              <h1 style="text-align: center; font-size: 24px;">Laporan PKL ${data[0]?.siswa?.nama_siswa || "Belum memiliki data"}</h1>
              <p style="text-align: center; font-size: 16px;">
                Data laporan Bulan ${dayjs(data[0]?.tanggal).format("MMMM") || "-"}
              </p>
        
              <h2 style="margin-top: 20px;">Data Laporan Harian PKL</h2>
              <table class="ui celled table" style="width: 100%; border-collapse: collapse; font-size: 14px;">
                <thead>
                  <tr>
                    <th style="padding: 10px; text-align: left; border: 1px solid black;">No</th>
                    <th style="padding: 10px; text-align: left; border: 1px solid black;">Judul Kegiatan</th>
                    <th style="padding: 10px; text-align: left; border: 1px solid black;">Isi Laporan</th>
                    <th style="padding: 10px; text-align: left; border: 1px solid black;">Tanggal</th>
                    <th style="padding: 10px; text-align: left; border: 1px solid black;">Status</th>
                  </tr>
                </thead>
                <tbody>
                  ${
                    data.length > 0
                      ? data
                          .map(
                            (laporan, index) => `
                            <tr>
                              <td style="padding: 8px; text-align: center; border: 1px solid black;">${index + 1}</td>
                              <td style="padding: 8px; border: 1px solid black;">${laporan.judul_kegiatan || "Belum memiliki data"}</td>
                              <td style="padding: 8px; border: 1px solid black;">${laporan.isi_laporan || "Belum memiliki data"}</td>
                              <td style="padding: 8px; text-align: center; border: 1px solid black;">${laporan.tanggal || "-"}</td>
                              <td style="padding: 8px; text-align: center; border: 1px solid black;">${laporan.status || "-"}</td>
                            </tr>`
                          )
                          .join("")
                      : `<tr><td colspan="5" style="text-align: center; padding: 8px;">Tidak ada data laporan PKL.</td></tr>`
                  }
                </tbody>
              </table>
        
              <h2 style="margin-top: 40px;">Data Laporan Diniyyah</h2>
              <table class="ui celled table" style="width: 100%; border-collapse: collapse; font-size: 14px;">
                <thead>
                  <tr>
                    <th style="padding: 10px; text-align: left; border: 1px solid black;">No</th>
                    <th style="padding: 10px; text-align: left; border: 1px solid black;">Dari Surat</th>
                    <th style="padding: 10px; text-align: left; border: 1px solid black;">Sampai Surat</th>
                    <th style="padding: 10px; text-align: left; border: 1px solid black;">Dari Ayat</th>
                    <th style="padding: 10px; text-align: left; border: 1px solid black;">Sampai Ayat</th>
                    <th style="padding: 10px; text-align: left; border: 1px solid black;">Dzikir Pagi</th>
                    <th style="padding: 10px; text-align: left; border: 1px solid black;">Dzikir Petang</th>
                    <th style="padding: 10px; text-align: left; border: 1px solid black;">Sholat Shubuh</th>
                    <th style="padding: 10px; text-align: left; border: 1px solid black;">Sholat Dzuhur</th>
                    <th style="padding: 10px; text-align: left; border: 1px solid black;">Sholat Ashar</th>
                    <th style="padding: 10px; text-align: left; border: 1px solid black;">Sholat Magrib</th>
                    <th style="padding: 10px; text-align: left; border: 1px solid black;">Sholat Isya</th>
                  </tr>
                </thead>
                <tbody>
                  ${
                    data.length > 0
                      ? data
                          .map((laporan, index) =>
                            laporan.laporan_diniyyah_harian && laporan.laporan_diniyyah_harian.length > 0
                              ? laporan.laporan_diniyyah_harian
                                  .map(
                                    (diniyyah, diniIndex) => `
                                    <tr>
                                      <td style="padding: 8px; text-align: center; border: 1px solid black;">${index + 1}</td>
                                      <td style="padding: 8px; border: 1px solid black;">${diniyyah.dari_surat || "-"}</td>
                                      <td style="padding: 8px; border: 1px solid black;">${diniyyah.sampai_surat || "-"}</td>
                                      <td style="padding: 8px; text-align: center; border: 1px solid black;">${diniyyah.dari_ayat || "-"}</td>
                                      <td style="padding: 8px; text-align: center; border: 1px solid black;">${diniyyah.sampai_ayat || "-"}</td>
                                      <td style="padding: 8px; text-align: center; border: 1px solid black;">${diniyyah.dzikir_pagi ? "Ya" : "Tidak"}</td>
                                      <td style="padding: 8px; text-align: center; border: 1px solid black;">${diniyyah.dzikir_petang ? "Ya" : "Tidak"}</td>
                                      <td style="padding: 8px; text-align: center; border: 1px solid black;">${diniyyah.sholat_shubuh || "-"}</td>
                                      <td style="padding: 8px; text-align: center; border: 1px solid black;">${diniyyah.sholat_dzuhur || "-"}</td>
                                      <td style="padding: 8px; text-align: center; border: 1px solid black;">${diniyyah.sholat_ashar || "-"}</td>
                                      <td style="padding: 8px; text-align: center; border: 1px solid black;">${diniyyah.sholat_magrib || "-"}</td>
                                      <td style="padding: 8px; text-align: center; border: 1px solid black;">${diniyyah.sholat_isya || "-"}</td>
                                    </tr>`
                                  )
                                  .join("")
                              : `<tr><td colspan="12" style="text-align: center; padding: 8px;">Tidak ada data diniyyah untuk hari ini.</td></tr>`
                          )
                          .join("")
                      : `<tr><td colspan="12" style="text-align: center; padding: 8px;">Tidak ada data laporan diniyyah.</td></tr>`
                  }
                </tbody>
              </table>
            </div>
          `;
        };
        

        const content = generateHtml(data);

        const opt = {
          margin: 1,
          filename: `Laporan_PKL_${data[0]?.siswa?.nama_siswa || "No_Data"}_${dayjs().format("MMMM")}.pdf`,
          image: { type: "jpeg", quality: 0.2 },
          html2canvas: { scale: 2, useCORS: true },
          jsPDF: { unit: "in", format: "a4", orientation: "landscape" },
        };

        html2pdf()
          .from(content)
          .set(opt)
          .save()
          .then(() => {
            successToast("PDF berhasil didownload!");
          })
          .catch((err) => {
            console.error("Error saat mendownload PDF:", err);
            warningToast("Gagal mendownload PDF.");
          });
      },
      onError: (err) => {
        console.error("Error saat mendownload PDF:", err);
        warningToast("Gagal mendownload PDF.");
      },
    }
  );

  return { mutate, isLoading, filterParams, setParams, params };
};


// export const useDownloadPdfBulanan = (id) => {
//   const { successToast, warningToast } = useToast();

//   const { mutate, isLoading } = useMutation(
//     () =>
//       axios.get(`/guru/laporan-harian-pkl/downdload-pdf-bulanan/${id}`, {
//         responseType: "json",
//       }),
//     {
//       onSuccess: (response) => {
//         console.log(response.data);

//         // Generate HTML for PDF with inline CSS
//         const generateHtml = (data) => {
//           let data1 = data.data;
//           return `
//             <div style="font-family: Arial, sans-serif; font-size: 14px;">
//               <h1 style="text-align: center; font-size: 24px;">Laporan PKL ${
//                 data1.nama_siswa
//               }</h1>
//               <p style="text-align: center; font-size: 16px;">Dari tanggal ${
//                 data1.tanggal_mulai
//               } sampai dengan ${data1.tanggal_selesai}</p>
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
//               </style>
//               <table class="table">
//                 <thead>
//                   <tr>
//                     <th>No</th>
//                     <th>Judul Laporan</th>
//                     <th>Isi Laporan</th>
//                     <th>Tanggal Dibuat</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   ${data1.laporan
//                     .map(
//                       (laporan, index) => `
//                       <tr>
//                         <td>${index + 1}</td>
//                         <td>${laporan.judul_kegiatan}</td>
//                         <td>${laporan.isi_laporan}</td>
//                         <td>${laporan.tanggal_dibuat}</td>
//                       </tr>
//                     `
//                     )
//                     .join("")}
//                 </tbody>
//               </table>
//             </div>
//           `;
//         };

//         const content = generateHtml(response.data);

//         const opt = {
//           margin: 1,
//           filename: `Laporan_PKL_${response.data.data.nama_siswa}-${response.data.data.tanggal_mulai}/${response.data.data.tanggal_selesai}.pdf`,
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