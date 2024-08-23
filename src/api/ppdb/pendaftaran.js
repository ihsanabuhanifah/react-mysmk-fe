import axios from "../axiosClient";
import { syncToken } from "../axiosClient";

export function CreateDataCalonSantri(values) {
  syncToken();
  return axios.post('/ppdb/create', values);
}
