

import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Auth/Login";
import Register from "./pages/Auth/Register";
import Dashboard from "./pages/Admin/Dashboard";
import ProtectRoute from "./routers/ProtectRoute";
function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      
      <Route
        path="/dashboard"
        element={
          <ProtectRoute>
            <Dashboard />
          </ProtectRoute>
        }
      />
        <Route path="/" element={<Navigate replace to="/login" />} />
        <Route path="*" element={<Navigate replace to="/login" />} />
    </Routes>
    
  );
}

export default App;
