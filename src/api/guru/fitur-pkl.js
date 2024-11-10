// //guru

// import axios from "../axiosClient";
// import { syncToken } from "../axiosClient";
// export function listSiswaPkl(params) {
//   return axios.get("/guru/tempat-pkl/list", { params });
// }

// export function createSiswaPkl(payload) {
//   return axios.post("/guru/tempat-pkl/create", payload);
// }

// export function deleteSiswaPkl(id) {
//   return axios.delete(`guru/tempat-pkl/delete/${id}`);
// }

// export function detailSiswaPkl(id) {
//   return axios.get(`guru/tempat-pkl/detail/${id}`);
// }

// export function updateSiswaPkl(id, values) {
//   let payload = values.payload[0];

//   return axios.put(`guru/tempat-pkl/update/${id}`, payload);
// }

import axios from "axios";
import axiosClient, { syncToken } from "../axiosClient";

export function listSiswaPkl(params) {
  syncToken();
  return axiosClient.get("/guru/tempat-pkl/list", { params });
}

export function createSiswaPkl(payload) {
  syncToken();
  console.log(payload);
  
  return axiosClient.post("/guru/tempat-pkl/create", payload);
}
export function updateSiswaPkl(id, values) {
  syncToken();
  // let payload = values.payload[0];
  console.log('update pkl tes', values)
  return axiosClient.put(`guru/tempat-pkl/update/${id}`, values);
}
// export function createSiswaPkl(payload) {
//   syncToken();
//   return axiosClient.post("/guru/tempat-pkl/create", {
//     payload:payload?.data,
//   });
// }

export function deleteSiswaPkl(id) {
  syncToken();
  return axiosClient.delete(`guru/tempat-pkl/delete/${id}`);
}


export function detailSiswaPkl(id)  {
  syncToken();
  console.log("api detail");
  return axiosClient.get(`guru/tempat-pkl/detail/${id}`);
}

export function detailJawabanSiswaPkl(id)  {
  syncToken();
  return axiosClient.get(`guru/jawaban-tugas-pkl/detail/${id}`);
}
// export function updateSiswaPkl(payload) {
//   syncToken()
//   return axios.put("/guru/tempat-pkl/update", {
//     payload: payload?.data[0],
//   });
// }
