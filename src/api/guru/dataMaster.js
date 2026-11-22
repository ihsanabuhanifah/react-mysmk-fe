import axios from "../axiosClient";
import { syncToken } from "../axiosClient";

// jenis: "ta" | "kelas" | "mapel" | "role"
export function listMaster(jenis, params) {
  syncToken();
  return axios.get(`/guru/master/${jenis}`, { params });
}
export function createMaster(jenis, payload) {
  syncToken();
  return axios.post(`/guru/master/${jenis}`, payload);
}
export function updateMaster(jenis, id, payload) {
  syncToken();
  return axios.put(`/guru/master/${jenis}/${id}`, payload);
}
export function deleteMaster(jenis, id) {
  syncToken();
  return axios.delete(`/guru/master/${jenis}/${id}`);
}
