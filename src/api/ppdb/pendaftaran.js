import { useToast } from "react-toastify";
import axios from "../axiosClient";
import { syncToken } from "../axiosClient";
import { useMutation, useQueryClient } from "react-query";
import { useNavigate } from "react-router-dom";

export function CreateDataCalonSantri(values) {
  syncToken();
  return axios.post('/ppdb/create', values);
}
