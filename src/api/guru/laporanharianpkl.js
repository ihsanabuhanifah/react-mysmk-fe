import axios from "axios";
import axiosClient, { syncToken } from "../axiosClient";

export function listLaporanPkl(params) {
  syncToken();
  return axiosClient.get("/guru/laporan-harian-pkl/list", { params });
}

export function createLaporanPkl(payload) {
  syncToken();
  console.log(payload);
  
  return axiosClient.post("/guru/laporan-harian-pkl/create", payload);
}
export function updateLaporanPkl(id, values) {
  syncToken();
  // let payload = values.payload[0];
  console.log('update pkl tes', values)
  return axiosClient.put(`guru/laporan-harian-pkl/update/${id}`, values);
}

export function deleteLaporanPkl(id) {
  syncToken();
  return axiosClient.delete(`guru/laporan-harian-pkl/delete/${id}`);
}

export function detailLaporanPkl(id)  {
  syncToken();
  console.log("api detail");
  return axiosClient.get(`guru/laporan-harian-pkl/detail/${id}`);
}

