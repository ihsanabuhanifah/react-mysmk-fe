import { useQuery } from "react-query";
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

export function getRoleMe() {
  syncToken();
  return axios.get("/guru/get-role-guru");
}

export function saveToken(token) {
  syncToken();
  console.log(token);
  return axios.put("/guru/token/save", {
    token,
  });
}


export const useAuthMe =() => {
  let { data: dataMe } = useQuery(
    //query key
    ["authme", ],
    //axios function,triggered when page/pageSize change
    () => authme(),
    //configuration
    {
      staleTime: 60 * 1000 * 60 * 12, // 12 jam,
      select: (response) => response.data
     
    }
  );

  return {dataMe}
}