// Manajemen wali santri oleh admin (endpoint /guru/admin-wali/*)
import axios from "../axiosClient";

// params: { status: "menunggu" | "terhubung" | "", keyword, page, pageSize }
export const listWali = (params) => axios.get("/guru/admin-wali/list", { params });
export const cariSantri = (keyword) => axios.get("/guru/admin-wali/cari-santri", { params: { keyword } });
// payload: { nama_wali, email, no_hp, hubungan, student_id? } -> { password }
export const tambahWali = (payload) => axios.post("/guru/admin-wali/create", payload);
export const hubungkanWali = (id, student_id) => axios.put(`/guru/admin-wali/${id}/hubungkan`, { student_id });
export const putuskanWali = (id) => axios.put(`/guru/admin-wali/${id}/putuskan`);
export const resetPasswordWali = (id) => axios.put(`/guru/admin-wali/${id}/reset-password`);
export const ubahWali = (id, payload) => axios.put(`/guru/admin-wali/${id}`, payload);
// rows: [{ baris, nama_wali, email, no_hp, hubungan, nisn }]; simpan=false -> pratinjau saja
export const importWali = (rows, simpan) => axios.post("/guru/admin-wali/import", { rows, simpan });
