import { useState } from "react";

const useCheckbox = () => {
  const [payload, setPayload] = useState([]);

  const handleCheck = (e, id) => {
    if (e.target.checked) {
      setPayload((state) => {
        return [...state, id];
      });
    } else {
      console.log("masuk sini");
      let filter = payload.filter((item) => item !== id);
      setPayload(filter);
    }
  };

 const isChecked = (id) => {
    return payload.includes(id)
 }
  return {
    handleCheck,
    isChecked,
    payload
    
  };
};

export default useCheckbox;
