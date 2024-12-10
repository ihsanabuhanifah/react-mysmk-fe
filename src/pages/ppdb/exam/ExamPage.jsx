import React, { useEffect, useState } from "react";
import { Button, Icon, Dimmer, Loader } from "semantic-ui-react";
import clsx from "clsx";
import ModalKonfirmasi from "../../../components/ModalKonfrimasi";
import Pg from "./Pg";
import TF from "./TF";
import ES from "./ES";
import {
  useProgressExamCalonSantri,
  useSubmitExamCalonSantri,
  useTakeExamCalonSantri,
} from "../../../api/ppdb/examCalonSantri";

export default function ExamPagePpdb({ examActive, setExamActive }) {
  const [soal, setSoal] = useState([]);
  const [cutDown, setCutDown] = useState(10);
  const [open, setOpen] = useState(false);
  const [mouse, setMouse] = useState(false);
  const [activeSoal, setActiveSoal] = useState(0);
  const [payload, setPayload] = useState({ id: examActive });
  const [waktu, setWaktu] = useState(0);
  let [modalAutoSubmit, setModalAutoSubmit] = useState(false);
  const progess = useProgressExamCalonSantri();
  const submit = useSubmitExamCalonSantri();
  const { data, mutate, isLoading: isFetching } = useTakeExamCalonSantri();

  useEffect(() => {
    mutate(examActive, {
      onError: () => {
        setExamActive(null);
      },
    });
    console.log(data?.data.soal);
  }, [examActive, mutate, setExamActive]);

  // Countdown effect
  useEffect(() => {
    let interval;
    if (mouse && cutDown > 0) {
      interval = setInterval(() => {
        setCutDown((c) => c - 1);
      }, 1000);
    } else if (cutDown === 0) {
      window.location.reload(); // Reload page when countdown reaches 0
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [mouse, cutDown]);

  //  // submit otomatis
  // useEffect(() => {
  //   const interval = setInterval(() => {
  //     setWaktu((w) => {
  //       if (!!data?.data?.waktu_tersisa === true) {
  //         if (w <= 0) {
  //           setModalAutoSubmit(true); // Tampilkan modal auto submit
  //           clearInterval(interval); // Hentikan interval untuk mencegah pengurangan waktu lebih lanjut
  //           setTimeout(() => {
  //             submit.mutate(payload, {
  //               onSuccess: () => {
  //                 window.location.reload();
  //               },
  //             });
  //           }, 3000); // Submit otomatis setelah 5 detik
  //           return 0;
  //         }
  //         return w - 1;
  //       }
  //     });
  //   }, 1000);

  //   return () => {
  //     return clearInterval(interval);
  //   };
  // }, [data?.data?.waktu_tersisa, payload, submit]);

  useEffect(() => {
    if (!!data?.data.waktu_tersisa) {
      setWaktu(data?.data.waktu_tersisa);
    }
    if (!!data?.data.soal) {
      const parsedSoal = JSON.parse(data.data.soal).map((item) => {
        const soalData = JSON.parse(item.soal);
        return {
          id: item.id, // Pastikan ID soal disimpan
          ...soalData,
        };
      });
      setSoal(parsedSoal);

      setPayload((state) => ({
        ...state,
        id: examActive,
        data: parsedSoal.map((item) => ({
          id: item.id, // Tambahkan ID soal ke payload
          tipe: item.tipe,
          jawaban: "",
          file: "",
        })),
      }));
    }
  }, [data]);

  // useEffect(() => {
  //   if (!!data?.data.waktu_tersisa) {
  //     setWaktu(data?.data.waktu_tersisa);
  //   }
  //   if (!!data?.data.soal) {
  //     const parsedSoal = JSON.parse(data.data.soal).map((item) =>
  //       JSON.parse(item.soal)
  //     );
  //     setSoal(parsedSoal);

  //     console.log("Parsed Soal:", parsedSoal); // Periksa struktur parsedSoal
  //     setPayload((state) => ({
  //       ...state,
  //       id: examActive,
  //       data: parsedSoal.map((item) => ({
  //         id: item.id,
  //         tipe: item.tipe,
  //         jawaban: "",
  //         file: "",
  //       })),
  //     }));
  //   }
  // }, [data]);

  const handleJawabanChange = (id, jawaban) => {
    setPayload((prev) => ({
      ...prev,
      data: prev.data.map((item) =>
        item.id === id ? { ...item, jawaban } : item
      ),
    }));
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setWaktu((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => clearInterval(interval);
  }, [waktu]);

  if (isFetching || data?.data?.soal === undefined) {
    return (
      <div className="fixed top-0 left-0 right-0 bottom-0 border pb-30 bg-white z-50 overflow-hidden">
        <Dimmer active inverted>
          <Loader size="large">Mengambil Data Soal</Loader>
        </Dimmer>
      </div>
    );
  }

  console.log("Data soal mentah:", data?.data.waktu_tersisa);

  return (
    <div
      onMouseLeave={() => {
        if (data?.data?.tipe_ujian === "closed") {
          setMouse(true); // Start countdown on mouse leave
        }
      }}
      onMouseEnter={() => {
        if (data?.data?.tipe_ujian === "closed") {
          setMouse(false); // Stop countdown on mouse enter, but don't reset it
        }
      }}
      className="fixed top-0 left-0 right-0 bottom-0 bg-white z-50 overflow-hidden"
    >
      <ModalKonfirmasi
        open={open}
        setOpen={setOpen}
        loading={submit.isLoading}
        onConfirm={() => {
          // Log untuk memeriksa payload.data
          console.log("Payload data:", payload.data);
          const finalPayload = {
            id: payload.id,
            data: payload.data.map((item) => {
              console.log("Item:", item); // Log untuk memeriksa item.id
              return {
                id: item.id || 18, // Sertakan ID soal
                jawaban: item.jawaban, // Kirim jawaban
              };
            }),
          };
          // const finalPayload = {
          //   id:payload.id,
          //   data: payload.data.map((item) => ({

          //     id: item.id,
          //     jawaban: item.jawaban, // Hanya kirim id dan jawaban
          //   })),
          // };
          submit.mutate(finalPayload, {
            onSuccess: () => {
              window.location.reload();
            },
          });
        }}
        title={"Apakah yakin akan mengakhiri ujian ?"}
      />
      <div className="grid grid-cols-8 h-screen w-screen gap-5 p-5">
        <div className="col-span-6 h-screen overflow-auto px-10 pt-5 pb-32 border shadow-lg rounded-md">
          <div className="flex justify-between">
            {/* <p className="text-red-500 font-bold">
              {waktu > 0 ? "Waktu Tersisa" : "Waktu Habis"}
            </p> */}
            {/* <span>{convertSeconds(waktu)}</span> */}
          </div>
          {soal.map((item, index) => (
            <div key={index}>
              {index === activeSoal && (
                <>
                  <h3>Soal No. {index + 1}</h3>
                  {item.tipe === "PG" && (
                    <Pg
                      item={item}
                      jawaban={
                        payload.data.find((i) => i.id === item.id)?.jawaban
                      }
                      onJawabanChange={(jawaban) =>
                        handleJawabanChange(item.id, jawaban)
                      }
                      payload={payload}
                      setPayload={setPayload}
                    />
                  )}
                  {item.tipe === "TF" && (
                    <TF item={item} payload={payload} setPayload={setPayload} />
                  )}
                  {item.tipe === "ES" && (
                    <ES item={item} payload={payload} setPayload={setPayload} />
                  )}
                </>
              )}
            </div>
          ))}
        </div>
        <div className="col-span-2 h-screen border shadow-lg rounded-md relative">
          <div className="py-5 flex justify-center">
            <h5>Nomor Soal</h5>
          </div>
          <div className="px-5 shadow-lg h-full">
            {soal.map((item, index) => (
              <button
                key={index}
                disabled={waktu <= 0}
                onClick={() => setActiveSoal(index)}
                className={clsx("border m-2 h-12 w-12 rounded-md", {
                  "bg-green-400 text-white": payload.data?.[index]?.jawaban,
                  "bg-gray-300": waktu <= 0,
                })}
              >
                {index + 1}
              </button>
            ))}
            <div className="space-y-2 absolute bottom-5 w-full px-5">
              <Button
                content={"Simpan Progress"}
                type="submit"
                fluid
                loading={progess.isLoading}
                disabled={progess.isLoading}
                onClick={() => {
                  const filteredPayload = {
                    id: payload.id,
                    data: payload.data.map((item) => ({
                      id: item.id,
                      jawaban: item.jawaban, // Hanya kirim id dan jawaban
                    })),
                  };
                  progess.mutate(filteredPayload);
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
                  setOpen(true);
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

function convertSeconds(seconds) {
  const days = Math.floor(seconds / (24 * 3600));
  seconds %= 24 * 3600;
  const hours = Math.floor(seconds / 3600);
  seconds %= 3600;
  const minutes = Math.floor(seconds / 60);
  seconds %= 60;

  if (days < 1) {
    if (hours < 1) {
      return ` ${minutes} menit, ${seconds} detik`;
    } else {
      return `${hours} jam, ${minutes} menit, ${seconds} detik`;
    }
  }

  return `${days} hari, ${hours} jam, ${minutes} menit, ${seconds} detik`;
}
