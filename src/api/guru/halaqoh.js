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

export async function updateAbsensiHalaqoh(values) {
  syncToken();
  

 

  return axios.put("/guru/halaqoh/update", values);
}
