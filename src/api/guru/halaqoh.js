import axios from "../axiosClient";
import { syncToken } from "../axiosClient";

export function listHalaqoh(params) {
  return axios.get("guru/halaqoh/list", { params });
}

export function notifikasiHalaqoh() {
  return axios.get("/guru/halaqoh/notifikasi");
}
