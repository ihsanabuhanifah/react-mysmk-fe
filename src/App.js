import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/auth/login";
import Admin from "./layout/admin";
import Absensi from "./pages/guru/absensi";
import Dashboard from "./pages/guru/dashboard";
// import Dashboard from "./pages/Admin/Dashboard";
import ProtectRoute from "./routers/ProtectRoute";
function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route
        path="admin/"
        element={
          <ProtectRoute>
            <Admin />
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
