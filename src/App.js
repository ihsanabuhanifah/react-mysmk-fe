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
  LihatLaporanGuruPiket,
  RekapAbsensi,
  DaftarSiswa,
  Agenda
} from "./pages/guru";

import NotFound from "./pages/NotFound";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ProtectRoute from "./routers/ProtectRoute";

function App() {
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
          <Route path="daftar-siswa" element={<DaftarSiswa />} />

          <Route path="absensi" element={<Jadwal />} />
          <Route path="perizinan-kunjungan" element={<Kunjungan />} />
          <Route path="perizinan-pulang" element={<Pulang />} />
          <Route path="pelanggaran" element={<Pelanggaran />} />
          <Route path="prestasi" element={<Prestasi />} />
          <Route path="halaqoh/absensi/:tanggal" element={<AbsensiHalaqoh />} />
          <Route path="sholat" element={<Sholat />} />
          <Route path="laporan-guru-piket" element={<ListGuruPiketToday />} />
          <Route path="absensi/rekap" element={<RekapAbsensi />} />
          <Route path="agenda/rekap" element={<Agenda />} />
          <Route
            path="laporan-guru-piket/buat-laporan/:id/:tanggal"
            element={<LaporanGuruPiket />}
          />
          <Route
            path="laporan-guru-piket/lihat-laporan/:id/:tanggal"
            element={<LihatLaporanGuruPiket />}
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
