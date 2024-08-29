import axios from "../axiosClient";
import { syncToken } from "../axiosClient";


export function ListGallery() {
  syncToken();
  return axios.get('/ppdb/gallery/list');
}
