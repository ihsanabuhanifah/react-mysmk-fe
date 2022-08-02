import axios from "./axiosClient";
import { syncToken } from "./axiosClient";
export function register(values) {
  return axios.post("/register", values);
}

export function login(values) {
  return axios.post("/login", values);
}

export function authme() {
  syncToken();

  return axios.get("/authme");
}

export function postLupaPassword(values) {
  return axios.post("/forgot-password", values);
}

export function postResetPassword(id, token, values) {
  return axios.post(`reset-password/${id}/${token}`, values);
}
