import axios from "../axiosClient";
import { syncToken } from "../axiosClient";


export function ListGallery() {
  syncToken();
  return axios.get('/landingPage/gallery/list');
}
