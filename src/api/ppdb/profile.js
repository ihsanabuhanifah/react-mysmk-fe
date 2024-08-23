import axios from "../axiosClient";
import { syncToken } from "../axiosClient";

export function getProfileCalonSantri(id) {
  syncToken();
  return axios.get(`/ppdb/detail-calsan/${id}`);
}
