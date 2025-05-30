import axios from "axios";
import Cookies from "js-cookie";  
import qs from "qs";

const headers = {
  Accept: "application/json",
  "X-Authorization": `Bearer ${Cookies.get("mysmk_token")}`,
};
const axiosClient = axios.create({
baseURL: "https://bemysmk.devopsgeming.online/",
//baseURL: "http://localhost:8085/",




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
  axiosClient.defaults.headers["X-Authorization"] = `Bearer ${Cookies.get(
    "mysmk_token"
  )}`;
};

export const clearToken = () => {
  delete axiosClient.defaults.headers["mysmk_token"];
};
export default axiosClient;

// https://mysmk.herokuapp.com
