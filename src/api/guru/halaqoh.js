import axios from "../axiosClient";
import { syncToken } from "../axiosClient";

export function listHalaqoh(params) {
  syncToken()
  return axios.get("guru/halaqoh/list", { params });
}

export function notifikasiHalaqoh() {
  syncToken()
  return axios.get("/guru/halaqoh/notifikasi");
}
