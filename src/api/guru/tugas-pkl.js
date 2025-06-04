import axiosClient, { syncToken } from "../axiosClient";

export function listTugasPkl(params) {
  syncToken();
  return axiosClient.get("/guru/tugas-pkl/list", { params });
}

export function createTugasPkl(payload) {
  syncToken();

  return axiosClient.post("/guru/tugas-pkl/create", payload);
}

export function updateTugasPkl(id, values) {
  syncToken();

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

export function detailTugasPkl(id) {
  syncToken();

  return axiosClient.get(`guru/tugas-pkl/detail/${id}`);
}

export function listJawabanTugasPkl(id) {
  syncToken();

  return axiosClient.get(`guru/jawaban-tugas-pkl/detailByTugasId/${id}`);
}

export function updateJawabanPkl(id, values) {
  syncToken();
  // let payload = values.payload[0];

  // return axiosClient.put(`guru/jawaban-tugas-pkl/update/${id}`, values);
  return axiosClient.put(`guru/jawaban-tugas-pkl/update/${id}`, {
    status: values.status,
    pesan: values.pesan,
  });
}
