import axios from "../axiosClient";
import { syncToken } from "../axiosClient";
export function listBankSoal(params) {
  syncToken();
  return axios.get("/guru/bank-soal/list", { params });
}

export function createBankSoal(payload) {
  syncToken();
  return axios.post("/guru/bank-soal/create", payload);
}

export function deleteBankSoal(values) {
  syncToken();

  const payload = {
    payload: values,
  };
  return axios.post("guru/bank-soal/delete", payload);
}

export function detailBankSoal(id) {
  syncToken();

  return axios.get(`guru/bank-soal/detail/${id}`);
}

export function updateBankSoal(id, values) {
  syncToken();
  let payload = values.payload[0];

  
  return axios.put(`guru/bank-soal/update/${id}`, payload);
}

export function createExam(payload) {
  console.log("pay", payload);
  syncToken();
  return axios.post("/guru/ujian/create", payload);
}

export function detailExam(id) {
  syncToken();

  return axios.get(`guru/ujian/detail/${id}`);
}

export function updateExam(id, payload) {
  syncToken();
  
  return axios.put(`guru/ujian/update/${id}`, payload);
}
