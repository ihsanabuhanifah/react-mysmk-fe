import { combineReducers } from "redux";
import { authProcess } from "./authReducers";

export const allReducers = combineReducers({
  auth: authProcess,

  // auth: namaReducer,
});
