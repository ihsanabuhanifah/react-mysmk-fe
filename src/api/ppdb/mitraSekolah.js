import axios from "../axiosClient";
import { syncToken } from "../axiosClient";


export function ListMitraSekolah() {
  syncToken();
  return axios.get('/landingPage/mitra-sekolah/list');
}
