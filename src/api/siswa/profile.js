import { useMutation } from "react-query";
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

  const mutate = useMutation(
    (payload) => {
      return axios.put('/santri/profile/update', payload)
    },
    {
      onSuccess: () => {
        successToast('Berhasil Memperbaharui Profile!');
      },
      onError: () => {
        warningToast('Gagal!')
      }
    }
  )

  return mutate
} 