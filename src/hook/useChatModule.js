import { useQuery } from "react-query";
import { syncToken } from "../api/axiosClient";
import axios from "../api/axiosClient";

function getListChat(params) {
  syncToken();
  return axios.get("/chat/list", { params });
}

const useChatModule = (teacher_id, student_id) => {
  const { data, isLoading } = useQuery(
    ["/chatlist", [teacher_id, student_id]],
    () => getListChat({ student_id, teacher_id }),
    {
      select: (res) => res.data,
      enabled: teacher_id != null && student_id != null, // Only enable if both are non-null
    },
  );

  return { data, isLoading };
};

export default useChatModule;
