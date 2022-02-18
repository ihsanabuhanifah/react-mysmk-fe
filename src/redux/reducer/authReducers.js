const initialState = {
 nama : "",
 email : "",
 token : "",
 isAuth : false,
 isLoading : false
};

export function authProcess(state = initialState, action) {
  if (action.type === "Login") {
    return {
      ...state,
      nama: action.nama,
      email: action.email,
      token : action.token,
      isAuth: true,
    };
  }
  if (action.type === "Logout") {
    return {
      ...state,
      nama: "",
      email: "",
      token : "",
      isAuth: false
    };
  }
  if (action.type === "loadingStart") {
    return {
      ...state,
      isLoading : true
    };
  }
  if (action.type === "loadingEnd") {
    return {
      ...state,
      isLoading : false
    };
  }
  

  return state;
}
