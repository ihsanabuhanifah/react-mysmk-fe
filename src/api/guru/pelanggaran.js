import axios from "../axiosClient";
import { syncToken } from "../axiosClient";

export function listPelanggaran(params) {
  syncToken()
  return axios.get("/guru/pelanggaran/list", { params });
}

export function createPelanggaran(payload) {
  syncToken()
  return axios.post("/guru/pelanggaran/create", {
    payload: payload?.pelanggaran,
  });
}

export function updatePelanggaran(payload) {
  syncToken()
  return axios.put("/guru/pelanggaran/update", {
    payload: payload?.pelanggaran[0],
  });
}

export function deletePelanggaran(id) {
  syncToken()
  return axios.post("/guru/pelanggaran/delete", {
    payload: [id],
  });
}

//prestasi


export function listPrestasi(params) {
  syncToken()
  return axios.get("/guru/prestasi/list", { params });
}

export function createPrestasi(payload) {
  syncToken()
  return axios.post("/guru/prestasi/create", {
    payload: payload?.prestasi,
  });
}


export function updatePrestasi(payload) {
  syncToken()
  return axios.put("/guru/prestasi/update", {
    payload: payload?.prestasi[0],
  });
}

