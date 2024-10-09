import { useQuery } from "react-query";
import axios from "../axiosClient";
import { syncToken } from "../axiosClient";

export function listPembayaran(params) {
    syncToken();
    console.log(params);
    return axios.get("guru/pembayaran-ppdb/list",params);
  }

// Fungsi konfirmasi pembayaran dengan data status
export function konfirmasiPembayaran(id, data) {
  syncToken();
  return axios.put(`/guru/pembayaran-ppdb/konfirmasi/${id}`, data); // Kirim data status bersama permintaan
}

  // Custom hook untuk mengambil detail pembayaran berdasarkan ID dengan react-query
export function useFetchPaymentDetails(id) {
  syncToken();

  // Menggunakan useQuery untuk mengambil data detail pembayaran
  const { data, isLoading, isError, refetch } = useQuery(
    ['guru/pembayaran-ppdb/konfirmasi/', id],
    () => konfirmasiPembayaran(id), // Memanggil fungsi fetchPaymentDetails
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