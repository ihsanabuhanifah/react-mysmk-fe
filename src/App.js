import React from "react";
import { Routes, Route, Navigate, Link } from "react-router-dom";
import Login from "./pages/auth/login";
import Guru from "./layout/guru";
import Siswa from "./layout/siswa";
import Absensi from "./pages/guru/absensi";
import Dashboard from "./pages/guru/dashboard";
// import Dashboard from "./pages/Guru/Dashboard";
import ProtectRoute from "./routers/ProtectRoute";
function App() {
  return (
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
        <Route path="absensi" element={<Absensi />} />
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
        <Route path="absensi" element={<Absensi />} />
      </Route>
    </Routes>
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
