import React, { useContext, useEffect, useState } from "react";
import {
  useProgressExam,
  useSubmitExam,
  useTakeExam,
} from "../../../api/siswa/exam";

import Pg from "./Pg";
import TF from "./TF";
import ES from "./ES";
import clsx from "clsx";
import { Button, Icon, Dimmer, Loader, Modal } from "semantic-ui-react";
import ModalKonfirmasi from "../../../components/ModalKonfrimasi";
import LV from "./LV";
import Timer from "./Timer";
import { SocketContext } from "../../../SocketProvider";
import useList from "../../../hook/useList";
import { formatWaktu } from "../../../utils/waktu";
import { usePreventCheating } from "../../../hook/usePreventCheating";
import { useExamProtection } from "../../../hook/useExamProtection";
const roomId = "SMKMQ-ROOM";
export default function ExamPage({ examActive, setExamActive }) {
  const { socket } = useContext(SocketContext);
  const { enterFullscreen } = useExamProtection(); // Gunakan hook protection
  const { identitas, dataMapel } = useList();
  let [soal, setSoal] = useState([]);
  let [cutDown, setCutDown] = useState(3); // Set initial countdown to 10
  let [open, setOpen] = useState(false);
  let [mouse, setMouse] = useState(false);
  let [modalAutoSubmit, setModalAutoSubmit] = useState(false);
  const progess = useProgressExam();
  const submit = useSubmitExam();
  let [activeSoal, setActiveSoal] = useState(0);
  let [payload, setPayload] = useState({
    id: examActive,
  });

  let { data, mutate, isLoading: isFetching } = useTakeExam();

  useEffect(() => {
    enterFullscreen();
    mutate(examActive, {
      onError: () => {
        setExamActive(null);
      },
    });
  }, [examActive, mutate, setExamActive]);

  // Countdown effect
  useEffect(() => {
    let interval;
    if (mouse && cutDown > 0) {
      interval = setInterval(() => {
        setCutDown((c) => {
          socket.emit("catatan", {
            message: `${identitas.name} (${localStorage.getItem("mapel")}) batas toleransi ${cutDown} detik ${formatWaktu(new Date().toISOString())}`,
            roomId: roomId,
            id: data?.data?.id,
            userId: identitas?.id,
          });

          return c - 1;
        });
      }, 1000);
    } else if (cutDown === 0 && data?.data?.tipe_ujian === "closed") {
      socket.emit("catatan", {
        message: `${identitas.name} (${localStorage.getItem("mapel")}) dikeluarkan dan menyimpan progress dari ujian pada ${formatWaktu(new Date().toISOString())}`,

        roomId: roomId,
        id: data?.data?.id,
        userId: identitas?.id,
      });

      progess.mutate(payload);
      window.location.reload(); // Reload page when countdown reaches 0
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [mouse, cutDown, data]);

  // submit otomatis

  useEffect(() => {
    if (!!data?.data?.soal === true) {
      let res = JSON.parse(data.data.soal);
      setSoal(res);

      socket.emit("catatan", {
        message: `${identitas.name} (${localStorage.getItem("mapel")}) mulai ujian ${formatWaktu(new Date().toISOString())}`,

        roomId: roomId,
        id: data?.data?.id,
        userId: identitas?.id,
      });

      let dataSoal;
      if (JSON.parse(data.data.jawaban).length === 0) {
        dataSoal = res.map((item) => ({
          id: item.id,
          tipe: item.tipe,
          jawaban: "",
          file: "",
        }));
      } else {
        dataSoal = JSON.parse(data.data.jawaban).map((item) => ({
          id: item.id,
          tipe: item.tipe,
          jawaban: item.jawaban,
          file: item.file,
        }));
      }

      setPayload((state) => {
        return { ...state, data: dataSoal };
      });
    }
  }, [data, isFetching]);
  const handleViolation = (type) => {
    alert(`Pelanggaran terdeteksi: ${type}`);
    // Kirim log ke server jika diperlukan
  };

  usePreventCheating(handleViolation);

  if (isFetching || data?.data?.soal === undefined) {
    return (
      <div className="pb-30 fixed bottom-0 left-0 right-0 top-0 z-50 overflow-hidden border bg-white">
        <Dimmer active inverted>
          <Loader size="large">Mengambil Data Soal</Loader>
        </Dimmer>
      </div>
    );
  }

  return (
    <div
      onMouseLeave={() => {
        if (data?.data?.tipe_ujian === "closed") {
          setMouse(true); // Start countdown on mouse leave
        }
      }}
      onMouseEnter={() => {
        if (data?.data?.tipe_ujian === "closed") {
        }
        setMouse(false); // Start countdown on mouse leave
      }}
      className="pb-30 fixed bottom-0 left-0 right-0 top-0 z-[999] overflow-hidden border bg-white"
    >
      <ModalKonfirmasi
        open={open}
        setOpen={setOpen}
        loading={submit.isLoading}
        onConfirm={() => {
          submit.mutate(payload, {
            onSuccess: () => {
              socket.emit("catatan", {
                message: `${identitas.name} (${localStorage.getItem("mapel")}) Menyelesaikan Ujian pada ${formatWaktu(new Date().toISOString())}`,

                roomId: roomId,
                id: data?.data?.id,
                userId: identitas?.id,
              });
              window.location.reload();
            },
          });
        }}
        title={"Apakah yakin akan mengakhiri ujian ?"}
      />

      {mouse && cutDown > 0 && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="text-4xl font-bold text-white">
            Keluar dalam {cutDown} detik
          </div>
        </div>
      )}

      {modalAutoSubmit && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="text-4xl font-bold text-white">
            Waktu sudah habis. Anda akan keluar dalam beberapa saat lagi...
          </div>
        </div>
      )}

      <div className="grid h-screen w-screen grid-cols-12 gap-5 p-5">
        <div
          id="scrollbar"
          className="h-screnn col-span-10 w-full overflow-auto rounded-md border px-10 pb-32 pt-5 shadow-lg"
        >
          <div className="flex items-center justify-between">
            {data?.data?.tipe_ujian === "closed" && (
              <p className="font-bold text-red-500">
                Jangan mengeluarkan mouse dari area ujian
              </p>
            )}
            <Timer
              data={data}
              payload={payload}
              submit={submit}
              setModalAutoSubmit={setModalAutoSubmit}
            />
          </div>

          {soal?.map((item, index) => {
            let soals = JSON.parse(item.soal);

            return (
              <React.Fragment key={index}>
                <div className="mt-2 text-2xl">
                  {index === activeSoal && item.tipe === "PG" ? (
                    <>
                      <Pg
                        item={item}
                        soals={soals}
                        payload={payload}
                        setPayload={setPayload}
                      />
                    </>
                  ) : (
                    <></>
                  )}

                  {index === activeSoal && item.tipe === "TF" ? (
                    <>
                      <TF
                        item={item}
                        soals={soals}
                        payload={payload}
                        setPayload={setPayload}
                      />
                    </>
                  ) : (
                    <></>
                  )}
                  {index === activeSoal && item.tipe === "ES" ? (
                    <>
                      <ES
                        tipe={data?.data?.tipe_ujian}
                        item={item}
                        soals={soals}
                        payload={payload}
                        setPayload={setPayload}
                      />
                    </>
                  ) : (
                    <></>
                  )}
                  {index === activeSoal && item.tipe === "LV" ? (
                    <>
                      <LV
                        tipe={data?.data?.tipe_ujian}
                        item={item}
                        soals={soals}
                        payload={payload}
                        setPayload={setPayload}
                      />
                    </>
                  ) : (
                    <></>
                  )}
                </div>
              </React.Fragment>
            );
          })}
        </div>

        <div className="relative col-span-2 h-screen w-full rounded-md border shadow-lg">
          <div className="flex items-center justify-center py-5">
            <h5>Nomor Soal</h5>
          </div>
          <div className="h-full px-5 shadow-lg">
            {soal.map((item, index) => (
              <button
                onClick={() => {
                  setActiveSoal(index);
                }}
                key={index}
                className={clsx(
                  `m-2 h-12 w-12 rounded-md border font-bold hover:bg-blue-200`,
                  {
                    "bg-green-400 text-white":
                      !!payload?.data?.[index]?.jawaban === true,
                  },
                )}
              >
                {index + 1}
              </button>
            ))}
            <div className="absolute bottom-2 left-0 right-0 space-y-2 px-5 pb-10">
              <Button
                content={"Simpan Progress"}
                type="submit"
                fluid
                loading={progess.isLoading}
                disabled={progess.isLoading}
                onClick={() => {
                  socket.emit("catatan", {
                    message: `${identitas.name} (${localStorage.getItem("mapel")}) menyimpan progress Ujian pada ${formatWaktu(new Date().toISOString())}`,

                    roomId: roomId,
                    id: data?.data?.id,
                    userId: identitas?.id,
                  });
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
