import axios from "../axiosClient";
import { syncToken } from "../axiosClient";

export function listPulang(params) {
  syncToken()
  return axios.get("/guru/pulang/list", { params });
}

export function responsePulang(values) {
  syncToken()
  const payload = values.filter((data) => {
    return data.updated === true;
  });

  return axios.put(`guru/pulang/response`, {
    payload,
  });
}

export function laporanPulang(values) {
  syncToken()
  const payload = values.filter((data) => {
    return data.updated === true;
  });

 
  return axios.put(`guru/pulang/laporan`, {
    payload,
  });
}

//kunjungan

export function listKunjungan(params) {
  syncToken()
  return axios.get("/guru/kunjungan/list", { params });
}

export function responseKunjungan(values) {
  syncToken()

  const payload = values.filter((data) => {
    return data.updated === true;
  });

 
  return axios.put(`guru/kunjungan/response`, {
    payload,
  });
}
