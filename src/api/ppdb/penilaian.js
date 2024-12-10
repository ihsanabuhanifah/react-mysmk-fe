import { useQuery } from "react-query";
import axios from "../axiosClient";
import { syncToken } from "../axiosClient";


export function createPenilaian(params) {
  syncToken();
  return axios.post("/ppdb/nilai/create", { params });
}


export function updatePenilaian(id) {
    syncToken();
    return axios.put(`/ppdb/nilai/update/${id}`);
  }
  
  // Fungsi untuk mengambil detail pembayaran berdasarkan ID
  export function fetchNilaiDetails() {
    syncToken();
    return axios.get(`/ppdb/nilai/detail`).then(res => res.data);
  }
  

// Custom hook untuk mengambil detail pembayaran berdasarkan ID dengan react-query
export function useFetchNilaiDetails(id) {
  syncToken();

  // Menggunakan useQuery untuk mengambil data detail pembayaran
  const { data, isLoading, isError, refetch } = useQuery(
    ['/ppdb/nilai/detail', id],
    () => fetchNilaiDetails(id), // Memanggil fungsi fetchPaymentDetails
    {
      select: (response) => response?.data, // Pilih data dari response
      onError: (error) => {
        // console.error('Error fetching nilai details:', error);
      },
    }
  );

  // Mengembalikan data, isLoading, isError, dan fungsi refetch
  return { data, isLoading, isError, refetch };
  
}
