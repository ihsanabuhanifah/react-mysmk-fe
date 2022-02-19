import axios from "../axiosClient";
import { syncToken } from "../axiosClient";

export function listJadwal() {
  return axios.get("/guru/jadwal/list?");
}
