import useToast from "../../../../hook/useToast";
import axios from "../../../../api/axiosClient";
import { useMutation, useQueryClient } from "react-query";

export const useUpdateProfile = (id) => {
    let queryClient = useQueryClient();
    const { successToast, warningToast } = useToast();
    const mutate = useMutation(
      (payload) => {
        console.log(payload);
        return axios.put(`/guru/siswa/update/${id}`, 
          payload,
        );
      },
      {
        onSuccess: (response) => {
          queryClient.invalidateQueries(`/guru/siswa/detail/${id}`);
          successToast(response);
        },
  
        onError: (error) => {
          warningToast(error);
        },
      }
    );
    return mutate;
  };