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
  Agenda,
  DetailSiswa,
  PengampuHalaqoh,
  RekapHalaqoh,
  ListJadwal,
  CreateJadwal,
  HalaqohSiswa,
  AddSiswaHalaqoh,
  ListBankSoal,
  FormSoal,
  ListExam,
  FormExam,
} from "./pages/guru";

import NotFound from "./pages/NotFound";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ProtectRoute from "./routers/ProtectRoute";
import ProtectLogin from "./routers/ProtectLogin";

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
        <Route
          path="/login"
          element={
            <ProtectLogin>
              <Login />
            </ProtectLogin>
          }
        />
        <Route
          path="/lupa-password"
          element={
            <ProtectLogin>
              <LupaPassword />
            </ProtectLogin>
          }
        />
        <Route
          path="/reset-password/:id/:token"
          element={
            <ProtectLogin>
              <ResetPassword />
            </ProtectLogin>
          }
        />

        <Route
          path="/guru"
          element={
            <ProtectRoute userRole="Guru Musyrif">
              <Guru />
            </ProtectRoute>
          }
        >
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="daftar-siswa" element={<DaftarSiswa />} />
          <Route path="daftar-siswa/detail/:id" element={<DetailSiswa />} />
          <Route path="absensi" element={<Jadwal />} />
          <Route path="halaqoh-siswa" element={<HalaqohSiswa />} />
          <Route path="halaqoh-siswa/tambah" element={<AddSiswaHalaqoh />} />
          <Route path="absensi/jadwal" element={<ListJadwal />} />
          <Route path="absensi/jadwal/tambah" element={<CreateJadwal />} />
          <Route path="perizinan-kunjungan" element={<Kunjungan />} />
          <Route path="perizinan-pulang" element={<Pulang />} />
          <Route path="pelanggaran" element={<Pelanggaran />} />
          <Route path="prestasi" element={<Prestasi />} />
          <Route path="halaqoh/absensi/:tanggal" element={<AbsensiHalaqoh />} />
          <Route
            path="pengampu/halaqoh/absensi"
            element={<PengampuHalaqoh />}
          />
          <Route path="bank-soal" element={<ListBankSoal />} />

          <Route path="bank-soal/tambah" element={<FormSoal />} />
          <Route path="bank-soal/update/:id" element={<FormSoal />} />
          <Route path="exam" element={<ListExam />} />

          <Route path="exam/tambah" element={<FormExam />} />
          <Route path="exam/update/:id" element={<FormExam />} />

          <Route path="halaqoh/absensi/rekap" element={<RekapHalaqoh />} />
          <Route
            path="pengampu/halaqoh/absensi"
            element={<PengampuHalaqoh />}
          />
          <Route path="sholat" element={<Sholat />} />
          <Route path="laporan-guru-piket" element={<ListGuruPiketToday />} />
          <Route path="absensi/rekap-kehadiran" element={<RekapAbsensi />} />
          <Route path="absensi/rekap-agenda" element={<Agenda />} />
          <Route
            path="laporan-guru-piket/buat-laporan/:id/:tanggal"
            element={<LaporanGuruPiket />}
          />
          <Route
            path="laporan-guru-piket/lihat-laporan/:id/:tanggal"
            element={<LihatLaporanGuruPiket />}
          />
          <Route
            path="absensi/:kelas_id/:mapel_id/:tanggal"
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
