import axios from "../axiosClient";
import { syncToken } from "../axiosClient";

export function listNotice(params) {
  syncToken()
  return axios.get("/guru/notice/list", { params });
}
export function detailNotice(id) {
  syncToken()
  return axios.get(`/guru/notice/list/${id}`);
}

export function createNotice(form) {
  syncToken()
  return axios.post("/guru/notice/save", form, {
    headers: {
      'Content-Type': 'multipart/form-data',
    }
  });
}

export function deleteNotice(id) {
  syncToken()
  return axios.delete(`/guru/notice/delete/${id}`);
}