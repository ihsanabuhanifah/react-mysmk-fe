import axios from "../axiosClient";
import { syncToken } from "../axiosClient";

export function listSPP(params) {
  syncToken();
  console.log("Request Parameters:", params);
  // return axios.get("guru/siswa/daftarSpp", { params }).then((response) => {
  //   console.log("Response Data:", response.data);
  //   return response.data;
  // });

  return axios.get("guru/siswa/daftarSpp", { params });
}

export const detailSpp = (student_id, params) => {
  syncToken();
  console.log("Request Parameters:", params);
  return axios.get(`guru/siswa/listPembayaran/${student_id}`, {
    params,
  });
};

export function createSpp(payload) {
  syncToken();
  return axios.post("/guru/pembayaran/createKartu", payload);
}

export function sendwhatsAPP(payload) {
  console.log("Sending payload to backend:", payload);  // Log the payload here
  return axios.post("/guru/pesan/create", payload);
}


export function downloadRekapSpp(student_id) {  
  return axios.post(`guru/laporan/${student_id}`, null, {
    responseType: 'arraybuffer', // Expecting the response as an arraybuffer
  });
}


export function updateStatus(values) {
  syncToken();
  const payload = values.filter((data) => {
    return data.updated === true;
  });

  return axios.put(`/guru/pembayaran/update`, {
    payload,
  });
}
