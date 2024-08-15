import { useQuery } from "react-query";
import { syncToken } from "../axiosClient";
import axios from '../axiosClient'

export function useGetHasilBelajar() {
  console.log('hehe dipanggil')
  syncToken();
  
  let { data, isFetching } = useQuery(['/santri/hasil-belajar'], () => axios.get('/santri/hasil-belajar').then(res => res.data), {
    onSuccess: (res) => {
    },
    onError: (res) => {
    }
  })

  return { data, isFetching }
}

export function useGetHasilBelajarDetail(id) {
  syncToken();
  
  const { data, isLoading } = useQuery(['/santri/hasil-belajar-detail'], () => axios.get(`/santri/hasil-belajar-detail/${id}`).then(res => res.data), {
    onSuccess: (res) => {
    },
    onError: (res) => {

    }
  })

  return { data, isLoading }
}