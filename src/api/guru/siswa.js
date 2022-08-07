import axios from "../axiosClient";
import { syncToken } from "../axiosClient";
export function listJadwal(params) {
  syncToken();
  return axios.get("/guru/jadwal/list", { params });
}

export function listSiswa(params) {
  syncToken();
  console.log(params);
  return axios.get("guru/siswa/list", { params });
}
