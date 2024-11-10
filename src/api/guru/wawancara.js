import { useQuery } from "react-query";
import axios from "../axiosClient";
import { syncToken } from "../axiosClient";

export function listWawancara(params) {
  syncToken();
  console.log(params);
  return axios.get("guru/wawancara/list", params);
}

// Fungsi konfirmasi pembayaran dengan data status
export function konfirmasiWawancara(id, data) {
  syncToken();
  return axios.put(`/guru/wawancara/konfirmasi/${id}`, data); // Kirim data status bersama permintaan
}

  // Custom hook untuk mengambil detail pembayaran berdasarkan ID dengan react-query
export function useFetchWawancaraDetails(id) {
  syncToken();

  // Menggunakan useQuery untuk mengambil data detail pembayaran
  const { data, isLoading, isError, refetch } = useQuery(
    ['guru/wawancara/konfirmasi/', id],
    () => konfirmasiWawancara(id), // Memanggil fungsi fetchPaymentDetails
    {
      select: (response) => response?.data, // Pilih data dari response
      onError: (error) => {
        console.error('Error fetching wawancara details:', error);
      },
    }
  );

  // Mengembalikan data, isLoading, isError, dan fungsi refetch
  return { data, isLoading, isError, refetch };
  
}

export function deleteWawancaraHandle(id){
  syncToken();
  return axios.delete(`guru/wawancara/delete/${id}`);
}