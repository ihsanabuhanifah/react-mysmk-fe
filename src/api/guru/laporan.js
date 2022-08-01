
import axios from "../axiosClient";
import { syncToken } from "../axiosClient";

export function listGuruPiketToday(params) {
  syncToken();
  return axios.get("/guru/laporan/guru-piket/list", { params });
}

export function listLaporanGuruPiket(params) {
  syncToken();
  return axios.get("/guru/laporan/guru-piket-belum-laporan/list", {params});
}

export function postLaporanGuruPiket(payload) {
  return axios.put(`/guru/laporan/guru-piket/simpan`, payload);
}


export function getDetailLaporanGuruPiket(id, tanggal) {

    
    return axios.get(`/guru/laporan/guru-piket/${id}/${tanggal}`);
  }
