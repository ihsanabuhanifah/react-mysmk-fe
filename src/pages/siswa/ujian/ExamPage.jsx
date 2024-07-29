import React, { useEffect, useState } from "react";
import { useTakeExam } from "../../../api/siswa/exam";
import htmr from "htmr";
import Pg from "./Pg";

export default function ExamPage({ examActive, setExamActive }) {
  let [soal, setSoal] = useState([]);
  let [activeSoal, setActiveSoal] = useState(0);
  let [payload, setPayload] = useState({
    id: examActive,
  });
  const { data, isFetching, params, setParams } = useTakeExam(examActive);

  console.log("data", data);

  useEffect(() => {
    if (!!data === true) {
      let res = JSON.parse(data.soal);
      setSoal(res);

      let dataSoal = res.map((item) => ({
        id: item.id,
        tipe: item.tipe,
        jawaban: "",
      }));

      setPayload((state) => {
        return {
          ...state,
          data: dataSoal,
        };
      });
    }
  }, [data, isFetching]);

  console.log("soal", soal);

  return (
    <div
      onMouseLeave={() => {
        // window.location.reload()
      }}
      className="fixed top-0 left-0 right-0 bottom-0 border bg-white z-50"
    >
      <div className="grid grid-cols-8 h-screen w-screen gap-5 p-5 ">
        <div
          id="scrollbar"
          className="col-span-6 h-screnn w-full overflow-auto px-10 pt-5 pb-32 border shadow-lg rounded-md"
        >
          <p className="text-red-500 italic font-bold mb-10">
            Jangan mengeluarkan area mouse dari layar{" "}
          </p>

          {JSON.stringify(payload)}

          {soal?.map((item, index) => {
            let soals = JSON.parse(item.soal);
            console.log("sss", soals);
            return (
              <React.Fragment key={index}>
                {index === activeSoal && item.tipe === "PG" && (
                  <>
                    <Pg item={item} soals={soals} payload={payload} setPayload={setPayload} />
                  </>
                )}
              </React.Fragment>
            );
          })}
        </div>
        <div className="col-span-2 h-screen w-full shadow-lg rounded-md ">
          <div className="border border-b-2 py-5 flex items-center justify-center">
            <h5>Nomor Soal</h5>
          </div>
          <div className="  p-5 border shadow-lg h-full">
            {" "}
            {soal.map((item, index) => (
              <button
                onClick={() => {
                  setActiveSoal(index);
                }}
                key={index}
                className="border m-2 hover:bg-blue-200 h-12 w-12 "
              >
                {index + 1}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
