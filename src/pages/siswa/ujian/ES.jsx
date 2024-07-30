import clsx from "clsx";
import htmr from "htmr";
import { useEffect, useState } from "react";
import Editor from "../../../components/Editor";

export default function ES({ soals, item, setPayload, payload }) {
  let [jawaban, setJawaban] = useState("");
  useEffect(() => {
    const detail = handleSoal(payload, item);
    setPayload((s) => {
      s.data[detail.index] = {
        ...detail.soal[0],
        
      };

      
      setJawaban( detail.soal[0].jawaban);
      return {
        ...s,
        data: s.data,
      };
    });
  }, []);
  return (
    <div className="space-y-5">
      <div className="border-b-2 pb-2">{htmr(`<div>${soals.soal}</div>`)}</div>

      <div className="relative">
        <h5>Jawaban :</h5>
        <Editor
          
          value={jawaban}
          handleChange={(content) => {
            
            const detail = handleSoal(payload, item);
            setPayload((s) => {
              s.data[detail.index] = {
                ...detail.soal[0],
                jawaban: content,
              };
              setJawaban(content)
              return {
                ...s,
                data: s.data,
              };
            });
          }}
        />
      </div>
    </div>
  );
}

const handleSoal = (payload, item) => {
  const soal = payload.data.filter((x) => x.id === item.id);
  const index = payload.data.findIndex((x) => x.id === item.id);

  return {
    soal,
    index,
  };
};
