import { useMutation, useQuery, useQueryClient } from "react-query";
import axios from "../axiosClient";
import { syncToken } from "../axiosClient";
import { toast } from "react-toastify";
import useToast from "../../hook/useToast";
import { useState } from "react";

export function getExam(params) {
  syncToken();
  return axios.get("/santri/exam/list", { params });
}

export function takeExam(id) {
  syncToken();
  return axios.get(`/santri/exam/take/${id}`);
}

export const useExam = (id) => {
  let [params, setParams] = useState({ page: 1, pageSize: 10 });
  const { isLoading, data, isFetching } = useQuery(
    ["/santi/exam/list", params],
    () => getExam(params),
    {
      keepPreviousData: true,
      select: (response) => response.data,
      staleTime: 60 * 1000 * 10,
      enabled: !!id === false,
    }
  );

  return { isLoading, data, isFetching, params, setParams };
};

export const useTakeExam = (id) => {
  const { isLoading, data, isFetching } = useQuery(
    ["/santi/exam/detail"],
    () => takeExam(id),
    {
      keepPreviousData: true,
      select: (response) => response.data,
      staleTime: 60 * 1000 * 10,
      enabled: !!id === true,
    }
  );

  return { isLoading, data, isFetching };
};
