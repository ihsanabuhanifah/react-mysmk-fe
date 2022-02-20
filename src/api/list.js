import axios from "./axiosClient";

export function listMapel() {
  return axios.get("/list/mata-pelajaran");
}
export function listTahunAjaran() {
  return axios.get("/list/tahun-ajaran");
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
