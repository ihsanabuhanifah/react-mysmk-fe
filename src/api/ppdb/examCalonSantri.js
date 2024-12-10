// Calon Santri
import { useMutation, useQuery} from "react-query";
import axios from "../axiosClient";
import { syncToken } from "../axiosClient";
import useToast from "../../hook/useToast";
import { useState } from "react";

export function getExamCalonSantri(params) {
  syncToken();
  return axios.get("/ppdb/ujian/list", { params });
}

export function takeExamCalonSantri(id) {
  syncToken();
  return axios.get(`/santri/exam/take/${id}`);
}


export const useExamCalonSantri = (id) => {
    let [params, setParams] = useState({ page: 1, pageSize: 10 });
    const { isLoading, data, isFetching } = useQuery(
      ["/ppdb/ujian/list", params],
      () => getExamCalonSantri(params),
      {
        keepPreviousData: true,
        select: (response) => response.data,
        staleTime: 60 * 1000 * 10,
        enabled: !!id === false,
      }
    );
  
    return { isLoading, data, isFetching, params, setParams };
  };
  
  export const useTakeExamCalonSantri = () => {
    const { successToast, warningToast } = useToast();
    const mutate = useMutation(
      (id) => {
        return axios.get(`/ppdb/exam/take/${id}`);
      },
      {
        onSuccess: (response) => {
          successToast(response);
        },
  
        onError: (error) => {
          console.log("err", error.response);
          // warningToast(error);
        },
      }
    );
    return mutate;
  };
  
  export const useProgressExamCalonSantri = () => {
    const { successToast, warningToast } = useToast();
    const mutate = useMutation(
      (payload) => {
        return axios.put(`/ppdb/exam/progress`, {
          id: payload.id,
          data: payload.data,
        });
      },
      {
        onSuccess: (response) => {
          successToast(response);
        },
  
        onError: (error) => {
          console.log("err", error.response);
          warningToast(error);
        },
      }
    );
    return mutate;
  };
  
  export const useSubmitExamCalonSantri = () => {
    const { successToast, warningToast } = useToast();
    const mutate = useMutation(
      (payload) => {
        return axios.put(`/ppdb/exam/submit`, {
          id: payload.id,
          data: payload.data,
        });
      },
      {
        onSuccess: (response) => {
          successToast(response);
        },
  
        onError: (error) => {
          warningToast(error);
        },
      }
    );
    return mutate;
  };