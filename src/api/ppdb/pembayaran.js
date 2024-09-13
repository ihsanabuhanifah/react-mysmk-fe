import { useToast } from "react-toastify";
import axios from "../axiosClient";
import { syncToken } from "../axiosClient";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { useNavigate } from "react-router-dom";

export function CreateLampiranBuktiTransfer(values) {
  syncToken();
  return axios.post('/ppdb/pembayaran-ppdb', values);
}


export function ListPembayaran() {
    syncToken();
    return axios.get('/ppdb/pembayaran-ppdb/list');
  }


//   export function getDetailPembayaranById(id){
//     syncToken();
//     return axios.get(`ppdb/pembayaran-ppdb/detail/${id}`).then((response) => {
//       console.log("Response Data pembayaran:", response.data);
//       return response.data;
//     });
//   }

// // Hook untuk mengambil detail pembayaran
// export function useDetailPembayaran(id) {
//   const { data, isLoading, isError, error } = useQuery(
//     ["getDetailPembayaran", id],
//     () => getDetailPembayaranById(id) // Memastikan id dikirim ke API
//   );

//   const detailPembayaran = data?.data;

//   return { detailPembayaran, isLoading, isError, error };
// }

  export function getDetailPembayaranById(id) {
    syncToken();
    return axios.get(`/ppdb/pembayaran-ppdb/detail/${id}`)
  }