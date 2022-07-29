import axios from "axios";
import Cookies from "js-cookie";
import qs from "qs";
const headers = {
  Accept: "application/json",
  "X-Authorization": `Bearer ${Cookies.get("mysmk_token")}`,
};
const axiosClient = axios.create({
  baseURL: "https://mysmk.herokuapp.com",
  // baseURL : "https://mysmk-be-production.herokuapp.com/",
  baseURL: "http://localhost:8081",
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

    console.log('err',error)
    if (401 === error?.response?.status) {
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
  axiosClient.defaults.headers["X-Authorization"] = `Bearer ${Cookies.get(
    "mysmk_token"
  )}`;
};

export const clearToken = () => {
  delete axiosClient.defaults.headers["mysmk_token"];
};
export default axiosClient;

// https://mysmk.herokuapp.com
