import { useMutation, useQuery } from "react-query";
import axios from "../axiosClient";
import { syncToken } from "../axiosClient";
import useToast from "../../hook/useToast";
import { useState } from "react";
import { listMapel } from "../list";

export function getExam(params) {
  syncToken();
  return axios.get("/santri/exam/list", { params });
}

export function takeExam(id) {
  syncToken();
  return axios.get(`/santri/exam/take/${id}`);
}

export const useExam = (id) => {
  let [params, setParams] = useState({ page: 1, pageSize: 10, status: "", judul_ujian: '', nama_mapel: '' });
  const { isLoading, data, isFetching, refetch } = useQuery(
    ["/santri/exam/list", params],
    () => getExam(params),
    {
      keepPreviousData: true,
      select: (response) => response.data,
      staleTime: 60 * 1000 * 10,
      enabled: !!id === false,
    }
  );

  const { data: dataMapel, isFetching: loadMapel } = useQuery(
    ['/list/mapel'],
    () => listMapel(),
    {
      select: (res) => res.data.data
    }
  )

  return { isLoading, data, isFetching, params, setParams, dataMapel, loadMapel, refetch };
};

export const useTakeExam = () => {
  const { successToast, warningToast } = useToast();


 
  const mutate = useMutation(
    (id) => {

      if(id){
        return axios.put(`/santri/exam/take/${id}`);
      }

      return true
      
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

export const useProgressExam = () => {
  const { successToast, warningToast } = useToast();
  const mutate = useMutation(
    (payload) => {
      return axios.put(`/santri/exam/progress`, {
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

export const useSubmitExam = () => {
  const { successToast, warningToast } = useToast();
  const mutate = useMutation(
    (payload) => {
      return axios.put(`/santri/exam/submit`, {
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

export const useListNotif = () => {
  const { data, isFetched } = useQuery(
		['/exam/notif'],
		() => axios.get('/santri/exam/notif').then((res) => res.data)
	)

  return { data, isFetched }
}