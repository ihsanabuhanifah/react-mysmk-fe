import axios from "axios";
import Cookies from "js-cookie";
import qs from "qs";

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

axiosClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (401 === error?.response?.status) {
      Cookies.remove("mysmk_token");
      Cookies.clear();

      clearToken();
      localStorage.clear();
      window.location.replace("/login");
    } else {
      return Promise.reject(error);
    }
  },
);

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
