import axios from "axios";
import Cookies from "js-cookie";
import qs from "qs";
import { attachRefreshInterceptor } from "./tokenManager";

const headers = {
  Accept: "application/json",
  "X-Authorization": `Bearer ${Cookies.get("mysmk_token")}`,
};
const axiosClientStorage = axios.create({
  // sebelumnya selalu ke server produksi; kini mengikuti .env (fallback produksi)
  baseURL: process.env.REACT_APP_API_STORAGE_URL || "https://bemysmk.smkmadinatulquran.sch.id",
 



  timeout: 1000 * 60 * 3,
  paramsSerializer: function (params) {
    return qs.stringify(params, { encode: false, skipNulls: true });
  },
  headers,
});

axiosClientStorage.interceptors.request.use(
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
attachRefreshInterceptor(axiosClientStorage);



export const clearToken = () => {
  delete axiosClientStorage.defaults.headers["mysmk_token"];
};
export default axiosClientStorage;

// https://mysmk.herokuapp.com
