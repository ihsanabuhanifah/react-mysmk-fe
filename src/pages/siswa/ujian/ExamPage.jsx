import React, { useEffect, useState } from "react";
import { useProgressExam, useSubmitExam, useTakeExam } from "../../../api/siswa/exam";

import Pg from "./Pg";
import TF from "./TF";
import ES from "./ES";
import clsx from "clsx";
import { Button, Icon, Dimmer, Loader } from "semantic-ui-react";

export default function ExamPage({ examActive, setExamActive }) {
  let [soal, setSoal] = useState([]);
  let [activeSoal, setActiveSoal] = useState(0);
  let [payload, setPayload] = useState({
    id: examActive,
  });

  let { data, mutate, isLoading: isFetching } = useTakeExam();

  let [waktu, setWaktu] = useState(data?.data?.waktu_tersisa * 60)

  useEffect(() => {
    mutate(examActive, {
      onError: () => {
        setExamActive(null);
      },
    });
  }, []);


  useEffect(()=> {
   const interval = setInterval(() => {

     setWaktu(()=> {
      return (waktu - 1)
     })
      
    }, 1000);

    return () => {
      return clearInterval(interval)
    }
   
  },[])

  const progess = useProgressExam();
  const submit = useSubmitExam();

 
  useEffect(() => {
    if (!!data?.data === true) {
      let res = JSON.parse(data.data.soal);
      setSoal(res);
  
      let dataSoal;
      if (JSON.parse(data.data.jawaban).length === 0) {
        dataSoal = res.map((item) => ({
          id: item.id,
          tipe: item.tipe,
          jawaban: "",
        }));
      } else {
        dataSoal = JSON.parse(data.data.jawaban).map((item) => ({
          id: item.id,
          tipe: item.tipe,
          jawaban: item.jawaban,
        }));
      }

      console.log("data", dataSoal);

      setPayload((state) => {
        return {
          ...state,
          data: dataSoal,
        };
      });
    }
  }, [data, isFetching]);

  console.log("soal", soal);

  if (isFetching) {
    return (
      <div
        onMouseLeave={() => {
          // window.location.reload()
        }}
        className="fixed top-0 left-0 right-0 bottom-0 border pb-30 bg-white z-50 overflow-hidden"
      >
        <Dimmer active inverted>
          <Loader size="large">Mengambil Data Soal</Loader>
        </Dimmer>
      </div>
    );
  }

  return (
    <div
      onMouseLeave={() => {
        // window.location.reload()
      }}
      className="fixed top-0 left-0 right-0 bottom-0 border pb-30 bg-white z-50 overflow-hidden"
    >


      <div className="grid grid-cols-8 h-screen w-screen gap-5 p-5 ">
        <div
          id="scrollbar"
          className="col-span-6 h-screnn w-full overflow-auto px-10 pt-5 pb-32 border shadow-lg rounded-md"
        >
          <p className="text-red-500 italic font-bold mb-10">
            Jangan mengeluarkan area mouse dari layar{" "}
          </p>
          <div>{waktu}</div>

          {soal?.map((item, index) => {
            let soals = JSON.parse(item.soal);

            return (
              <React.Fragment key={index}>
                {index === activeSoal && item.tipe === "PG" && (
                  <>
                    <Pg
                      item={item}
                      soals={soals}
                      payload={payload}
                      setPayload={setPayload}
                    />
                  </>
                )}

                {index === activeSoal && item.tipe === "TF" && (
                  <>
                    <TF
                      item={item}
                      soals={soals}
                      payload={payload}
                      setPayload={setPayload}
                    />
                  </>
                )}
                {index === activeSoal && item.tipe === "ES" && (
                  <>
                    <ES
                      item={item}
                      soals={soals}
                      payload={payload}
                      setPayload={setPayload}
                    />
                  </>
                )}
              </React.Fragment>
            );
          })}
        </div>

        <div className="col-span-2 h-screen w-full shadow-lg rounded-md relative   ">
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
                className={clsx(
                  `border m-2 hover:bg-blue-200 h-12 w-12 font-bold rounded-md `,
                  {
                    "bg-green-400 text-white":
                      !!payload?.data?.[index]?.jawaban === true,
                  }
                )}
              >
                {index + 1}
              </button>
            ))}
            <div className="space-y-2 absolute bottom-2 pb-10 right-0 left-0 px-5">
              <Button
                content={"Simpan Progress"}
                type="submit"
                fluid
                loading={progess.isLoading}
                disabled={progess.isLoading}
                onClick={() => {
                  progess.mutate(payload);
                }}
                icon={() => <Icon name="save" />}
                size="medium"
                color="teal"
              />
              <Button
                content={"Submit Exam"}
                type="submit"
                fluid
                loading={submit.isLoading}
                disabled={submit.isLoading}
                onClick={() => {
                  submit.mutate(payload, {
                    onSuccess: () => {
                      window.location.reload();
                    },
                  });
                }}
                icon={() => <Icon name="save" />}
                size="medium"
                color="blue"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}



// function updateTimer(totalDetik) {
//   // Konversi detik ke hari, jam, menit, dan detik
//   let hari = Math.floor(totalDetik / (24 * 3600));
//   let sisaDetik = totalDetik % (24 * 3600);
//   let jam = Math.floor(sisaDetik / 3600);
//   sisaDetik %= 3600;
//   let menit = Math.floor(sisaDetik / 60);
//   let detik = sisaDetik % 60;

//   // Update tampilan
//   document.getElementById("timer").textContent = `${hari} hari, ${jam} jam, ${menit} menit, dan ${detik} detik`;

//   // Kurangi detik
//   return {
//     hari : hari,
//     jam : jam,
//     menit : menit ,
//     detik : detik
//   }
// }