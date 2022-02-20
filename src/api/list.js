import axios from "./axiosClient";

export function listMapel() {
  return axios.get("/list/mata-pelajaran");
}
export function listTahunAjaran() {
  return axios.get("/list/tahun-ajaran");
}

export function listGuru() {
  return axios.get("/list/guru");
}
export function listKelas() {
  return axios.get("/list/kelas");
}

export function listRoles() {
  return axios.get("/list/roles");
}
