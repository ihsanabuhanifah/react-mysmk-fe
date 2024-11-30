import axios from "../axiosClient";
import { syncToken } from "../axiosClient";
import { useQuery } from "react-query";
import { useState } from "react";

export function CreateLampiranBuktiDaftarUlang(values) {
  syncToken();
  return axios.post("/ppdb/bayar-ulang", values);
}

export function ListDaftarUlang() {
  syncToken();
  return axios.get("/ppdb/bayar-ulang/list");
}

export function getDetailDaftarUlang() {
  syncToken();
  return axios.get(`/ppdb/bayar-ulang/detail`).then((response) => {
    console.log("Response Pembayaran :", response.data);
    return response.data;
  });
}

export function useDetailDaftarUlang() {
  const { data, isLoading, isError, error } = useQuery(
    "getDetailDaftarUlang",
    getDetailDaftarUlang
  );

  const dataDaftarUlang = data?.data;

  return { dataDaftarUlang, isLoading, isError, error };
}

export function useGetHasilDaftarUlang() {
  let [params, setParams] = useState({
    bukti_tf: "",
    teacher_id: "",
    nominal: "",
    keterangan: "",
  });

  syncToken();

  let { data: dataPb } = useQuery(
    ["list_bayar_ulang"],
    () => ListDaftarUlang(),
    {
      select: (res) => res.data.data,
    }
  );

  let { data, isFetching } = useQuery(
    ["/ppdb/bayar-ulang", params],
    () => axios.get("/ppdb/bayar-ulang", { params }).then((res) => res.data),
    {
      onSuccess: (res) => {},
      onError: (res) => {},
    }
  );

  return { data, isFetching, setParams, dataPb, params };
}

export function useGetHasilDaftarUlangDetail(id) {
  syncToken();

  const { data, isLoading, isError, refetch } = useQuery(
    ["/ppdb/bayar-ulang/detail", id],
    () => axios.get(`/ppdb/bayar-ulang/detail`).then((res) => res.data),
    {
      select: (data) => data.data, // Memilih data dari respons
      onError: (error) => {
        console.error("Error fetching payment details:", error);
      },
    }
  );

  return { data, isLoading, isError, refetch };
}

// Fungsi untuk mengambil detail daftar ulang berdasarkan ID
export function fetchPaymentDaftarUlangDetails() {
  syncToken();
  return axios.get(`/ppdb/bayar-ulang/detail`).then((res) => res.data);
}

// Custom hook untuk mengambil detail daftar ulang berdasarkan ID dengan react-query
export function useFetchPaymentDaftarUlangDetails(id) {
  syncToken();

  // Menggunakan useQuery untuk mengambil data detail daftar ulang
  const { data, isLoading, isError, refetch } = useQuery(
    ["/ppdb/bayar-ulang/detail", id],
    () => fetchPaymentDaftarUlangDetails(id), // Memanggil fungsi fetchPaymentDetails
    {
      select: (response) => response?.data, // Pilih data dari response
      onError: (error) => {
        console.error("Error fetching payment details:", error);
      },
    }
  );

  // Mengembalikan data, isLoading, isError, dan fungsi refetch
  return { data, isLoading, isError, refetch };
}