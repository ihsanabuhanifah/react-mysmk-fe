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
