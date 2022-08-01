import React from "react";
import { Routes, Route, Link } from "react-router-dom";
import Login from "./pages/auth/login";
import LupaPassword from "./pages/auth/lupa-password";
import ResetPassword from "./pages/auth/reset-password";
import Guru from "./layout/guru";
import Siswa from "./layout/siswa";
import {
  Jadwal,
  Absensi,
  Dashboard,
  Kunjungan,
  Pulang,
  Pelanggaran,
  Prestasi,
  Sholat,
  AbsensiHalaqoh,
  LaporanGuruPiket,
  ListGuruPiketToday,
  LihatLaporanGuruPiket,RekapAbsensi
} from "./pages/guru";
import { useQuery } from "react-query";
import { authme } from "./api/auth";
import jwt_decode from "jwt-decode";
import NotFound from "./pages/NotFound";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ProtectRoute from "./routers/ProtectRoute";
import { listKelas, listGuru, listTahunAjaran, listMapel } from "./api/list";


function App() {
  let { data } = useQuery(
    //query key
    ["authme"],
    //axios function,triggered when page/pageSize change
    () => authme(),
    //configuration
    {
      staleTime: 60 * 1000 * 60 * 12, // 12 jam,
      select: (response) => {
        const data = response?.data?.token;

        let decoded = jwt_decode(data);
        return decoded;
      },
    }
  );

  let { data: dataKelas } = useQuery(
    //query key
    ["list_kelas"],
    //axios function,triggered when page/pageSize change
    () => listKelas(),
    //configuration
    {
      keepPreviousData: true,
      staleTime: 60 * 1000 * 60 * 12, // 12 jam,
      select: (response) => response.data,
    }
  );


  let { data: dataMapel } = useQuery(
    //query key
    ["list_mapel"],
    //axios function,triggered when page/pageSize change
    () => listMapel(),
    //configuration
    {
      keepPreviousData: true,
      staleTime: 60 * 1000 * 60 * 12, // 12 jam,
      select: (response) => response.data,
    }
  );
  let { data: dataGuru } = useQuery(
    //query key
    ["list_guru"],
    //axios function,triggered when page/pageSize change
    () => listGuru(),
    //configuration
    {
      keepPreviousData: true,
      staleTime: 60 * 1000 * 60 * 12, // 12 jam,
      select: (response) => response.data,
    }
  );
  let { data: dataTa } = useQuery(
    //query key
    ["list_tahun_ajaran"],
    //axios function,triggered when page/pageSize change
    () => listTahunAjaran(),
    //configuration
    {
      keepPreviousData: true,
      staleTime: 60 * 1000 * 60 * 12, // 12 jam,
      select: (response) => response.data,
    }
  );
  return (
    <div className="font-poppins">
      <ToastContainer
        position="top-right"
        autoClose={2000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/lupa-password" element={<LupaPassword />} />
        <Route path="/reset-password/:id/:token" element={<ResetPassword />} />

        <Route
          path="/guru"
          element={
            <ProtectRoute userRole="Guru">
              <Guru />
            </ProtectRoute>
          }
        >
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="jadwal" element={<Jadwal />} />
          <Route path="perizinan-kunjungan" element={<Kunjungan />} />
          <Route path="perizinan-pulang" element={<Pulang />} />
          <Route path="pelanggaran" element={<Pelanggaran />} />
          <Route path="prestasi" element={<Prestasi />} />
          <Route path="halaqoh/absensi/:tanggal" element={<AbsensiHalaqoh />} />
          <Route path="sholat" element={<Sholat />} />
          <Route path="laporan-guru-piket" element={<ListGuruPiketToday identitas={data}  />} />
          <Route path="absensi/rekap" element={<RekapAbsensi  listKelas={dataKelas} listGuru={dataGuru} listTa={dataTa} identitas={data} listMapel={dataMapel}  />} />
          <Route
            path="laporan-guru-piket/buat-laporan/:id/:tanggal"
            element={<LaporanGuruPiket listKelas={dataKelas} listGuru={dataGuru} />}
          />
           <Route
            path="laporan-guru-piket/lihat-laporan/:id/:tanggal"
            element={<LihatLaporanGuruPiket listKelas={dataKelas} listGuru={dataGuru} />}
          />
          <Route
            path="jadwal/absensi/:kelas_id/:mapel_id/:tanggal"
            element={<Absensi />}
          />
        </Route>
        <Route
          path="/siswa"
          element={
            <ProtectRoute userRole="Wali Santri">
              <Siswa />
            </ProtectRoute>
          }
        >
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="absensi" element={<Jadwal />} />
        </Route>
        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  );
}

export default App;

const Home = () => {
  return (
    <div>
      <p>Home</p>
      <Link to="/login">login</Link>
    </div>
  );
};
