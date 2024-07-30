import clsx from "clsx";
import htmr from "htmr";
import { useEffect, useState } from "react";

export default function TF({ soals, item, setPayload, payload }) {
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

      {jawaban}

      <div className="relative pl-12">
        <button
          onClick={() => {
            const detail = handleSoal(payload, item);
            setPayload((s) => {
              s.data[detail.index] = {
                ...detail.soal[0],
                jawaban: "true",
              };
              setJawaban("true");
              return {
                ...s,
                data: s.data,
              };
            });
          }}
          className={clsx(
            "absolute  left-0  px-1 py-0    border-2 rounded-full text-gray-400",
            {
              "bg-blue-200": jawaban === "true",
            }
          )}
        >
          B
        </button>
        <div>Benar</div>
      </div>

      <div className="relative pl-12">
        <button
          onClick={() => {
            const detail = handleSoal(payload, item);
            setPayload((s) => {
              s.data[detail.index] = {
                ...detail.soal[0],
                jawaban: "false",
              };
              setJawaban("false");
              return {
                ...s,
                data: s.data,
              };
            });
          }}
          className={clsx(
            "absolute  left-0  px-1 py-0    border-2 rounded-full text-gray-400",
            {
              "bg-blue-200": jawaban === "false",
            }
          )}
        >
          S
        </button>
        <div>Salah</div>
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
