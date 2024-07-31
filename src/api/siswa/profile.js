import axios from "../axiosClient";
import { syncToken } from "../axiosClient";

export function getProfile() {
  syncToken();
  return axios.get('/santri/profile');
}

export function updateProfile(values) {
  syncToken()
  return axios.put('/santri/profile/update', values)
} 