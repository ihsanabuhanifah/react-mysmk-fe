// API & hook untuk area Wali Santri (endpoint /wali/*).
// Catatan: beberapa endpoint lama mengembalikan HTTP 200 + {status:"Fail"} saat data kosong,
// jadi helper `rows()` menormalkan hasilnya menjadi array.
import { useMutation, useQuery, useQueryClient } from "react-query";
import Cookies from "js-cookie";
import jwt_decode from "jwt-decode";
import axios from "./axiosClient";

const STALE = 60 * 1000 * 5;

const rows = (res) => (Array.isArray(res?.data?.data) ? res.data.data : []);
const clean = (params = {}) =>
  Object.fromEntries(Object.entries(params).filter(([, v]) => v !== "" && v !== null && v !== undefined));

/** Isi token login (nama_siswa, StudentId, tahunAjaranAktif, semesterAktif, ...). */
export function getWaliToken() {
  try {
    return jwt_decode(Cookies.get("mysmk_token"));
  } catch (e) {
    return {};
  }
}

export function useProfileWali() {
  return useQuery(["wali/profile"], () => axios.get("/wali/profile"), {
    staleTime: 1000 * 60 * 30,
    refetchOnWindowFocus: false,
    select: (res) => {
      const parent = res?.data?.parent || null;
      const siswa = parent?.siswa || null;
      return {
        parent,
        siswa,
        kelas: siswa?.kelas_student?.[0]?.kelas?.nama_kelas,
        nama_siswa: siswa?.nama_siswa || getWaliToken()?.nama_siswa,
      };
    },
  });
}

export function useAbsensiKelas(params) {
  return useQuery(
    ["wali/absensi-kelas", params],
    () => axios.get("/wali/absensi/kelas/list", { params: clean(params) }),
    { staleTime: STALE, keepPreviousData: true, select: rows }
  );
}

export function useRekapAbsensi(params) {
  return useQuery(
    ["wali/rekap-absensi", params],
    () => axios.get("/wali/rekap/absensi-kelas", { params: clean(params) }),
    { staleTime: STALE, select: (res) => res?.data?.data?.[0] || null }
  );
}

export function useAbsensiHalaqoh(params) {
  return useQuery(
    ["wali/absensi-halaqoh", params],
    () => axios.get("/wali/absensi/halaqoh/list", { params: clean(params) }),
    { staleTime: STALE, keepPreviousData: true, select: rows }
  );
}

export function useHasilHalaqoh() {
  return useQuery(["wali/halaqoh-result"], () => axios.get("/wali/halaqoh/result"), {
    staleTime: STALE,
    select: (res) => (Array.isArray(res?.data?.data?.data) ? res.data.data.data : []),
  });
}

export function usePelanggaran(params) {
  return useQuery(
    ["wali/pelanggaran", params],
    () => axios.get("/wali/pelanggaran/list", { params: clean(params) }),
    { staleTime: STALE, select: rows }
  );
}

export function usePrestasi(params) {
  return useQuery(
    ["wali/prestasi", params],
    () => axios.get("/wali/prestasi/list", { params: clean(params) }),
    { staleTime: STALE, select: rows }
  );
}

export function useRaport(params) {
  return useQuery(
    ["wali/raport", params],
    () => axios.get("/wali/raport/list", { params: clean(params) }),
    { staleTime: STALE, select: (res) => (Array.isArray(res?.data?.nilai) ? res.data.nilai : []) }
  );
}

export function useRaportDetail({ mapel_id, kelas_id, ta_id }) {
  return useQuery(
    ["wali/raport-detail", mapel_id, kelas_id, ta_id],
    () => axios.get(`/wali/raport/detail/${mapel_id}/${kelas_id}/${ta_id}`),
    {
      enabled: Boolean(mapel_id && kelas_id && ta_id),
      staleTime: STALE,
      select: (res) => (Array.isArray(res?.data?.nilai) ? res.data.nilai : []),
    }
  );
}

export function useHasilUjian(params) {
  return useQuery(
    ["wali/exam", params],
    () => axios.get("/wali/exam/list", { params: clean(params) }),
    {
      staleTime: STALE,
      keepPreviousData: true,
      select: (res) => ({ rows: rows(res), total: res?.data?.pagination?.totalItems || 0 }),
    }
  );
}

export function useNotice() {
  return useQuery(["wali/notice"], () => axios.get("/wali/notice/list"), {
    staleTime: STALE,
    select: rows,
  });
}

// ---------- Perizinan (kunjungan & pulang) ----------
const IZIN = {
  kunjungan: { list: "/wali/kunjungan/list", tambah: "/wali/kunjungan/tambah", update: "/wali/kunjungan/update" },
  pulang: { list: "/wali/pulang/list", tambah: "/wali/pulang/tambah", update: "/wali/pulang/update" },
};

export function useIzinList(jenis) {
  return useQuery(["wali/izin", jenis], () => axios.get(IZIN[jenis].list), {
    staleTime: 60 * 1000,
    select: rows,
  });
}

export function useSimpanIzin(jenis) {
  const qc = useQueryClient();
  return useMutation(
    ({ id, ...payload }) =>
      id ? axios.put(`${IZIN[jenis].update}/${id}`, payload) : axios.post(IZIN[jenis].tambah, payload),
    { onSuccess: () => qc.invalidateQueries(["wali/izin", jenis]) }
  );
}
