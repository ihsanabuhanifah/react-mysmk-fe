import { toast, useToast } from "react-toastify";
import axios from "../axiosClient";
import { syncToken } from "../axiosClient";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { useState } from "react";

export function getProfileCalonSantri() {
  syncToken();
  // const response = axios.get(`/ppdb/detail`);
  // return response.data
  return axios.get(`ppdb/detail`).then((response) => {
    console.log("Response Data:", response.data);
    return response.data;
  });
}

export function useProfileCalonSantri() {
  const { data, isLoading, isError, error } = useQuery(
    "getProfileCalonSantri",
    getProfileCalonSantri
  );

  const profileData = data?.data;

  return { profileData, isLoading, isError, error };
}

// Hook untuk memperbarui profil calon santri
export function useUpdateProfileCalonSantri(id) {
  syncToken();
  const queryClient = useQueryClient();

  const mutate = useMutation(
    async (payload) => {
      console.log("ID yang dikirim:", id);
      console.log("Payload yang dikirim:", payload);

      const response = await axios.put(`/ppdb/update/${id}`, payload);
      return response.data;
    },
    {
      onSuccess: () => {
        toast.success("Berhasil Memperbaharui Profile Calon Santri!");
        queryClient.invalidateQueries("/ppdb/detail");
      },
      onError: (error) => {
        console.error("Error updating profile: ", error.message);
        toast.error("Gagal Memperbaharui Profile Calon Santri!");
      },
    }
  );

  return mutate;
}
