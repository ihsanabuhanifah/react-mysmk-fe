import axios from "../axiosClient";
import { syncToken } from "../axiosClient";


export function ListTestimoni() {
  syncToken();
  return axios.get('/ppdb/testimoni/list');
}
