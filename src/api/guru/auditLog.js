import axios from "../axiosClient";
import { syncToken } from "../axiosClient";

// params: { page, pageSize, keyword, action, dari, sampai }
export function listAuditLog(params) {
  syncToken();
  return axios.get("/guru/audit-log", { params });
}
