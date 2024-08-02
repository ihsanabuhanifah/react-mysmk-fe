import { useMutation, useQueryClient } from "react-query";
import useToast from "../../hook/useToast";
import axios from "../axiosClient";
import { syncToken } from "../axiosClient";

export function getProfile() {
  syncToken();
  return axios.get('/santri/profile');
}

export function useUpdateProfile() {
  syncToken()
  const { successToast, warningToast } = useToast();
  const queryClient = useQueryClient();

  const mutate = useMutation(
    (payload) => {
      return axios.put('/santri/profile/update', payload)
    },
    {
      onSuccess: () => {
        successToast('Berhasil Memperbaharui Profile!');
        queryClient.invalidateQueries("/santri/profile");
      },
      onError: () => {
        warningToast('Gagal!')
      }
    }
  )

  return mutate
} 