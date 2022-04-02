import React from "react";
import { Routes, Route, Navigate, Link } from "react-router-dom";
import Login from "./pages/auth/login";
import Guru from "./layout/guru";
import Siswa from "./layout/siswa";
import {
  Jadwal,
  Absensi,
  Dashboard,
  Halaqoh,
  Kunjungan,
  Pulang,
} from "./pages/guru";
import NotFound from "./pages/NotFound";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ProtectRoute from "./routers/ProtectRoute";

function App() {
  return (
    <>
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
          <Route path="kunjungan" element={<Kunjungan />} />
          <Route path="pulang" element={<Pulang />} />
          <Route path="halaqoh/:tanggal" element={<Halaqoh />} />
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
    </>
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
