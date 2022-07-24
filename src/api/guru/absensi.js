import axios from "../axiosClient";
import { syncToken } from "../axiosClient";

export function listJadwal(params) {
  return axios.get("/guru/jadwal/list", { params });
}

export function listAbsensi(params) {
  console.log(params);
  return axios.get("guru/absensi/list", { params });
}

export async function updateAbsensi(values) {
  let absensi_kehadiran = [];
  await Promise.all(
    values?.absensi_kehadiran?.map((data, index) => {
      let absensi = {
        id: data?.id,
        student_id: data?.siswa?.id,
        status_kehadiran: parseFloat(data?.kehadiran?.id),
        keterangan: data?.keterangan,
      };
      data = absensi;
      absensi_kehadiran.push(absensi);
      console.log("sini", absensi);
      console.log(data);
    })
  );

  values.absensi_kehadiran = absensi_kehadiran;

  return axios.put("/guru/absensi/update", values);
}

export function notifikasiAbsensi() {
  return axios.get("/guru/absensi/notifikasi");
}

export function absensiManualCreate() {
  return axios.get("/guru/absensi/manual");
}
export function halaqohManualCreate() {
  return axios.get("/guru/halaqoh/manual");
}

export function monitor() {
  return axios.get("/monitor");
}

export function belumAbsen() {
  return axios.get("/guru/absensi/guru-belum-absen");
}
