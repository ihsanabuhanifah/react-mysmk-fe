import axios from "../axiosClient";
import { syncToken } from "../axiosClient";
import {useQuery} from "react-query";
import { useState } from "react";

export function CreateLampiranBuktiTransfer(values) {
  syncToken();
  return axios.post('/ppdb/pembayaran-ppdb', values);
}


export function ListPembayaran() {
    syncToken();
    return axios.get('/ppdb/pembayaran-ppdb/list');
  }



  export function getDetailPembayaran() {
    syncToken();
    return axios.get(`/ppdb/pembayaran-ppdb/detail`).then((response) => {
      console.log("Response Pembayaran :",response.data);
      return response.data
    });
  }

  export function useDetailPembayaran() {
    const { data, isLoading, isError, error } = useQuery(
      "getDetailPembayaran",
      getDetailPembayaran
    );
  
    const dataPembayaran = data?.data;
  
    return { dataPembayaran, isLoading, isError, error };
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
  
    const { data, isLoading, isError, refetch } = useQuery(
      ['/ppdb/pembayaran-ppdb/detail', id],
      () => axios.get(`/ppdb/pembayaran-ppdb/detail/${id}`).then(res => res.data),
      {
        select: data => data.data, // Memilih data dari respons
        onError: (error) => {
          console.error('Error fetching payment details:', error);
        },
      }
    );
  
    return { data, isLoading, isError, refetch };
  }



  // Fungsi untuk mengambil detail pembayaran berdasarkan ID
export function fetchPaymentDetails() {
  syncToken();
  return axios.get(`/ppdb/pembayaran-ppdb/detail`).then(res => res.data);
}

// Custom hook untuk mengambil detail pembayaran berdasarkan ID dengan react-query
export function useFetchPaymentDetails(id) {
  syncToken();

  // Menggunakan useQuery untuk mengambil data detail pembayaran
  const { data, isLoading, isError, refetch } = useQuery(
    ['/ppdb/pembayaran-ppdb/detail', id],
    () => fetchPaymentDetails(id), // Memanggil fungsi fetchPaymentDetails
    {
      select: (response) => response?.data, // Pilih data dari response
      onError: (error) => {
        console.error('Error fetching payment details:', error);
      },
    }
  );

  // Mengembalikan data, isLoading, isError, dan fungsi refetch
  return { data, isLoading, isError, refetch };
  
}