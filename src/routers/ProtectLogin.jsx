import React from "react";
import { Navigate } from "react-router-dom";
import Cookies from "js-cookie";
import jwt_decode from "jwt-decode";

export default function ProtectLogin({ children, userRole }) {
  const auth = Cookies.get("mysmk_token");
  let roles
 if(auth){
   roles = jwt_decode(Cookies.get("mysmk_token"));
 }
  return auth === undefined ? children : <Navigate to={roles?.role === "Santri" ? "/siswa/dashboard" : "/guru/dashboard"} />;
}
//
