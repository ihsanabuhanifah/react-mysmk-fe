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

export function createSiswaHandle(payload) {
  syncToken();
  return axios.post("/guru/siswa/kelas/create", payload);
}

export function deleteSiswaKelasHandle(id) {
  syncToken();
  return axios.delete(`/guru/siswa/kelas/delete/${id}`);
}
