import React from "react";
import { Navigate } from "react-router-dom";
import Cookies from "js-cookie";
import { authme } from "../api/auth";
import { useQuery } from "react-query";
import { LoadingPage } from "../components";
export default function ProtectRoute({ children, userRole }) {
  const auth = Cookies.get("mysmk_token");
  let [loading, setLoading] = React.useState(true);
  let { isLoading } = useQuery(
    //query key
    ["authme", auth],
    //axios function,triggered when page/pageSize change
    () => authme(),
    //configuration
    {
      staleTime: 60 * 1000 * 60 * 12, // 12 jam,
      select: (response) => {
        const role = response?.data?.role;

        console.log('role', role)
      
      
        if (!userRole.includes(role)) {
          Cookies.remove("mysmk_token");
          return <Navigate to="/login" />;
        }
      },
      onSuccess: () => {
        setLoading(false);
      },
    }
  );
  if (isLoading) {
    return <LoadingPage></LoadingPage>;
  }
  return auth !== undefined ? children : <Navigate to="/login" />;
}
//
