//guru

import { useMutation, useQueryClient } from "react-query";
import axios from "../axiosClient";
import { syncToken } from "../axiosClient";
import { toast } from "react-toastify";
import useToast from "../../hook/useToast";

export const useUploadFile = () => {
  const { successToast, warningToast } = useToast();
  const mutate = useMutation((file) => {}, {
    onSuccess: (response) => {
      successToast(response);
    },

    onError: (error) => {


      warningToast(error);
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

export const useDeleteFile = () => {
  const { successToast, warningToast } = useToast();
  const mutate = useMutation(
    (payload) => {
      return axios.post(`/delete/file`, payload);
    },
    {
      onSuccess: (response) => {
        successToast(response);
      },

      onError: (error) => {

        console.log('err')
        warningToast(error);
      },
    }
  );
  return mutate;
};
