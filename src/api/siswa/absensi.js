import { useQuery } from "react-query";
import axios, { syncToken } from "../axiosClient";
import { useState } from "react";

export function useTidakHadir() {
  syncToken();

  const [params, setParams] = useState({
    s: 3,
  });

  let { data, isFetched, isFetching } = useQuery(
    ["/tidakhadir"],
    () =>
      axios.get("/santri/tidakhadir", { params }).then((res) => {
        console.log("res", res);
        return res.data;
      }),
    {
      select: (response) => response,
      staleTime: 60 * 1000 * 60 * 24,
    },
  );

  return { data, isFetched, isFetching, setParams };
}
