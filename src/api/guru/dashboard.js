import axios from "../axiosClient";
import { syncToken } from "../axiosClient";

export function getDashboardGuru() {
  syncToken();
  return axios.get("/guru/dashboard");
}
