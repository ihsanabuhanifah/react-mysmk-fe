import { useMutation, useQuery, useQueryClient } from "react-query";
import { formatHari } from "../../utils";
import axios from "../axiosClient";
import { syncToken } from "../axiosClient";
import dayjs from "dayjs";
import { toast } from "react-toastify";
import useToast from "../../hook/useToast";
import { useState } from "react";
export function listJadwal(params) {
  syncToken();
  return axios.get("/guru/jadwal/list", { params });
}
export function createJadwalHandle(payload) {
  syncToken();
  return axios.post("/guru/jadwal/create", payload);
}
export function listJadwalAll(params) {
  syncToken();
  return axios.get("/guru/jadwal/list-all", { params });
}

export function listAbsensi(params) {
  syncToken();
  console.log(params);
  return axios.get("guru/absensi/list", { params });
}
export function rekapAbsensi(params) {
  syncToken();
  console.log(params);
  return axios.get("guru/absensi/rekap", { params });
}
export function rekapAgenda(params) {
  syncToken();
  console.log(params);
  return axios.get("guru/agenda/rekap", { params });
}

export function downloadRekapAbsensi(params) {
  return axios.get("guru/absensi/rekap/download", {
    responseType: "arraybuffer",
    params,
  });
}
export async function updateAbsensi(values) {
  syncToken();
  let absensi_kehadiran = [];
  await Promise.all(
    // eslint-disable-next-line array-callback-return
    values?.absensi_kehadiran?.map((data, index) => {
      let absensi = {
        id: data?.id,
        student_id: data?.siswa?.id,
        status_kehadiran: parseFloat(data?.kehadiran?.id),
        keterangan: data?.keterangan,
      };
      data = absensi;
      absensi_kehadiran.push(absensi);
    })
  );

  values.absensi_kehadiran = absensi_kehadiran;

  return axios.put("/guru/absensi/update", values);
}

export function notifikasiAbsensi() {
  syncToken();
  return axios.get("/guru/absensi/notifikasi");
}

export function absensiManualCreate() {
  syncToken();
  return axios.get("/guru/absensi/manual", {
    params: {
      hari: formatHari(new Date()),
      tanggal: dayjs(new Date()).format("YYYY-MM-DD"),
    },
  });
}
export function halaqohManualCreate() {
  syncToken();
  return axios.get("/guru/halaqoh/manual", {
    params: {
      hari: formatHari(new Date()),
      tanggal: dayjs(new Date()).format("YYYY-MM-DD"),
    },
  });
}

export function monitor() {
  syncToken();
  return axios.get("/monitor");
}

export function belumAbsen() {
  syncToken();
  return axios.get("/guru/absensi/guru-belum-absen");
}

export function listKehadiranGuru(params) {
  syncToken();
  return axios.get("/guru/list/kehadiran", { params });
}

export const useKehadiran = ({ tanggal }) => {
  const { isLoading, data, isFetching } = useQuery(
    ["/guru/list/kehadiran", tanggal],
    () => listKehadiranGuru({ tanggal }),
    {
      keepPreviousData: true,
      select: (response) => response.data,
      staleTime: 60 * 1000 * 10,
    }
  );

  return { isLoading, data, isFetching };
};

export const useSubmitDatang = ({ tanggal }) => {
  const queryClient = useQueryClient();
  const { successToast, warningToast } = useToast();
  const mutate = useMutation(
    (payload) => {
      return axios.put(`/guru/submit-datang/kehadiran`, {
        tanggal,
      });
    },
    {
      onSuccess: (response) => {
        queryClient.invalidateQueries("/guru/list/kehadiran");

        successToast(response);
      },

      onError: (error) => {
        warningToast(error);
      },
    }
  );
  return mutate;
};

export const useSubmitPulang = ({ tanggal }) => {
  const queryClient = useQueryClient();

  const { successToast, warningToast } = useToast();
  const mutate = useMutation(
    (payload) => {
      return axios.put(`/guru/submit-pulang/kehadiran`, {
        tanggal,
      });
    },
    {
      onSuccess: (response) => {
        queryClient.invalidateQueries("/guru/list/kehadiran");

        successToast(response);
      },

      onError: (error) => {
        warningToast(error);
      },
    }
  );
  return mutate;
};

export const useSubmitIzin = ({ tanggal, status, keterangan }) => {
  const queryClient = useQueryClient();
  const { successToast, warningToast } = useToast();
  const mutate = useMutation(
    (payload) => {
      return axios.put(`/guru/submit-izin/kehadiran`, {
        tanggal,
        keterangan,
        status,
      });
    },
    {
      onSuccess: (response) => {
        queryClient.invalidateQueries("/guru/list/kehadiran");

        successToast(response);
      },

      onError: (error) => {
        warningToast(error);
      },
    }
  );
  return mutate;
};

export const useSubmitByAdmin = ({ tanggal, status, keterangan, values }) => {
  const queryClient = useQueryClient();
  const { successToast, warningToast } = useToast();
  const mutate = useMutation(
    (payload) => {
      return axios.put(`/guru/submit-by-Admin/kehadiran`, {
        tanggal,
        keterangan,
        status,
        values,
      });
    },
    {
      onSuccess: (response) => {
        queryClient.invalidateQueries("/guru/list/kehadiran");

        successToast(response);
      },

      onError: (error) => {
        warningToast(error);
      },
    }
  );
  return mutate;
};

export function listAbsensiHarian(params) {
  syncToken();
  return axios.get("/guru/agenda/harian", { params });
}

export const useAbsensiHarian = () => {
  let [params, setParams] = useState({
    tanggal: dayjs(new Date()).format("YYYY-MM-DD"),
  });
  const { isLoading, data, isFetching , refetch} = useQuery(
    ["/guru/absensi/harian", params],
    () => listAbsensiHarian(params),
    {
      keepPreviousData: true,
      select: (response) => response.data,
      staleTime: 60 * 1000 * 10,
    }
  );

  return { isLoading, data, isFetching, setParams, params, refetch };
};
