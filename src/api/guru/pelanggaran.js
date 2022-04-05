import axios from "../axiosClient";
import { syncToken } from "../axiosClient";

export function listPelanggaran(params) {
  return axios.get("/guru/pelanggaran/list", { params });
}

export function createPelanggaran(payload) {
  return axios.post("/guru/pelanggaran/create", {
    payload: payload?.pelanggaran,
  });
}

export function updatePelanggaran(payload) {
  return axios.put("/guru/pelanggaran/update", {
    payload: payload?.pelanggaran[0],
  });
}

export function deletePelanggaran(id) {
  return axios.post("/guru/pelanggaran/delete", {
    payload: [id],
  });
}

//prestasi


export function listPrestasi(params) {
  return axios.get("/guru/prestasi/list", { params });
}

export function createPrestasi(payload) {
  return axios.post("/guru/prestasi/create", {
    payload: payload?.prestasi,
  });
}


export function updatePrestasi(payload) {
  return axios.put("/guru/prestasi/update", {
    payload: payload?.prestasi[0],
  });
}

