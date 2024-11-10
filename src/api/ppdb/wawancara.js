import axios from "../axiosClient";
import { syncToken } from "../axiosClient";
import {useQuery} from "react-query";
import { useState } from "react";


export function CreateWawancara(values) {
    syncToken();
    return axios.post('/ppdb/wawancara/create', values);
  }

  export function getDetailWawancara() {
    syncToken();
    return axios.get(`/ppdb/wawancara/detail`).then((response) => {
      console.log("Response wawancara :",response.data);
      return response.data
    });
  }

  export function useDetailWawancara() {
    const { data, isLoading, isError, error } = useQuery(
      "getDetailWawancara",
      getDetailWawancara
    );
  
    const dataWawancara = data?.data;
  
    return { dataWawancara, isLoading, isError, error };
  }


  export function fetchWawancaraDetails() {
    syncToken();
    return axios.get(`/ppdb/wawancara/detail/`).then(res => res.data);
  }

  // Custom hook untuk mengambil detail pembayaran berdasarkan ID dengan react-query
export function useFetchWawancaraDetails(id) {
  syncToken();

  // Menggunakan useQuery untuk mengambil data detail pembayaran
  const { data, isLoading, isError, refetch } = useQuery(
    ['/ppdb/pembayaran-ppdb/detail', id],
    () => fetchWawancaraDetails(id), // Memanggil fungsi fetchPaymentDetails
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