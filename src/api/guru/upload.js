//guru

import { useMutation, useQueryClient } from "react-query";
import axios from "../axiosClient";
import axiosClientStorage from "../axiosClientStorage";
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
  return axiosClientStorage.post(`/upload/file`, formData);
};

export const useDeleteFile = () => {
  const { successToast, warningToast } = useToast();
  const mutate = useMutation(
    (payload) => {
      return axiosClientStorage.post(`/delete/file`, payload);
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