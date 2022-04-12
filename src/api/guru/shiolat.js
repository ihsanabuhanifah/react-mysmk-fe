import axios from "../axiosClient";
import { syncToken } from "../axiosClient";

export function listSholat(params) {
  return axios.get("/guru/absensi-sholat/list", { params });
}

export function createSholat(payload) {
  return axios.post("/guru/absensi-sholat/create", {
    payload: payload?.sholat,
  });
}

export function updateAbensiSholat(payload) {
  return axios.put("/guru/absensi-sholat/update", {
    payload: payload?.sholat[0],
  });
}

export function deleteAbsensiSholat(id) {
  return axios.post("/guru/absensi-sholat/delete", {
    payload: [id],
  });
}

//prestasi


