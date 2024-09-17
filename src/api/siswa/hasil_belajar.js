import { useQuery } from "react-query";
import { syncToken } from "../axiosClient";
import axios from '../axiosClient'
import { useState } from "react";
import { listKelas, listtahunajaran } from "../list";

export function useGetHasilBelajar() {
  let [params, setParams] = useState({
    nama_mapel: '',
    ta_id: '',
    tanggal: '',
    nama_kelas: ''
  })
  
  syncToken();

  let { data: dataTa } = useQuery(
    ['list_tahun_ajaran'],
    () => listtahunajaran(),
    {
      select: (res) => res.data.data
    }
  )

  let { data: dataKelas } = useQuery(
    ['list_kelas'],
    () => listKelas(),
    {
      select: (res) => res.data.data
    }
  )
  
  let { data, isFetching } = useQuery(['/santri/hasil-belajar', params], () => axios.get('/santri/hasil-belajar', {params}).then(res => res.data), {
    onSuccess: (res) => {
    },
    onError: (res) => {
    }
  })

  return { data, isFetching, setParams, dataTa, params, dataKelas }
}

export function useGetHasilBelajarDetail(id, ta_id) {
  syncToken();
  
  const { data, isLoading } = useQuery(['/santri/hasil-belajar-detail'], () => axios.get(`/santri/hasil-belajar-detail/${id}/${ta_id}`).then(res => res.data), {
    onSuccess: (res) => {
    },
    onError: (res) => {

    }
  })

  return { data, isLoading }
}