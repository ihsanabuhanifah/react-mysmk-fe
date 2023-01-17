import axios from "../axiosClient";
import { syncToken } from "../axiosClient";
export function listJadwal(params) {
  syncToken();
  return axios.get("/guru/jadwal/list", { params });
}
export function createJadwalHandle(payload) {
  syncToken();
  return axios.get("/guru/jadwal/create", payload);
}
export function listJadwalAll(params) {
  syncToken();
  return axios.get("/guru/jadwal/list-all", { params });
}

export function listAbsensi(params) {
  syncToken();
  console.log(params);
  return axios.get("guru/absensi/list", { params });
}
export function rekapAbsensi(params) {
  syncToken();
  console.log(params);
  return axios.get("guru/absensi/rekap", { params });
}
export function rekapAgenda(params) {
  syncToken();
  console.log(params);
  return axios.get("guru/agenda/rekap", { params });
}

export function downloadRekapAbsensi(params) {
  return axios.get("guru/absensi/rekap/download", {
    responseType: "arraybuffer",
    params,
  });
}
export async function updateAbsensi(values) {
  syncToken();
  let absensi_kehadiran = [];
  await Promise.all(
    // eslint-disable-next-line array-callback-return
    values?.absensi_kehadiran?.map((data, index) => {
      let absensi = {
        id: data?.id,
        student_id: data?.siswa?.id,
        status_kehadiran: parseFloat(data?.kehadiran?.id),
        keterangan: data?.keterangan,
      };
      data = absensi;
      absensi_kehadiran.push(absensi);
    })
  );

  values.absensi_kehadiran = absensi_kehadiran;

  return axios.put("/guru/absensi/update", values);
}

export function notifikasiAbsensi() {
  syncToken();
  return axios.get("/guru/absensi/notifikasi");
}

export function absensiManualCreate() {
  syncToken();
  return axios.get("/guru/absensi/manual");
}
export function halaqohManualCreate() {
  syncToken();
  return axios.get("/guru/halaqoh/manual");
}

export function monitor() {
  syncToken();
  return axios.get("/monitor");
}

export function belumAbsen() {
  syncToken();
  return axios.get("/guru/absensi/guru-belum-absen");
}
