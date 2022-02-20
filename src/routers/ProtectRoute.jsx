import React from "react";
import { Navigate } from "react-router-dom";
import Cookies from "js-cookie";
import { authme } from "../api/auth";
import { useQuery } from "react-query";
export default function ProtectRoute({ children, userRole }) {
  const auth = Cookies.get("mysmk_token");
  let [loading, setLoading] = React.useState(true);
  let { data, isFetching } = useQuery(
    //query key
    ["authme", auth],
    //axios function,triggered when page/pageSize change
    () => authme(),
    //configuration
    {
      staleTime: 60 * 1000 * 60 * 12, // 12 jam,
      select: (response) => {
        const role = response?.data?.role;
        if (role !== userRole) {
          Cookies.remove("mysmk_token");
          return <Navigate to="/logn" />;
        }
      },
      onSuccess: () => {
        setLoading(false);
      },
    }
  );
  if (isFetching) {
    return <div>Loading</div>;
  }
  return auth !== undefined ? children : <Navigate to="/login" />;
}
//
