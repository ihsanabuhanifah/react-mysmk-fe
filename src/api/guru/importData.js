import axios from "../axiosClient";
import { syncToken } from "../axiosClient";

export function getReferensiImport() {
  syncToken();
  return axios.get("/import/referensi");
}

export function postImportData(endpoint, file, password) {
  syncToken();
  const formData = new FormData();
  formData.append("password", password);
  formData.append("file", file);
  return axios.post(endpoint, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
}
