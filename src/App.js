import React from "react";
import { Routes, Route, Link } from "react-router-dom";
import Login from "./pages/auth/login";
import LupaPassword from "./pages/auth/lupa-password";
import ResetPassword from "./pages/auth/reset-password";
import Guru from "./layout/guru";
import Siswa from "./layout/siswa";
import "react-quill/dist/quill.snow.css";
import "katex/dist/katex.min.css";

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
  CreateSiswa,
  EditSiswa,
} from "./pages/guru";

import NotFound from "./pages/NotFound";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ProtectRoute from "./routers/ProtectRoute";
import ProtectLogin from "./routers/ProtectLogin";
import Kehadiran from "./pages/guru/kehadiran";
import PenilaianPage from "./pages/guru/exam/PenilaianPage";
import DashboardGuru from "./pages/guru/dashboard/dashboardguru";
import DashboardSiswa from "./pages/siswa/dashboard/dashboardsiswa";
import Profile from "./pages/siswa/profile";
import ProfileEdit from "./pages/siswa/profile-edit/profile-edit";
import SecuritySiswa from "./pages/siswa/security/SecuritySiswa";
import UjianSiswa from "./pages/siswa/ujian";
import Rapor from "./pages/siswa/rapor/rapor";
import RaporDetail from "./pages/siswa/rapor/raporDetail";
import ExamPage from "./pages/siswa/ujian/ExamPage";
import HasilBelajarGuru from "./pages/guru/hasil-belajar";
import LaporanPkl from "./pages/siswa/laporan-pkl/laporanpkl";
import CreateLaporanPkl from "./pages/siswa/laporan-pkl/create";
import HasilUjian from "./pages/siswa/hasil-ujian";
import AnalisisPage from "./pages/guru/exam/AnalisisPage";
import { UpdateJadwal } from "./pages/guru/jadwal/updateJadwal";
import Materi from "./pages/materi/page";
import RegisterWali from "./pages/auth/RegisterWali";
import Harian from "./pages/guru/jadwal/harian";
import ChatGuru from "./pages/guru/chatguru/chatguru";
import ScanKehadiran from "./pages/guru/scan-kehadiran";
import DetailLaporan from "./pages/siswa/laporan-pkl/detailLaporan";
import UpdateLaporan from "./pages/siswa/laporan-pkl/updateLaporan";
import LaporanDiniyyah from "./pages/siswa/laporan-pkl/laporanDiniyyah";
import HasilBelajar from "./pages/guru/hasil-belajar";
import LiveCoding from "./pages/guru/Live-Coding";
import ReactLivePlayground from "./pages/guru/reactjs";
import Monitoring from "./pages/screen";
import LiveMySQL from "./pages/guru/Live-MySQL";

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
        <Route path="/live-coding" element={<LiveCoding/>} />
        <Route path="/live-mysql" element={<LiveMySQL/>} />
        <Route path="/react-live" element={<ReactLivePlayground/>} />
        <Route
          path="/login"
          element={
            <ProtectLogin>
              <Login />
            </ProtectLogin>
          }
        />
        <Route
          path="/register/wali"
          element={
            <ProtectLogin>
              <RegisterWali />
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
          <Route path="dashboard" element={<DashboardGuru />} />
          <Route path="monitoring" element={<Monitoring />} />
          <Route path="materi" element={<Materi />} />
          <Route path="kehadiran-guru" element={<Kehadiran />} />
          <Route path="daftar-siswa" element={<DaftarSiswa />} />
          <Route path="daftar-siswa/tambah-kelas" element={<CreateSiswa />} />
          <Route path="daftar-siswa/detail/:id" element={<DetailSiswa />} />
          <Route path="daftar-siswa/update-siswa/:id" element={<EditSiswa />} />
          {/* <Route path="daftar-siswa/siswa/profile/" element={<ProfileSiswa />} /> */}
          <Route path="absensi" element={<Jadwal />} />
          <Route path="monitor/harian" element={<Harian />} />
         
          <Route path="halaqoh-siswa" element={<HalaqohSiswa />} />
          <Route path="halaqoh-siswa/tambah" element={<AddSiswaHalaqoh />} />
          <Route path="absensi/jadwal" element={<ListJadwal />} />
          <Route path="absensi/jadwal/tambah" element={<CreateJadwal />} />
          <Route path="absensi/jadwal/update/:id" element={<UpdateJadwal />} />
          <Route path="perizinan-kunjungan" element={<Kunjungan />} />
          <Route path="perizinan-pulang" element={<Pulang />} />
          <Route path="pelanggaran" element={<Pelanggaran />} />
          <Route path="prestasi" element={<Prestasi />} />
          <Route path="halaqoh/absensi/:tanggal" element={<AbsensiHalaqoh />} />
          <Route
            path="pengampu/halaqoh/absensi"
            element={<PengampuHalaqoh />}
          />{" "}
          <Route path="bank-soal" element={<ListBankSoal />} />
          <Route path="bank-soal/tambah" element={<FormSoal />} />
          <Route path="bank-soal/update/:id" element={<FormSoal />} />
          <Route path="exam" element={<ListExam />} />
          <Route path="hasil-belajar" element={<HasilBelajarGuru />} />
          <Route path="exam/tambah" element={<FormExam />} />
          <Route path="exam/penilaian/:id/:mapel" element={<PenilaianPage />} />
          <Route path="exam/update/:id" element={<FormExam />} />
          <Route path="exam/copy/:id" element={<FormExam />} />
          <Route path="exam/analisis/:id/:mapel" element={<AnalisisPage />} />
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
          <Route path="chat" element={<ChatGuru />} />
          <Route path="face" element={<ScanKehadiran />} />
        </Route>

        <Route
          path="/siswa"
          element={
            <ProtectRoute userRole="Santri">
              <Siswa />
            </ProtectRoute>
          }
        >
          <Route path="dashboard" element={<DashboardSiswa />} />
         
          <Route path="laporan-pkl" element={<LaporanPkl />} />
          <Route path="laporan-pkl/create" element={<CreateLaporanPkl />} />
          <Route path="laporan-pkl/detail/:id" element={<DetailLaporan />} />
          <Route path="laporan-pkl/update/:id" element={<UpdateLaporan />} />
          <Route
            path="laporan-pkl/laporan-diniyyah/:id"
            element={<LaporanDiniyyah />}
          />
          <Route path="ujian" element={<UjianSiswa />} />
          <Route path="ujian/:id/" element={<ExamPage />} />
          <Route path="profile" element={<Profile />}>
            <Route path="edit" element={<ProfileEdit />} />
            <Route path="security" element={<SecuritySiswa />} />
          </Route>

          <Route path="hasil-belajar" element={<HasilBelajar />} />
          <Route
            path="hasil-belajar/:id_mapel"
            element={<HasilBelajarGuru />}
          />

          <Route path="hasil-ujian" element={<HasilUjian />} />
          <Route path="rapor" element={<Rapor />} />
          <Route path="rapor/:id_mapel/:ta_id" element={<RaporDetail />} />
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
