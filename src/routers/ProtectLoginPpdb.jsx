import React from "react";
import { Navigate } from "react-router-dom";
import Cookies from "js-cookie";

const PrivateRoute = ({ children }) => {
  const isAuthenticated = Cookies.get("mysmk_token");

  return isAuthenticated ? children : <Navigate to="/ppdb/login" />;
};

export default PrivateRoute;
