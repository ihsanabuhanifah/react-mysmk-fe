import axios from "axios";

const headers = {
  Accept: "application/json",
};
const axiosClient = axios.create({
  baseURL: "https://ihsan-app.herokuapp.com/",
  headers,
});

export const syncToken = () => {
  axiosClient.defaults.headers[
    "X-Authorization"
  ] = `Bearer ${localStorage.getItem("token")}`;
};
export default axiosClient;
