import axios from "../axiosClient";
import { syncToken } from "../axiosClient";

export function listHalaqoh(params) {
  syncToken();
  return axios.get("guru/halaqoh/list", { params });
}

export function notifikasiHalaqoh() {
  syncToken();
  return axios.get("/guru/halaqoh/notifikasi");
}

export async function updateAbsensiHalaqoh(values) {
  syncToken();

  return axios.put("/guru/halaqoh/update", values);
}

export function listAbsenPengampu(params) {
  syncToken();
  return axios.get("/guru/halaqoh/pengampu/list", { params });
}

export async function updateAbsensiPengampu(values) {
  syncToken();

  let payload = values?.rows?.filter((data) => data.is_absen === true);

  return axios.put("/guru/halaqoh/pengampu/update", payload);
}

export function listBelumAbsensi(params) {
  syncToken();
  return axios.get("/guru/halaqoh/belum-absensi", { params });
}

export function listRekapHalaqoh(params) {
  syncToken();
  return axios.get("/guru/halaqoh/absensi/rekap", { params });
}
