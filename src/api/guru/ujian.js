//guru

import { useMutation, useQuery, useQueryClient } from "react-query";
import axios from "../axiosClient";
import { syncToken } from "../axiosClient";
import useToast from "../../hook/useToast";
import { usePagination } from "../../hook/usePagination";
export function listUjian(params) {
  return axios.get("/guru/ujian/list", { params });
}
export function listUjianBerjalan(params) {
  return axios.get("/guru/ujian/list/berjalan", { params });
}


export const useListUjian = () => {
  const {
    params,
    keyword,
    setParams,
    handleFilter,
    handleClear,
    handlePageSize,
    handlePage,
    filterParams,
    handlePayload,
    handleSearch,
  } = usePagination({
    teacher_id: "",
    kelas_id: "",
    mapel_id: "",
    ta_id: "",
    page: 1,
    pageSize: 10,
    is_all: 1,
    jenis_ujian: "",
  });

  let { data, isLoading, isFetching, refetch } = useQuery(
    //query key
    ["/ujian/list", [filterParams]],
    //axios function,triggered when page/pageSize change
    () => listUjian(filterParams),
    //configuration
    {
      // refetchInterval: 1000 * 60 * 60,
      refetchOnWindowFocus: false,
      staleTime: 1000 * 60 * 60 * 5,
      select: (response) => {
        return response.data;
      },
    },
  );

  return {
    isLoading,
    data,
    isFetching,
    params,
    keyword,
    setParams,
    handleFilter,
    handleClear,
    handlePageSize,
    handlePage,
    filterParams,
    handleSearch,
    handlePayload,
    refetch
  };
};

export function createUjian(payload) {
  return axios.post("/guru/ujian/create", payload);
}

export function deleteUjian(id) {
  return axios.delete(`guru/ujian/delete/${id}`);
}

export function detailUjian(id) {
  return axios.get(`guru/ujian/detail/${id}`);
}

export function notifikasiExam() {
  syncToken();
  return axios.get("/guru/nilai/notifikasi");
}

export function updateUjian(id, values) {
  let payload = values.payload[0];

  return axios.put(`guru/ujian/update/${id}`, payload);
}

export const useCreatePenilaian = () => {
  let queryClient = useQueryClient();
  const { successToast, warningToast } = useToast();
  const mutate = useMutation(
    (payload) => {
      // Fungsi untuk mengurangi 7 jam dari waktu yang diberikan
      const adjustTime = (datetime) => {
        if (!datetime) return datetime;
        const date = new Date(datetime);
        date.setHours(date.getHours() - 7);
        return date.toISOString(); // atau format yang sesuai dengan kebutuhan backend
      };

      return axios.post(`/guru/nilai/create`, {
        id: payload.id,
        waktu_mulai: adjustTime(payload.waktu_mulai),
        waktu_selesai: adjustTime(payload.waktu_selesai),
        kelas_id: payload.kelas_id,
        mapel_id: payload.mapel_id,
        durasi: payload.durasi,
        jenis_ujian: payload.jenis_ujian,
        ta_id: payload?.ta_id,
        urutan: payload?.urutan,
        is_hirarki: payload.is_hirarki,
      });
    },
    {
      onSuccess: (response) => {
        queryClient.invalidateQueries("/ujian/list");
        successToast(response);
      },
      onError: (error) => {
        warningToast(error);
      },
    },
  );
  return mutate;
};
export function listPenilaianMateri(params) {
  syncToken();
  return axios.get("/guru/nilai/list/teacher", { params });
}

export const usePenilaian = (payload) => {
  const { isLoading, data, isFetching, refetch } = useQuery(
    ["/guru/nilai/list/teacher", payload],
    () => listPenilaianMateri(payload),
    {
      keepPreviousData: true,
      select: (response) => response.data,
      refetchOnWindowFocus: false,
      staleTime: 1000 * 60 * 60 * 5,
    },
  );

  return { isLoading, data, isFetching, refetch };
};

//soal
export function listSoal(id) {
  syncToken();
  return axios.get(`/guru/nilai/soal/teacher/${id}`);
}

export const useSoal = (id) => {
  const { isLoading, data, isFetching } = useQuery(
    ["/guru/nilai/list/teacher", id],
    () => listSoal(id),
    {
      keepPreviousData: true,
      enabled: !!id === true,

      select: (response) => response.data,
      refetchOnWindowFocus: false,
      staleTime: 1000 * 60 * 60 * 5,
    },
  );

  return { isLoading, data, isFetching };
};

//soal

export const useRemidial = () => {
  let queryClient = useQueryClient();
  const { successToast, warningToast } = useToast();
  const mutate = useMutation(
    (payload) => {
      return axios.put(`/guru/nilai/remidial/teacher`, {
        payload,
      });
    },
    {
      onSuccess: (response) => {
        queryClient.invalidateQueries("/guru/nilai/list/teacher");
        successToast(response);
      },

      onError: (error) => {
        warningToast(error);
      },
    },
  );
  return mutate;
};

export const useRefreshCount = () => {
  let queryClient = useQueryClient();
  const { successToast, warningToast } = useToast();
  const mutate = useMutation(
    (payload) => {
      return axios.put(`/guru/nilai/refresh/teacher`, {
        payload,
      });
    },
    {
      onSuccess: (response) => {
        queryClient.invalidateQueries("/guru/nilai/list/teacher");
        successToast(response);
      },

      onError: (error) => {
        warningToast(error);
      },
    },
  );
  return mutate;
};

export const useUpdateLastExam = () => {
  let queryClient = useQueryClient();
  const { successToast, warningToast } = useToast();
  const mutate = useMutation(
    (payload) => {
      return axios.put(`/guru/nilai/update-last-exam`, payload);
    },
    {
      onSuccess: (response) => {
        queryClient.invalidateQueries("/guru/nilai/list/teacher");
        successToast(response);
      },

      onError: (error) => {
        warningToast(error);
      },
    },
  );
  return mutate;
};

export const useExamResult = () => {
  let queryClient = useQueryClient();
  const { successToast, warningToast } = useToast();
  const mutate = useMutation(
    (payload) => {
      return axios.put(`/guru/nilai/exam-result`, payload);
    },
    {
      onSuccess: (response) => {
        queryClient.invalidateQueries("/guru/nilai/list/teacher");
        queryClient.invalidateQueries("/guru//nilai/notifikasi");
        successToast(response);
      },

      onError: (error) => {
        warningToast(error);
      },
    },
  );
  return mutate;
};

export function getAnalisUjian(id) {
  syncToken();
  return axios.get(`/guru/ujian/analisa/${id}`);
}

export const useAnalisisUjian = (id) => {
  const { isLoading, data, isFetching } = useQuery(
    ["/guru/ujian/analisa", id],
    () => getAnalisUjian(id),
    {
      keepPreviousData: true,
      enabled: !!id === true,

      select: (response) => response.data,
      staleTime: 60 * 1000 * 10,
    },
  );

  return { isLoading, data, isFetching };
};

export const useCekUrutan = () => {
  const { successToast, warningToast } = useToast();
  const mutate = useMutation(
    (payload) => {
      return axios.post(`guru//ujian/cek-urutan`, payload);
    },
    {
      onSuccess: (response) => {
        successToast(response);
      },

      onError: (error) => {
        warningToast(error);
      },
    },
  );
  return mutate;
};

export function imageParse(file) {
  syncToken();
  const formData = new FormData();
  formData.append("file", file);
  return axios.post("/soal/image", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
}




export const useListUjianBerjalan = () => {
  const {
    params,
    keyword,
    setParams,
    handleFilter,
    handleClear,
    handlePageSize,
    handlePage,
    filterParams,
    handlePayload,
    handleSearch,
  } = usePagination({
    teacher_id: "",
    kelas_id: "",
    mapel_id: "",
    ta_id: "",
    page: 1,
    pageSize: 10,
    jenis_ujian: "",
  });

  let { data, isLoading, isFetching, refetch } = useQuery(
    //query key
    ["/ujian/list/berjalan", [filterParams]],
    //axios function,triggered when page/pageSize change
    () => listUjianBerjalan(filterParams),
    //configuration
    {
      // refetchInterval: 1000 * 60 * 60,
      refetchOnWindowFocus: false,
      staleTime: 1000 * 60 * 60 * 5,
      select: (response) => {
        return response.data;
      },
    },
  );

  return {
    isLoading,
    data,
    isFetching,
    params,
    keyword,
    setParams,
    handleFilter,
    handleClear,
    handlePageSize,
    handlePage,
    filterParams,
    handleSearch,
    handlePayload,
    refetch
  };
};


export function listUjianHariIni(params) {
  return axios.get("/guru/ujian/list/hari-ini", { params });
}



export const useListUjianHariIni = () => {
  const {
    params,
    keyword,
    setParams,
    handleFilter,
    handleClear,
    handlePageSize,
    handlePage,
    filterParams,
    handlePayload,
    handleSearch,
  } = usePagination({
    teacher_id: "",
    kelas_id: "",
    mapel_id: "",
    ta_id: "",
    page: 1,
    pageSize: 10,
    jenis_ujian: "",
  });

  let { data, isLoading, isFetching, refetch } = useQuery(
    //query key
    ["/ujian/list/hari-ini", [filterParams]],
    //axios function,triggered when page/pageSize change
    () => listUjianHariIni(filterParams),
    //configuration
    {
      // refetchInterval: 1000 * 60 * 60,
      refetchOnWindowFocus: false,
      staleTime: 1000 * 60 * 60 * 5,
      select: (response) => {
        return response.data;
      },
    },
  );

  return {
    isLoading,
    data,
    isFetching,
    params,
    keyword,
    setParams,
    handleFilter,
    handleClear,
    handlePageSize,
    handlePage,
    filterParams,
    handleSearch,
    handlePayload,
    refetch
  };
};
