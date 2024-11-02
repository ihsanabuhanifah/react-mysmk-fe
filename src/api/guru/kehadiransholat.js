import { useMutation, useQuery } from "react-query";
import useToast from "../../hook/useToast";
import axios, { syncToken } from "../axiosClient";
import { useState } from "react";

function createWaktuSholat(payload) {
  syncToken();
  return axios.post("/guru/createwaktusholat", payload);
}

export function cekWaktuSholat(payload) {
  syncToken()
  return axios.get(`/guru/cekwaktusholat/${payload}`)
}

function listWaktuSholat(params) {
  syncToken()
  return axios.get('/guru/listwaktusholat', { params })
}

export const useCreateWaktuSholat = () => {
  const { mutate, isLoading } = useMutation(
    (payload) => createWaktuSholat(payload),
    {
      onSuccess: (res) => {
        console.log(res);
      },
      onError: (err) => {
        console.log(err);
      },
    },
  );

  return { mutate, isLoading };
};

export const useListDataKehadiranSholat = () => {
  const [params, setParams] = useState({
    tanggal: 'now',
    waktu: 'Subuh'
  })

  const { data, isLoading } = useQuery(
    ["datakehadiransholat", params],
    () => listWaktuSholat(params),
    {
      select: (res) => res.data.data
    }
  )

  return { params, setParams, data, isLoading }
}
