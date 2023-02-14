//guru

import axios from "../axiosClient";
import { syncToken } from "../axiosClient";
export function listUjian(params) {
  syncToken();
  return axios.get("/guru/ujian/list", { params });
}

export function createUjian(payload) {
  syncToken();
  return axios.post("/guru/ujian/create", payload);
}

export function deleteUjian(id) {
  syncToken();

  
  return axios.delete(`guru/ujian/delete/${id}`);
}

export function detailUjian(id) {
  syncToken();

  return axios.get(`guru/ujian/detail/${id}`);
}

export function updateUjian(id, values) {
  syncToken();
  let payload = values.payload[0];

  console.log("d", values);
  return axios.put(`guru/ujian/update/${id}`, payload);
}
