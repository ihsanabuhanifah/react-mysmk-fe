import axios from "./axiosClient";

export function listMapel() {
  return axios.get("/list/mata-pelajaran");
}
export function listTahunAjaran() {
  return axios.get("/list/tahun-ajaran");
}

export async function listTahunAjaranOptions(keyword, loadedOptions, additional) {
  let result = await axios.get(`/list/tahun-ajaran`, {
    params: {
      page: additional.page,
      pageSize: 10,
      keyword,
    },
  });

  result = result.data;

  let options = result.data.map((item) => ({
    label: item.nama_tahun_ajaran,
    value: item.id,
  }));

  return {
    options: options,
    hasMore: result.pagination?.current_page < result.pagination?.total_page,
    additional: {
      page: additional?.page + 1,
      scope_of_service: additional?.scope_of_service,
    },
  };
}

export function listtahunajaran(){
  return axios.get('/list/tahun-ajaran');
}

export function listGuru() {
  return axios.get("/list/guru");
}
export function listKelas() {
  return axios.get("/list/kelas");
}

export function listRoles() {
  return axios.get("/list/roles");
}

export async function listAlquranOptions(keyword, loadedOptions, additional) {
  let result = await axios.get(`/list/alquran`, {
    params: {
      page: additional.page,
      pageSize: 10,
      keyword,
    },
  });

  result = result.data;

  let options = result.data.map((item) => ({
    label: item.nama_surat,
    value: item.id,
  }));

  return {
    options: options,
    hasMore: result.pagination?.current_page < result.pagination?.total_page,
    additional: {
      page: additional?.page + 1,
      scope_of_service: additional?.scope_of_service,
    },
  };
}

export async function listSiswaOptions(keyword, loadedOptions, additional) {
  let result = await axios.get(`/list/siswa`, {
    params: {
      page: additional.page,
      pageSize: 10,
      keyword,
    },
  });

  result = result.data;

  let options = result.data.map((item) => ({
    label: item.nama_siswa,
    value: item.id,
  }));

  return {
    options: options,
    hasMore: result.pagination?.current_page < result.pagination?.total_page,
    additional: {
      page: additional?.page + 1,
      scope_of_service: additional?.scope_of_service,
    },
  };
}

export async function listPelanggaranOptions(keyword, loadedOptions, additional) {
  let result = await axios.get(`/list/pelanggaran`, {
    params: {
      page: additional.page,
      pageSize: 10,
      keyword,
    },
  });

  result = result.data;

  let options = result.data.map((item) => ({
    label: item.nama_pelanggaran,
    nama_pelanggaran: item.nama_pelanggaran,
    tipe: item.tipe,
    kategori: item.kategori,
    point: item.point,
    value: item.id,
  }));

  return {
    options: options,
    hasMore: result.pagination?.current_page < result.pagination?.total_page,
    additional: {
      page: additional?.page + 1,
      scope_of_service: additional?.scope_of_service,
    },
  };
}
