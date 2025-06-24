export const setProfile = (data) => {
  console.log(data)

  return {
    type: "SET_PROFILE",
    payload: data
  }
}