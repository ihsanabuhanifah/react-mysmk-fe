import { useToast } from "react-toastify";
import axios from "../axiosClient";
import { syncToken } from "../axiosClient";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

export function CreateLampiranBuktiTransfer(values) {
  syncToken();
  return axios.post('/ppdb/pembayaran-ppdb', values);
}


export function ListPembayaran() {
    syncToken();
    return axios.get('/ppdb/pembayaran-ppdb/list');
  }



  export function getDetailPembayaranById(id) {
    syncToken();
    return axios.get(`/ppdb/pembayaran-ppdb/detail/${id}`)
  }

  export function useGetHasilPembayaran() {
    let [params, setParams] = useState({
      bukti_tf: '',
      teacher_id: '',
      nominal:'',
      keterangan: '',
    })
    
    syncToken();
  
    let { data: dataPb } = useQuery(
      ['list_pembayaran'],
      () => ListPembayaran(),
      {
        select: (res) => res.data.data
      }
    )
    
    let { data, isFetching } = useQuery(['/ppdb/pembayaran-ppdb', params], () => axios.get('/ppdb/pembayaran-ppdb', {params}).then(res => res.data), {
      onSuccess: (res) => {
      },
      onError: (res) => {
      }
    })
  
    return { data, isFetching, setParams, dataPb, params }

    
  }

  export function useGetHasilPembayaranDetail(id) {
    syncToken();
  
    const { data, isLoading, isError } = useQuery(
      ['/ppdb/pembayaran-ppdb/detail', id],
      () => axios.get(`/ppdb/pembayaran-ppdb/detail/${id}`).then(res => res.data),
      {
        select: data => data.data, // Memilih data dari respons
        onError: (error) => {
          console.error('Error fetching payment details:', error);
        },
      }
    );
  
    return { data, isLoading, isError };
  }

  // export function useGetHasilPembayaranDetail(id) {
  //   syncToken();
    
  //   const { data, isLoading } = useQuery(['/ppdb/pembayaran-ppdb/detail'], () => axios.get(`/ppdb/pembayaran-ppdb/detail/${id}`).then(res => res.data), {
  //     onSuccess: (res) => {
  //     },
  //     onError: (res) => {
  
  //     }
  //   })
  
  //   return { data, isLoading }
  // }