import axios from "axios";
import axiosClient, { syncToken } from "../axiosClient";

export function listTugasPkl(params) {
  syncToken();
  return axiosClient.get("/guru/tugas-pkl/list", { params });
}

export function createTugasPkl(payload) {
  syncToken();
  console.log(payload);
  
  return axiosClient.post("/guru/tugas-pkl/create", payload);
}
export function updateTugasPkl(id, values) {
  syncToken();
  // let payload = values.payload[0];
  console.log('update pkl tes', values)
  return axiosClient.put(`guru/tugas-pkl/update/${id}`, values);
}
// export function createSiswaPkl(payload) {
//   syncToken();
//   return axiosClient.post("/guru/tugas-pkl/create", {
//     payload:payload?.data,
//   });
// }

export function deleteTugasPkl(id) {
  syncToken();
  return axiosClient.delete(`guru/tugas-pkl/delete/${id}`);
}

export function detailTugasPkl(id)  {
  syncToken();
  console.log("api detail");
  return axiosClient.get(`guru/tugas-pkl/detail/${id}`);
}
