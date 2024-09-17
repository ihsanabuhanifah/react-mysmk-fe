import { useQuery } from "react-query";
import { syncToken } from "../axiosClient";
import axios from '../axiosClient'
import { useState } from "react";


export function useListHasilUjian() {
  let [params, setParams] = useState({
    nama_mapel: '',
    judul_ujian: '',
    page: 1,
    pageSize: 10,
  })
  syncToken()

  let { data, isFetching } = useQuery(['/santri/hasil-ujian', params], () => axios.get('/santri/hasil-ujian', { params }).then(res => res.data), {
    onSuccess: (res) => {
    },
    onError: (res) => {
    }
  })

  return { data, isFetching, params, setParams }
}