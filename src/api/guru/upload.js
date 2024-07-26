//guru

import { useMutation, useQueryClient } from "react-query";
import axios from "../axiosClient";
import { syncToken } from "../axiosClient";
import { toast } from "react-toastify";

export const useUploadFile = () => {
  const mutate = useMutation((file) => {}, {
    onSuccess: (response) => {
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
  });
  return mutate;
};

export const uploadFile = (file) => {
  syncToken();
  const formData = new FormData();
  formData.append("file", file);
  return axios.post(`/upload/file`, formData);
};
