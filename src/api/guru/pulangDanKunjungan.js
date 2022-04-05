import axios from "../axiosClient";
import { syncToken } from "../axiosClient";

export function listPulang(params) {
  return axios.get("/guru/pulang/list", { params });
}

export function responsePulang(values) {
  console.log("haha");

  const payload = values.filter((data) => {
    return data.updated === true;
  });

  console.log(payload);
  return axios.put(`guru/pulang/response`, {
    payload,
  });
}
export function laporanPulang(values) {
  console.log("haha");

  console.log(values);
  const payload = values.filter((data) => {
    return data.updated === true;
  });

  console.log(payload);
  return axios.put(`guru/pulang/laporan`, {
    payload,
  });
}

//kunjungan

export function listKunjungan(params) {
  return axios.get("/guru/kunjungan/list", { params });
}

export function responseKunjungan(values) {
  console.log("haha");

  const payload = values.filter((data) => {
    return data.updated === true;
  });

  console.log(payload);
  return axios.put(`guru/kunjungan/response`, {
    payload,
  });
}
