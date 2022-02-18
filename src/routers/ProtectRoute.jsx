import { Navigate } from "react-router-dom";
import Cookies from "js-cookie";
import { authme } from "../api/auth";
import { useQuery } from "react-query";
export default function PrivateRoute({ children }) {
  const auth = Cookies.get("mysmk_token");
  let { data, isFetching } = useQuery(
    //query key
    ["authme"],
    //axios function,triggered when page/pageSize change
    () => authme(),
    //configuration
    {
      staleTime: 60 * 1000 * 60 * 12, // 12 jam,
      select: (response) => {
        console.log("dda");
        const role = response?.data?.role
        if(role !== 'Guru'){
          Cookies.remove('mysmk_token')
        }
        console.log(response?.data?.role)
      },
    }
  );
if(isFetching){
  return <div>Loading</div>
}
  return auth !== undefined ? children : <Navigate to="/login" />;
}
//
