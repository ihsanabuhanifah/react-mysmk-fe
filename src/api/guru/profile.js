import { syncToken } from "../axiosClient";
import axios from "../axiosClient";


export function getProfile() {
  syncToken();
  return axios.get('/guru/profile');
}



export function getProfileSiswa() {
  syncToken();
  return axios.get('/santri/profile');
}