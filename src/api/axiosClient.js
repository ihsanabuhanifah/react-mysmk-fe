import axios from "axios";
import Cookies from "js-cookie";
import qs from "qs";
const headers = {
  Accept: "application/json",
  "X-Authorization": `Bearer ${Cookies.get("mysmk_token")}`,
};
const axiosClient = axios.create({
  baseURL: "https://mysmk.herokuapp.com",
  timeout: 1000 * 60 * 3,
  paramsSerializer: function (params) {
    return qs.stringify(params, { encode: false, skipNulls: true });
  },
  headers,
});

export const syncToken = () => {
  axiosClient.defaults.headers["X-Authorization"] = `Bearer ${Cookies.get(
    "mysmk_token"
  )}`;
};
export default axiosClient;

// https://mysmk.herokuapp.com
