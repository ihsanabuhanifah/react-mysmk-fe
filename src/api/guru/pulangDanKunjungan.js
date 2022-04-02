import axios from "../axiosClient";
import { syncToken } from "../axiosClient";

export function listPulang(params) {
  return axios.get("/guru/pulang/list", { params });
}

export function updatePulang(values) {
  console.log("haha");

 
  const payload = values.filter((data) => {
    return (data.updated === true);
  });
  
  console.log(payload)
  return axios.put(`guru/pulang/response`, {
    payload,
  });
}
