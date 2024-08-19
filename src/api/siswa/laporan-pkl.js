import { useState, useEffect } from "react";
import { useMutation, useQuery, useQueryClient } from "react-query";
import axios from "../axiosClient";
import { syncToken } from "../axiosClient";
import useToast from "../../hook/useToast";
export function getLaporanPkl(params) {
  syncToken();
  return axios.get("/santri/laporan-harian-pkl/list", { params });
}
export function getLaporanPklDetail(id) {
  syncToken();
  return axios.get(`/santri/laporan-harian-pkl/detail/${id}`);
}

export const useLaporanPklList = () => {
  let [params, setParams] = useState({ page: 1, pageSize: 10 });
  const { isLoading, data, isFetching } = useQuery(
    ["/santri/laporan-harian-pkl/list", params],
    () => getLaporanPkl(params),
    {
      keepPreviousData: true,
      select: (response) => response.data,
      staleTime: 60 * 1000 * 10,
    }
  );
  return {
    data,
    isFetching,
    isLoading,
  };
};

export const useLaporanPklDetail = (id) => {
  const { data, isLoading, isFetching } = useQuery(
    ["/santri/laporan-harian-pkl/detail", id],
    () => getLaporanPklDetail(id),
    {
      enabled: id !== undefined,
      select: (response) => response,
    }
  );
};
export function createLaporanPkl(payload) {
  syncToken();
  return axios.post("/santri/laporan-harian-pkl/create", payload);
}
const useUserLocation = () => {
  const [location, setLocation] = useState({
    latitude: null,
    longitude: null,
    error: null,
  });

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            error: null,
          });
        },
        (error) => {
          setLocation({
            latitude: null,
            longitude: null,
            error: error.message,
          });
        }
      );
    } else {
      setLocation({
        latitude: null,
        longitude: null,
        error: "Geolocation is not supported by this browser.",
      });
    }
  }, []);

  return location;
};

export const useCreateLaporanPkl = () => {
  const { successToast, warningToast } = useToast();

  const mutate = useMutation((payload) => createLaporanPkl(payload), {
    onSuccess: (response) => {
      successToast(response);
    },
    onError: (err) => {
      warningToast(err);
    },
  });
  return mutate;
};
