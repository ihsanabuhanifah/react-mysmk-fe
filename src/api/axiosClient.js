import axios from "axios";
import Cookies from "js-cookie";
import qs from "qs";
import { attachRefreshInterceptor } from "./tokenManager";

const headers = {
  Accept: "application/json",
  "X-Authorization": `Bearer ${Cookies.get("mysmk_token")}`,
};
const axiosClient = axios.create({
  baseURL: process.env.REACT_APP_API_URL || "http://localhost:8085/",
  timeout: 1000 * 60 * 3,
  paramsSerializer: function (params) {
    return qs.stringify(params, { encode: false, skipNulls: true });
  },
  headers,
});

axiosClient.interceptors.request.use(
  function (config) {
    // Do something before request is sent

    config.headers["X-Authorization"] = `Bearer ${Cookies.get("mysmk_token")}`;
    return config;
  },
  function (error) {
    // Do something with request error
    return Promise.reject(error);
  },
);

// 401 -> tukar refresh token otomatis lalu ulangi request; gagal -> ke /login
// (lihat api/tokenManager.js)
attachRefreshInterceptor(axiosClient);

export const syncToken = () => {
  // axiosClient.defaults.headers["X-Authorization"] = `Bearer ${Cookies.get(
  //   "mysmk_token"
  // )}`;
};

export const clearToken = () => {
  delete axiosClient.defaults.headers["mysmk_token"];
};
export default axiosClient;

// https://mysmk.herokuapp.com
