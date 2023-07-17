//guru

import axios from "../axiosClient";
import { syncToken } from "../axiosClient";
export function listUjian(params) {
  return axios.get("/guru/ujian/list", { params });
}

export function createUjian(payload) {
  return axios.post("/guru/ujian/create", payload);
}

export function deleteUjian(id) {
  return axios.delete(`guru/ujian/delete/${id}`);
}

export function detailUjian(id) {
  return axios.get(`guru/ujian/detail/${id}`);
}

export function updateUjian(id, values) {
  let payload = values.payload[0];

  
  return axios.put(`guru/ujian/update/${id}`, payload);
}
