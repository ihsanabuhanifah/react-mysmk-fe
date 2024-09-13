import axios from "../axiosClient";
import { syncToken } from "../axiosClient";


export function ListFasilitas() {
  syncToken();
  return axios.get('/landingPage/fasilitas/list');
}
