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
import {
  Button,
  Icon,
  Dimmer,
  Loader,
  Modal,
  Progress,
} from "semantic-ui-react";
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
  const { enterFullscreen } = useExamProtection();
  const { identitas, dataMapel } = useList();
  const [soal, setSoal] = useState([]);
  const [cutDown, setCutDown] = useState(120);
  const [open, setOpen] = useState(false);
  const [mouse, setMouse] = useState(false);
  const [modalAutoSubmit, setModalAutoSubmit] = useState(false);
  const [activeSoal, setActiveSoal] = useState(0);
  const [payload, setPayload] = useState({ id: examActive });
  const [answeredCount, setAnsweredCount] = useState(0);

  const progess = useProgressExam();
  const submit = useSubmitExam();
  const { data, mutate, isLoading: isFetching } = useTakeExam();

  useEffect(() => {
    enterFullscreen();
    mutate(examActive, {
      onError: () => {
        setExamActive(null);
      },
    });
  }, [examActive, mutate, setExamActive]);

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
      window.location.reload();
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [mouse, cutDown, data]);

  useEffect(() => {
    if (!!data?.data?.soal) {
      const res = JSON.parse(data.data.soal);
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

      // Calculate answered questions
      const answered = dataSoal.filter((item) => item.jawaban !== "").length;
      setAnsweredCount(answered);

      setPayload((state) => {
        return { ...state, data: dataSoal };
      });
    }
  }, [data, isFetching]);

  const handleViolation = (type) => {
    alert(`Pelanggaran terdeteksi: ${type}`);
  };

  usePreventCheating(handleViolation);

  const updateAnswerCount = (newPayload) => {
    const answered = newPayload?.data?.filter(
      (item) => item.jawaban !== "",
    ).length;
    setAnsweredCount(answered);
  };

  useEffect(() => {
    updateAnswerCount(payload);
  }, [payload]);

  if (isFetching || data?.data?.soal === undefined) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-white">
        <Dimmer active inverted>
          <Loader size="massive">Memuat Soal Ujian</Loader>
        </Dimmer>
      </div>
    );
  }

  return (
    <div
      onMouseLeave={() => {
        if (data?.data?.tipe_ujian === "closed") {
          setMouse(true);
        }
      }}
      onMouseEnter={() => {
        if (data?.data?.tipe_ujian === "closed") {
          setMouse(false);
        }
      }}
      className="fixed inset-0 z-[999] flex h-screen w-screen flex-col bg-gray-50 font-sans"
    >
      {/* Countdown Overlay */}
      {mouse && cutDown > 0 && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-90">
          <div className="text-center">
            <div className="animate-pulse text-6xl font-bold text-red-500">
              {cutDown}
            </div>
            <div className="mt-4 text-2xl font-medium text-white">
              Jangan keluar dari halaman ujian!
            </div>
            <div className="mt-2 text-lg text-gray-300">
              Anda akan dikeluarkan secara otomatis
            </div>
          </div>
        </div>
      )}

      {modalAutoSubmit && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-90">
          <div className="text-center">
            <div className="text-4xl font-bold text-white">
              Waktu Ujian Telah Habis
            </div>
            <div className="mt-4 text-xl text-gray-300">
              Jawaban Anda akan disimpan secara otomatis...
            </div>
          </div>
        </div>
      )}

      {/* Header Section */}
      <div className="flex items-center justify-between bg-green-600 p-4 text-white shadow-md">
        <div className="flex items-center space-x-4">
          <div className="text-xl font-bold">
            {localStorage.getItem("mapel")}
          </div>
          {data?.data?.tipe_ujian === "closed" && (
            <div className="rounded bg-red-500 px-3 py-1 text-sm font-medium">
              Mode Pengawasan Ketat
            </div>
          )}
        </div>

        <div className="flex items-center space-x-6">
          <div className="text-right">
            <div className="text-sm font-medium">Sisa Waktu</div>
            <Timer
              data={data}
              payload={payload}
              submit={submit}
              setModalAutoSubmit={setModalAutoSubmit}
              className="text-2xl font-bold"
            />
          </div>
          <div className="h-10 w-px bg-white opacity-30"></div>
          <div className="text-right">
            <div className="text-sm font-medium">Soal Terjawab</div>
            <div className="text-2xl font-bold">
              {answeredCount}/{soal.length}
            </div>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="bg-green-500 px-4 py-1">
        <Progress
          value={answeredCount}
          total={soal.length}
          color="blue"
          size="tiny"
          className="m-0"
        />
      </div>

      {/* Main Content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Question Navigation */}
        <div className="w-64 border-r bg-white p-4 shadow-sm">
          <div className="mb-6">
            <h3 className="mb-3 text-lg font-semibold text-gray-800">
              Navigasi Soal
            </h3>
            <div className="grid grid-cols-5 gap-2">
              {soal.map((item, index) => (
                <button
                  key={index}
                  onClick={() => setActiveSoal(index)}
                  className={clsx(
                    "flex h-12 w-12 items-center justify-center rounded-lg border-2 text-lg font-medium transition-all",
                    {
                      "border-blue-500 bg-blue-100 text-blue-700":
                        index === activeSoal,
                      "border-green-500 bg-green-100 text-green-700":
                        !!payload?.data?.[index]?.jawaban,
                      "border-gray-300 hover:border-blue-300":
                        !payload?.data?.[index]?.jawaban &&
                        index !== activeSoal,
                    },
                  )}
                >
                  {index + 1}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-auto space-y-3 pt-4">
            <Button
              fluid
              color="teal"
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
              className="!flex items-center justify-center !py-3 !text-base"
            >
              <Icon name="save" className="!mr-2" />
              Simpan Sementara
            </Button>

            <Button
              fluid
              color="blue"
              loading={submit.isLoading}
              disabled={submit.isLoading}
              onClick={() => setOpen(true)}
              className="!flex items-center justify-center !py-3 !text-base"
            >
              <Icon name="send" className="!mr-2" />
              Selesai & Kirim
            </Button>
          </div>
        </div>

        {/* Question Content */}
        <div className="flex-1 overflow-auto p-6">
          <div className="mx-auto max-w-4xl rounded-lg bg-white p-8 shadow-sm">
            {soal.map((item, index) => {
              const soals = JSON.parse(item.soal);

              return (
                <div
                  key={index}
                  className={index === activeSoal ? "block" : "hidden"}
                >
                  <div className="mb-6 flex items-start">
                    <div className="mr-4 flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-100 text-lg font-bold text-blue-700">
                      {index + 1}
                    </div>
                    <div className="flex-1">
                      {index === activeSoal && item.tipe === "PG" && (
                        <Pg
                          item={item}
                          soals={soals}
                          payload={payload}
                          setPayload={(newPayload) => {
                            setPayload(newPayload);
                            updateAnswerCount(newPayload);
                          }}
                        />
                      )}

                      {index === activeSoal && item.tipe === "TF" && (
                        <TF
                          item={item}
                          soals={soals}
                          payload={payload}
                          setPayload={(newPayload) => {
                            setPayload(newPayload);
                            updateAnswerCount(newPayload);
                          }}
                        />
                      )}

                      {index === activeSoal && item.tipe === "ES" && (
                        <ES
                          tipe={data?.data?.tipe_ujian}
                          item={item}
                          soals={soals}
                          payload={payload}
                          setPayload={(newPayload) => {
                            setPayload(newPayload);
                            updateAnswerCount(newPayload);
                          }}
                        />
                      )}

                      {index === activeSoal && item.tipe === "LV" && (
                        <LV
                          tipe={data?.data?.tipe_ujian}
                          item={item}
                          soals={soals}
                          payload={payload}
                          setPayload={(newPayload) => {
                            setPayload(newPayload);
                            updateAnswerCount(newPayload);
                          }}
                        />
                      )}
                    </div>
                  </div>

                  <div className="mt-8 flex justify-between border-t pt-6">
                    <Button
                      disabled={activeSoal === 0}
                      onClick={() => setActiveSoal(activeSoal - 1)}
                      className="!px-6 !py-3 !text-base"
                    >
                      <Icon name="arrow left" /> Sebelumnya
                    </Button>

                    <Button
                      disabled={activeSoal === soal.length - 1}
                      onClick={() => setActiveSoal(activeSoal + 1)}
                      className="!px-6 !py-3 !text-base"
                      teal
                    >
                      Selanjutnya <Icon name="arrow right" />
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Confirmation Modal */}
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
        title={"Konfirmasi Pengumpulan Jawaban"}
        content={
          "Apakah Anda yakin ingin mengakhiri ujian dan mengumpulkan jawaban? Pastikan semua soal telah terjawab."
        }
      />
    </div>
  );
}
