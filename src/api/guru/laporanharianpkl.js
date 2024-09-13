
import axios from "axios";
import axiosClient, { syncToken } from "../axiosClient";
import useToast from "../../hook/useToast";
import { useMutation } from "react-query";

import { saveAs } from "file-saver";
import { usePagination } from "../../hook/usePagination";

export function listLaporanPkl(params) {
  syncToken();
  return axiosClient.get("/guru/laporan-harian-pkl/list", { params });
}

export function createLaporanPkl(payload) {
  syncToken();
  console.log(payload);
  
  return axiosClient.post("/guru/laporan-harian-pkl/create", payload);
}
export function updateLaporanPkl(id, values) {
  syncToken();
  // let payload = values.payload[0];
  console.log('update pkl tes', values)
  return axiosClient.put(`guru/laporan-harian-pkl/update/${id}`, values);
}

export function deleteLaporanPkl(id) {
  syncToken();
  return axiosClient.delete(`guru/laporan-harian-pkl/delete/${id}`);
}

export function detailLaporanPkl(id)  {
  syncToken();
  console.log("api detail");
  return axiosClient.get(`guru/laporan-harian-pkl/detail/${id}`);
}
// export  function downloadPdf(id){
//   syncToken();
//   return axiosClient.get(`/guru/laporan-harian-pkl/downdload-pdf/${id}`,{
//     responseType:"blob"
//   }),
//   {
//     onSuccess: (response) => {
//       const contentDisposition = response.headers["content-disposition"];
//       const filename = contentDisposition
//         ? contentDisposition.split("filename=")[1].replace(/"/g, "")
//         : "Laporan_PKL.pdf"; 

//       const blob = new Blob([response.data], { type: "application/pdf" });
//       saveAs(blob, filename); 
//       successToast("PDF berhasil didownload!");
//     },
//     onError: (err) => {
//       console.error("Error saat mendownload PDF:", err);
//       warningToast("Gagal mendownload PDF.");
//     },
//   }
// }

export const useDownloadPdf = (id) => {
  syncToken();
  const { successToast, warningToast } = useToast();

  const { mutate, isLoading } = useMutation(
    () =>
      axiosClient.get(`/guru/laporan-harian-pkl/downdload-pdf/${id}`, {
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

// export const useDownloadPdf = () => {
//   const { successToast, warningToast } = useToast();
//   const defParams = {
//     bulan: null,
//     tahun: 2024,
//   };
//   const { params, setParams, handleFilter, handleClear, filterParams } =
//     usePagination(defParams);
//   const { mutate, isLoading } = useMutation(
//     () =>
//       axiosClient.get(`/guru/laporan-harian-pkl/downdload-pdf`, {
//         params: params,
//         responseType: "blob",
//       }),
//     {
//       onSuccess: (response) => {
//         console.log("dada", response.headers)
//         console.log("ddd", response)
//         const contentDisposition = response.headers["Content-Disposition"];
//         let filename = "Laporan_JURNAL_PKL.pdf";
//         console.log(contentDisposition, "ini");
//         if (contentDisposition) {
//           const filenameMatch = contentDisposition.match(/filename="(.+)"/);
//           if (filenameMatch.length > 1) {
//             filename = filenameMatch[1];
//           }
//         }

//         const blob = new Blob([response.data], { type: "application/pdf" });
//         saveAs(blob, filename);
//         successToast("PDF berhasil didownload!");
//       },
//       onError: (err) => {
//         console.error("Error saat mendownload PDF:", err);
//         warningToast("Gagal mendownload PDF.");
//       },
//     }
//   );

//   return {
//     mutate,
//     isLoading,
//     params,
//     setParams,
//     handleFilter,
//     handleClear,
//     filterParams,
//   };
// };

export const useDownloadPdfBulanan = (id) => {
  syncToken();
  const { successToast, warningToast } = useToast();

  const { mutate, isLoading } = useMutation(
    () =>
      axiosClient.get(`guru/laporan-harian-pkl/downdload-pdf-bulanan/${id}`, {
        responseType: "blob",
      }),
    {
      onSuccess: (response) => {
        console.log(response.data);
        const contentDisposition = response.headers["content-disposition"];
        const filename = contentDisposition
          ? contentDisposition.split("filename=")[1].replace(/"/g, "")
          : "Laporan_JURNAL_PKL.pdf";

        // Create a Blob from the PDF bytes
        const blob = new Blob([response.data], { type: "application/pdf" });

        // Use file-saver to save the file
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