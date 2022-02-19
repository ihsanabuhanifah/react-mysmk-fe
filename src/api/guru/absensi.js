import axios from "../axiosClient";
import { syncToken } from "../axiosClient";

export function listJadwal() {
  return axios.get("/guru/jadwal/list?");
}

export function listAbsensi(params) {
    console.log(params)
  return axios.get("guru/absensi/list", {params});
}
