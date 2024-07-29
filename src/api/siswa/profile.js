import axios from "../axiosClient";
import { syncToken } from "../axiosClient";

export function getProfile() {
  syncToken();
  return axios.get('/santri/profile');
}