import { useToast } from "react-toastify";
import axios from "../axiosClient";
import { syncToken } from "../axiosClient";
import { useMutation, useQueryClient } from "react-query";
import { useNavigate } from "react-router-dom";

export function CreateDataCalonSantri(values) {
  syncToken();
  return axios.post('/ppdb/create', values);
}


export function createFileCalonSantri(payload) {
  syncToken();
  return axios.post("/ppdb/create", payload);
}

export const useCreateFileCalonSantri = () => {
  const { successToast, warningToast } = useToast();
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { mutate, isLoading } = useMutation(
    (payload) => createFileCalonSantri(payload),
    {
      onSuccess: (response) => {
        console.log(response);
        successToast(response);
        // queryClient.invalidateQueries("/");
        navigate("/ppdb/dashboard")
      },
      onError: (err) => {
        console.log(err, "err");
        console.log(err.Error.config.response, "err ddd");
        warningToast(err);
      },
    }
  );
  return { mutate, isLoading };
};