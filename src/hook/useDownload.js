import fileDownload from "js-file-download";
import React from "react";
import { toast } from "react-toastify";

export default function useDownload({ filename, onDownload }) {
  let [isLoadingDownload, setIsLoadingDownload] = React.useState(false);

  async function handleDownload() {
    setIsLoadingDownload(true);
    try {
      const result = await onDownload();
      setIsLoadingDownload(false);
      toast.success('Download File Berhasil', {
        position: "top-right",
        autoClose: 1000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
      });
      fileDownload(result.data, filename);
      
    } catch (error) {
      console.log(error);

      setIsLoadingDownload(false);
      toast.error('Ada Kesalahan', {
        position: "top-right",
        autoClose: 1000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
      });
      
    }
  }
  return { isLoadingDownload, handleDownload };
}
