import axios from "../axiosClient";
import { syncToken } from "../axiosClient";

export function listDaftarGuru(params) {
  syncToken();
  return axios.get("/guru/daftar-guru", { params });
}

// payload: { teacher_ids: number[], status: "active" | "nonactive", blokir_login: boolean }
export function ubahStatusGuru(payload) {
  syncToken();
  return axios.put("/guru/daftar-guru/status", payload);
}

export function aturRoleGuru(teacherId, role_ids) {
  syncToken();
  return axios.put(`/guru/daftar-guru/${teacherId}/roles`, { role_ids });
}

// payload: { nama_guru, email, no_hp, keterangan }
export function editProfilGuru(teacherId, payload) {
  syncToken();
  return axios.put(`/guru/daftar-guru/${teacherId}/profil`, payload);
}
