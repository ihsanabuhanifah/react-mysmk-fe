//guru

import axios from "../axiosClient";
import { syncToken } from "../axiosClient";
export function listSiswaPkl(params) {
  return axios.get("/guru/ujian/list", { params });
}

export function createSiswaPkl(payload) {
  return axios.post("/guru/ujian/create", payload);
}

export function deleteSiswaPkl(id) {
  return axios.delete(`guru/ujian/delete/${id}`);
}

export function detailSiswaPkl(id) {
  return axios.get(`guru/ujian/detail/${id}`);
}

export function updateSiswaPkl(id, values) {
  let payload = values.payload[0];

  
  return axios.put(`guru/ujian/update/${id}`, payload);
}
