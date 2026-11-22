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

export function listSiswaTanpaKelas() {
  syncToken();
  return axios.get("/guru/siswa/tanpa-kelas");
}

export function listAlumni(params) {
  syncToken();
  return axios.get("/guru/siswa/alumni", { params });
}

// Pindah / naik kelas & riwayat kelas
export function getRingkasanKelas() {
  syncToken();
  return axios.get("/guru/siswa/kelas/ringkasan");
}

export function listAnggotaKelas(kelas_id) {
  syncToken();
  return axios.get("/guru/siswa/kelas/anggota", { params: { kelas_id } });
}

export function pindahKelasHandle(payload) {
  syncToken();
  return axios.post("/guru/siswa/kelas/pindah", payload);
}

// ids: id baris kelas_students (rombel)
export function nonaktifkanSiswaKelasHandle(ids) {
  syncToken();
  return axios.put("/guru/siswa/kelas/nonaktif", { ids });
}

export function getRiwayatKelas(student_id) {
  syncToken();
  return axios.get(`/guru/siswa/kelas/riwayat/${student_id}`);
}

export function getSiswaById(id) {
  syncToken();
  return axios.get(`/guru/siswa/detail/${id}`);
}
 