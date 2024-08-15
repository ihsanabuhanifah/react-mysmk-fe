import axios from "axios";
import Cookies from "js-cookie";  
import qs from "qs";

const headers = {
  Accept: "application/json",
  "X-Authorization": `Bearer ${Cookies.get("mysmk_token")}`,
};

const axiosClient = axios.create({
  // baseURL: "https://mysmk-be.smkmadinatulquran.sch.id/",
  // baseURL: "https://mysmk.herokuapp.com",
  // baseURL : "https://mysmk-be-production.herokuapp.com/",
// baseURL: "http://localhost:8085/",
baseURL : "https://backend-mysmk-dev.smkmadinatulquran.sch.id/",
 // baseURL : "https://backend-mysmk.smkmadinatulquran.sch.id/",




const axiosClient = axios.create({
  baseURL: "https://backend-mysmk-dev.smkmadinatulquran.sch.id/",
  timeout: 1000 * 60 * 3,
  paramsSerializer: function (params) {
    return qs.stringify(params, { encode: false, skipNulls: true });
  },
  headers,
});

axiosClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      Cookies.remove("mysmk_token");
      clearToken();
      localStorage.clear();
      window.location.replace("/login");
    } else {
      return Promise.reject(error);
    }
  }
);

export const syncToken = () => {
  axiosClient.defaults.headers["X-Authorization"] = `Bearer ${Cookies.get("mysmk_token")}`;
};

export const clearToken = () => {
  delete axiosClient.defaults.headers["X-Authorization"];
};

export default axiosClient;