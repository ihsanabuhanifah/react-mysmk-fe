import { useEffect, useState } from "react";
import axios from "../axiosClient";
import { syncToken } from "../axiosClient";
import { useQuery } from "react-query";
export function listBankSoal(params) {
  syncToken();
  return axios.get("/guru/bank-soal/list", { params });
}

export const useListBankSoal = () => {
  let [keyword, setKeyword] = useState("");
  let [params, setParams] = useState({
    page: 1,
    pageSize: 10,
    is_all: 1,
    mapel_id: null,
    materi: "",
  });

  const [payload, setPayload] = useState({
    page: 1,
    pageSize: 10,
    is_all: 1,
    mapel_id: null,
    materi: "",
  });
  const handleKeyword = (keyword) => {
    setParams(() => {
      return { ...params, materi: keyword, page: 1 };
    });
  };

  useEffect(() => {
    const interval = setTimeout(() => {
      handleKeyword(keyword);
    }, 500);

    return () => clearTimeout(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [keyword]);

  const handlePageSize = (e) => {
    setParams((params) => ({ ...params, pageSize: e.target.value, page: 1 }));
    setParams((params) => ({
      ...params,
      pageSize: e.target.value,
      page: 1,
    }));
  };

  const handlePage = (page) => {
    setParams((params) => ({ ...params, page: page }));
    setParams((params) => ({ ...params, page: page }));
  };

  const handlePayload = (nama, value) => {
    setPayload((pay) => {
      return {
        ...pay,
        [nama]: value,
      };
    });
  };

  const handleParamsHit = (nama, value) => {
    setParams((pay) => {
      return {
        ...pay,
        [nama]: value,
      };
    });
  };

  const handleParams = () => {
    setParams((params) => {
      return {
        ...payload,
      };
    });
  };

  const handleSearch = (e) => {
    setKeyword(e.target.value);
  };

  const { isLoading, data, isFetching } = useQuery(
    ["/bank-soal/list", [params]],
    () => listBankSoal(params),
    {
      keepPreviousData: true,
      select: (response) => response.data,
      refetchOnWindowFocus: false,
      staleTime: 1000 * 60 * 60 * 5,
    },
  );

  return {
    isLoading,
    data,
    isFetching,
    setParams,
    payload,
    params,
    handlePayload,
    handleParams,
    handlePage,
    handlePageSize,
    handleParamsHit,
    handleSearch,
    keyword,
  };
};

export function createBankSoal(payload) {
  syncToken();
  return axios.post("/guru/bank-soal/create", payload);
}

export function deleteBankSoal(values) {
  syncToken();

  const payload = {
    payload: values,
  };
  return axios.post("guru/bank-soal/delete", payload);
}

export function detailBankSoal(id) {
  syncToken();

  return axios.get(`guru/bank-soal/detail/${id}`);
}

export function updateBankSoal(id, values) {
  syncToken();
  let payload = values.payload[0];

  return axios.put(`guru/bank-soal/update/${id}`, payload);
}

export function createExam(payload) {
  syncToken();
  return axios.post("/guru/ujian/create", payload);
}

export function detailExam(id) {
  syncToken();

  return axios.get(`guru/ujian/detail/${id}`);
}

export function updateExam(id, payload) {
  syncToken();

  return axios.put(`guru/ujian/update/${id}`, payload);
}
