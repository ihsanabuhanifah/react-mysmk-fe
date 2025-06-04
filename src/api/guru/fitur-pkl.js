

import axiosClient, { syncToken } from "../axiosClient";
import { usePagination } from "../../hook/usePagination";
import { useQuery } from "react-query";

export function listSiswaPkl(params) {
  syncToken();
  return axiosClient.get("/guru/tempat-pkl/list", { params });
}

export function createSiswaPkl(payload) {
  syncToken();
  console.log(payload);
  
  return axiosClient.post("/guru/tempat-pkl/create", payload);
}
export function updateSiswaPkl(id, values) {
  syncToken();
  // let payload = values.payload[0];
  console.log('update pkl tes', values)
  return axiosClient.put(`guru/tempat-pkl/update/${id}`, values);
}
// export function createSiswaPkl(payload) {
//   syncToken();
//   return axiosClient.post("/guru/tempat-pkl/create", {
//     payload:payload?.data,
//   });
// }

export function deleteSiswaPkl(id) {
  syncToken();
  return axiosClient.delete(`guru/tempat-pkl/delete/${id}`);
}


export function detailSiswaPkl(id)  {
  syncToken();
  console.log("api detail");
  return axiosClient.get(`guru/tempat-pkl/detail/${id}`);
}

export function detailJawabanSiswaPkl(id)  {
  syncToken();
  return axiosClient.get(`guru/jawaban-tugas-pkl/detail/${id}`);
}
// export function updateSiswaPkl(payload) {
//   syncToken()
//   return axios.put("/guru/tempat-pkl/update", {
//     payload: payload?.data[0],
//   });
// }


export const useLaporanPklList = () => {
  let defParams = {
    page: 1,
    pageSize: 10,
    dariTanggal: null,
    sampaiTanggal: null,
    status_kehadiran: null,
  };
  const {
    params,
    setParams,
    handleFilter,
    handleClear,
    handlePageSize,
    handlePage,
    filterParams,
  } = usePagination(defParams);

  const { isLoading, data, isFetching } = useQuery(
    ["/guru/laporan-harian-pkl/list", filterParams],
    () => listSiswaPkl(filterParams),
    {
      keepPreviousData: true,
      select: (response) => response.data,
      staleTime: 60 * 1000 * 10,
    }
  );
  return {
    setParams,
    handleFilter,
    handleClear,
    handlePageSize,
    handlePage,
    filterParams,
    data,
    isFetching,
    isLoading,
    params,
  };
};