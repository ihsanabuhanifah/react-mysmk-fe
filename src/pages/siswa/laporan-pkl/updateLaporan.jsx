import React from "react";
import { useParams } from "react-router-dom";

const UpdateLaporan = () => {
  const { id } = useParams();
  return <div>id : {id}</div>;
};

export default UpdateLaporan;
