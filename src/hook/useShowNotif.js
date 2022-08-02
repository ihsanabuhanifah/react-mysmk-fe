import React from "react";
export default function useShowNotif() {
  let [notif, setNotif] = React.useState(false);
  return [notif, setNotif];
}
