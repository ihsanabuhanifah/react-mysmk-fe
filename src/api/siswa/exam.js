import { useMutation, useQuery, useQueryClient } from "react-query";
import axios from "../axiosClient";
import { syncToken } from "../axiosClient";
import { toast } from "react-toastify";
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
  let [params, setParams] = useState({
    page: 1,
    pageSize: 10,
    status: "",
    judul_ujian: "",
    nama_mapel: "",
  });

  const { isLoading, data, isFetching } = useQuery(
    ["/santri/exam/list", params],
    () => getExam(params),
    {
      keepPreviousData: true,
      select: (response) => response.data,
      staleTime: 60 * 1000 * 10,
      enabled: !!id === false,
    },
  );

  const { data: dataMapel, isFetching: loadMapel } = useQuery(
    ["/list/mapel"],
    () => listMapel(),
    {
      select: (res) => res.data.data,
    },
  );

  return {
    isLoading,
    data,
    isFetching,
    params,
    setParams,
    dataMapel,
    loadMapel,
  };
};

export const useTakeExam = () => {
  const { successToast, warningToast } = useToast();
  const mutate = useMutation(
    (id) => {
      return axios.put(`/santri/exam/take/${id}`);
    },
    {
      onSuccess: (response) => {
        successToast(response);
      },

      onError: (error) => {
        console.log("err", error.response);
        warningToast(error);
      },
    },
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
    },
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
    },
  );
  return mutate;
};

export const useListNotif = () => {
  const { data, isFetched } = useQuery(["/exam/notif"], () =>
    axios.get("/santri/exam/notif").then((res) => res.data),
  );

  return { data, isFetched };
};

export const myMapel = [
  {
    id: 1,
    nama_mapel: "Pendidikan Agama Islam",
    kategori: "1",
    img: 'pai',
    is: 'agama'
  },
  {
    id: 2,
    nama_mapel: "Pendidikan Pancasila",
    kategori: "1",
    img: 'pp',
    is: 'umum'
  },
  {
    id: 3,
    nama_mapel: "Sejarah",
    kategori: "1",
    img: 'sejarah',
    is: 'umum'
  },
  {
    id: 4,
    nama_mapel: "PJOK",
    kategori: "1",
    img: 'pjok',
    is: 'umum'
  },
  {
    id: 5,
    nama_mapel: "Bahasa Indonesia",
    kategori: "1",
    img: 'indo',
    is: 'umum'
  },
  {
    id: 6,
    nama_mapel: "Seni Budaya",
    kategori: "1",
    img: 'seni',
    is: 'umum'
  },
  {
    id: 7,
    nama_mapel: "Matematika",
    kategori: "1",
    img: 'math',
    is: 'umum'
  },
  {
    id: 8,
    nama_mapel: "IPAS",
    kategori: "1",
    img: 'ipas',
    is: 'umum'
  },
  {
    id: 9,
    nama_mapel: "Bahasa Inggris",
    kategori: "1",
    img: 'english',
    is: 'umum'
  },
  {
    id: 10,
    nama_mapel: "Fullstack Development",
    kategori: "1",
    img: 'fullstack',
    is: 'kejuruan'
  },
  {
    id: 11,
    nama_mapel: "Mobile Develoment",
    kategori: "1",
    img: 'mobile',
    is: 'kejuruan'
  },
  {
    id: 12,
    nama_mapel: "Dasar Bidang Kejuruan 1",
    kategori: "1",
    img: 'kejuruan',
    is: 'kejuruan'
  },
  {
    id: 13,
    nama_mapel: "Server Administration",
    kategori: "1",
    img: 'server',
    is: 'kejuruan'
  },
  {
    id: 14,
    nama_mapel: "Network Administration",
    kategori: "1",
    img: 'network',
    is: 'kejuruan'
  },
  {
    id: 15,
    nama_mapel: "Dasar Bidang Kejuruan 2",
    kategori: "1",
    img: 'kejuruan',
    is: 'kejuruan'
  },
  {
    id: 16,
    nama_mapel: "Dasar Bidang Kejuruan 4",
    kategori: "1",
    img: 'kejuruan',
    is: 'kejuruan'
  },
  {
    id: 17,
    nama_mapel: "Fiqih",
    kategori: "1",
    img: 'fiqih',
    is: 'agama'
  },
  {
    id: 18,
    nama_mapel: "Aqidah",
    kategori: "1",
    img: 'aqidah',
    is: 'agama'
  },
  {
    id: 19,
    nama_mapel: "Dasar Bidang Kejuruan 3",
    kategori: "1",
    img: 'kejuruan',
    is: 'kejuruan'
  },
  {
    id: 20,
    nama_mapel: "Adab",
    kategori: "1",
    img: 'adab',
    is: 'agama'
  },
  {
    id: 21,
    nama_mapel: "Hadits",
    kategori: "1",
    img: 'hadits',
    is: 'agama'
  },
  {
    id: 22,
    nama_mapel: "Kajian",
    kategori: "1",
    img: 'kajian',
    is: 'agama'
  },
  {
    id: 23,
    nama_mapel: "Tajwid",
    kategori: "1",
    img: 'tajwid',
    is: 'agama'
  },
  {
    id: 24,
    nama_mapel: "Ulumulquran",
    kategori: "1",
    img: 'umulquran',
    is: 'agama'
  },
  {
    id: 25,
    nama_mapel: "Ujian PPDB",
    kategori: "1",
    img: 'fullstack',
    is: 'Lainnya'
  },
];

export const optionMapel = [
  {key: 'kejuruan', text: 'Kejuruan'},
  {key: 'umum', text: 'Umum'},
  {key: 'agama', text: 'Agama'},
  {key: 'lainnya', text: 'Lainnya'},
]