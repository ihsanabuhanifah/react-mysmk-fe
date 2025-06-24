import axios from "../axiosClient";
import { syncToken } from "../axiosClient";

export function listCalonSiswa(params) {
  syncToken();
  console.log(params);
  return axios.get("guru/list-calsan", { params });
}

export function getCalonSantriById(nama) {
  syncToken();
  return axios.get(`guru/detail-calsan/${encodeURIComponent(nama)}`);
}