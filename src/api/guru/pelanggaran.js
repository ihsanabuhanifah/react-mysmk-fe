import axios from "../axiosClient";
import { syncToken } from "../axiosClient";

export function listPelanggaran(params) {
  return axios.get("/guru/pelanggaran/list", { params });
}

export function createPelanggaran(payload) {
  return axios.post("/guru/pelanggaran/create", {
    payload : payload?.pelanggaran,
  });
}
