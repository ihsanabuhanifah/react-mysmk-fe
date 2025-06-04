import axios from "../axiosClient";
import { syncToken } from "../axiosClient";

export function listJadwal(params) {
  syncToken();
  return axios.get("/guru/jadwal/list", { params });
}

export function listSiswa(params) {
  syncToken();

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

export function updateSiswaKelasHandle(id, payload) {
  syncToken();
  return axios.put(`/guru/siswa/update/${id}`, payload);
}

export function getSiswaById(id) {
  syncToken();
  return axios.get(`/guru/siswa/detail/${id}`);
}
 