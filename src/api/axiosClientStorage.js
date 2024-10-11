import axios from "axios";
import Cookies from "js-cookie";  
import qs from "qs";

const headers = {
  Accept: "application/json",
  "X-Authorization": `Bearer ${Cookies.get("mysmk_token")}`,
};
const axiosClientStorage = axios.create({
  baseURL: "https://storage.devopsgeming.online/",
  // baseURL: "https://mysmk.herokuapp.com",
  // baseURL : "https://mysmk-be-production.herokuapp.com/",
// baseURL: "http://localhost:3888/",
// baseURL : "https://backend-mysmk-dev.smkmadinatulquran.sch.id/",
// baseURL : "https://backend-mysmk.smkmadinatulquran.sch.id/",



  timeout: 1000 * 60 * 3,
  paramsSerializer: function (params) {
    return qs.stringify(params, { encode: false, skipNulls: true });
  },
  headers,
});
axiosClientStorage.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (401 === error?.response?.status) {
      Cookies.remove("mysmk_token");
      Cookies.clear()

      clearToken();
      localStorage.clear();
      window.location.replace("/login");
    } else {
      return Promise.reject(error);
    }
  }
);

export const syncToken = () => {
  axiosClientStorage.defaults.headers["X-Authorization"] = `Bearer ${Cookies.get(
    "mysmk_token"
  )}`;
};

export const clearToken = () => {
  delete axiosClientStorage.defaults.headers["mysmk_token"];
};
export default axiosClientStorage;

// https://mysmk.herokuapp.com
