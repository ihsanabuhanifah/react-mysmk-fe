import axios from "../axiosClient";
import { syncToken } from "../axiosClient";


export function ListFasilitas() {
  syncToken();
  return axios.get('/ppdb/fasilitas/list');
}
