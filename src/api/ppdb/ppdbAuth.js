import { useQuery } from "react-query";
import axios from "../axiosClient";
import { syncToken } from "../axiosClient";

// Fungsi untuk melakukan pendaftaran PPDB
export function registerPpdb(values) {
  return axios.post("/register-ppdb", values);
}

// Fungsi untuk melakukan login PPDB
export function loginPpdb(values) {
  return axios.post("/login-ppdb", values);
}

// Fungsi untuk mendapatkan data autentikasi pengguna
// export function authme() {
//     syncToken(); // Sinkronisasi token jika diperlukan
//     return axios.get("/authme");
// }

// Hook React Query untuk mendapatkan data autentikasi
// export const useAuthMe = () => {
//     // Menggunakan useQuery untuk mendapatkan data dari endpoint /authme
//     let { data: dataMe } = useQuery(
//       // Kunci query, yang dapat digunakan untuk cache
//       ["authme"],
//       // Fungsi axios yang akan dipanggil
//       () => authme(),
//       // Konfigurasi query
//       {
//         staleTime: 60 * 1000 * 60 * 12, // 12 jam
//         select: (response) => response.data // Memilih data yang relevan dari respons
//       }
//     );
  
//     // Mengembalikan dataMe dari hook
//     return { dataMe };
// }
