import clsx from "clsx";
import htmr from "htmr";
import { useEffect, useState } from "react";

export default function Pg({ soals, item, setPayload, payload }) {
  let [jawaban, setJawaban] = useState("");

  useEffect(() => {
    const detail = handleSoal(payload, item);
    setPayload((s) => {
      s.data[detail.index] = {
        ...detail.soal[0],
        
      };
      setJawaban(detail.soal[0].jawaban);
      return {
        ...s,
        data: s.data,
      };
    });
  }, []);

 
  return (
    <div className="space-y-5 text-xl">
      <div className="border p-2 rounded-md">{htmr(`<div>${soals.soal}</div>`)}</div>

      <div className="relative pl-12">
        <button
          onClick={() => {
            const detail = handleSoal(payload, item);
            setPayload((s) => {
              s.data[detail.index] = {
                ...detail.soal[0],
                jawaban: "A",
              };
              setJawaban("A");
              return {
                ...s,
                data: s.data,
              };
            });
          }}
          className={clsx(
            "absolute  left-0  px-2 py-1   border-2 rounded-full ",
            {
              "bg-green-500 text-white": jawaban === "A",
            }
          )}
        >
          A
        </button>
        <div>{htmr(`<div>${soals.a}</div>`)}</div>
      </div>

      <div className="relative pl-12">
        <button
          onClick={() => {
            const detail = handleSoal(payload, item);
            setPayload((s) => {
              s.data[detail.index] = {
                ...detail.soal[0],
                jawaban: "B",
              };
              setJawaban("B");
              return {
                ...s,
                data: s.data,
              };
            });
          }}
          className={clsx(
            "absolute  left-0  px-2 py-1   border-2 rounded-full ",
            {
              "bg-green-500 text-white": jawaban === "B",
            }
          )}
        >
          B
        </button>
        <div>{htmr(`<div>${soals.b}</div>`)}</div>
      </div>

      <div className="relative pl-12">
        <button
          onClick={() => {
            const detail = handleSoal(payload, item);
            setPayload((s) => {
              s.data[detail.index] = {
                ...detail.soal[0],
                jawaban: "C",
              };
              setJawaban("C");
              return {
                ...s,
                data: s.data,
              };
            });
          }}
          className={clsx(
            "absolute  left-0  px-2 py-1   border-2 rounded-full ",
            {
              "bg-green-500 text-white": jawaban === "C",
            }
          )}
        >
          C
        </button>
        <div>{htmr(`<div>${soals.c}</div>`)}</div>
      </div>

      <div className="relative pl-12">
        <button
          onClick={() => {
            const detail = handleSoal(payload, item);
            setPayload((s) => {
              s.data[detail.index] = {
                ...detail.soal[0],
                jawaban: "D",
              };
              setJawaban("D");
              return {
                ...s,
                data: s.data,
              };
            });
          }}
          className={clsx(
            "absolute  left-0  px-2 py-1   border-2 rounded-full ",
            {
              "bg-green-500 text-white": jawaban === "D",
            }
          )}
        >
          D
        </button>
        <div>{htmr(`<div>${soals.d}</div>`)}</div>
      </div>

      <div className="relative pl-12">
        <button
          onClick={() => {
            const detail = handleSoal(payload, item);
            setPayload((s) => {
              s.data[detail.index] = {
                ...detail.soal[0],
                jawaban: "E",
              };
              setJawaban("E");
              return {
                ...s,
                data: s.data,
              };
            });
          }}
          className={clsx(
            "absolute  left-0  px-2 py-1   border-2 rounded-full ",
            {
              "bg-green-500 text-white": jawaban === "E",
            }
          )}
        >
          E
        </button>
        <div>{htmr(`<div>${soals.e}</div>`)}</div>
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
