

import { Navigate } from "react-router-dom";
import { useSelector , useDispatch } from "react-redux";
import { authMe } from "../redux/actions/authAction";
export default function PrivateRoute({ children }) {
  const auth = useSelector((state) => state.auth.isAuth);
  const dispatch = useDispatch()
  if(!auth){
    console.log("auth false")
  }
  console.log(auth);

  return auth ? children : <Navigate to="/login" />;
}
//
