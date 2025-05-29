import React from "react";
import { useNavigate } from "react-router-dom";
import { MdClose } from "react-icons/md";
import dayjs from "dayjs";
import useNotif from "../hook/useNotif";
import { showFormattedDate } from "../utils/waktu";
import { motion, AnimatePresence } from "framer-motion";

export default function Notifikasi({ setNotif }) {
  const navigate = useNavigate();
  const { notifAbsensi, notifHalaqoh, notifPiket, jumlah, notifExam } = useNotif();

  const handleNotif = () => {
    setNotif(false);
  };

  // Animation variants
  const notificationVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.3 }
    }
  };

  const categoryColors = {
    exam: "bg-blue-100 text-blue-800",
    absensi: "bg-purple-100 text-purple-800",
    halaqoh: "bg-green-100 text-green-800",
    piket: "bg-orange-100 text-orange-800"
  };

  const getCategory = (type) => {
    if (type === notifExam) return "exam";
    if (type === notifAbsensi) return "absensi";
    if (type === notifHalaqoh) return "halaqoh";
    if (type === notifPiket) return "piket";
    return "";
  };

  return (
    <section className="h-full overflow-hidden bg-white p-4 shadow-sm xl:border-l-2">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-medium text-gray-700 xl:block">
            {showFormattedDate(new Date())}
          </h1>
          <h2 className="text-xl font-bold text-gray-800">Pemberitahuan</h2>
        </div>
        <button 
          onClick={handleNotif}
          className="rounded-full p-2 hover:bg-gray-100 xl:hidden"
        >
          <MdClose className="h-6 w-6 text-gray-500" />
        </button>
      </div>

      <div className="mt-4 h-[calc(100%-80px)] overflow-y-auto">
        {jumlah === 0 ? (
          <div className="flex h-full flex-col items-center justify-center">
            <div className="rounded-full bg-gray-100 p-6">
              <svg
                className="h-12 w-12 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                />
              </svg>
            </div>
            <p className="mt-4 text-gray-500">Tidak ada pemberitahuan</p>
          </div>
        ) : (
          <div className="space-y-3">
            <AnimatePresence>
              {notifExam?.data?.map((value, index) => (
                <motion.div
                  key={`exam-${index}`}
                  variants={notificationVariants}
                  initial="hidden"
                  animate="visible"
                  className="rounded-lg border border-gray-200 bg-white shadow-xs hover:shadow-sm"
                >
                  <button
                    onClick={() => {
                      setNotif(false);
                      navigate(
                        `/guru/exam/penilaian/${value?.ujian_id}/${value?.mapel?.nama_mapel}}`
                      );
                    }}
                    className="flex w-full items-start p-4 text-left"
                  >
                    <div className={`mr-3 rounded-full px-2 py-1 text-xs font-medium ${categoryColors[getCategory(notifExam)]}`}>
                      Ujian
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-800">
                        Belum melakukan penilaian {value.jenis_ujian}
                      </p>
                      <p className="text-xs text-gray-500">
                        {value?.mapel?.nama_mapel} - Kelas {value?.kelas?.nama_kelas}
                      </p>
                    </div>
                  </button>
                </motion.div>
              ))}

              {notifAbsensi?.data?.map((value, index) => (
                <motion.div
                  key={`absensi-${index}`}
                  variants={notificationVariants}
                  initial="hidden"
                  animate="visible"
                  className="rounded-lg border border-gray-200 bg-white shadow-xs hover:shadow-sm"
                >
                  <button
                    onClick={() => {
                      setNotif(false);
                      navigate(
                        `/guru/absensi/${value?.kelas?.id}/${
                          value?.mapel?.id
                        }/${dayjs(value?.tanggal).format("YYYY-MM-DD")}`
                      );
                    }}
                    className="flex w-full items-start p-4 text-left"
                  >
                    <div className={`mr-3 rounded-full px-2 py-1 text-xs font-medium ${categoryColors[getCategory(notifAbsensi)]}`}>
                      Absensi
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-800">
                        Belum melakukan absensi
                      </p>
                      <p className="text-xs text-gray-500">
                        {value?.mapel?.nama_mapel} - {dayjs(value?.tanggal).format("DD/MM/YYYY")}
                      </p>
                    </div>
                  </button>
                </motion.div>
              ))}

              {notifHalaqoh?.data?.map((value, index) => (
                <motion.div
                  key={`halaqoh-${index}`}
                  variants={notificationVariants}
                  initial="hidden"
                  animate="visible"
                  className="rounded-lg border border-gray-200 bg-white shadow-xs hover:shadow-sm"
                >
                  <button
                    onClick={() => {
                      setNotif(false);
                      navigate(
                        `/guru/halaqoh/absensi/${dayjs(value?.tanggal).format(
                          "YYYY-MM-DD"
                        )}?halaqoh=${value.waktu}`
                      );
                    }}
                    className="flex w-full items-start p-4 text-left"
                  >
                    <div className={`mr-3 rounded-full px-2 py-1 text-xs font-medium ${categoryColors[getCategory(notifHalaqoh)]}`}>
                      Halaqoh
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-800">
                        Belum melakukan absensi Halaqoh {value?.waktu}
                      </p>
                      <p className="text-xs text-gray-500">
                        {dayjs(value?.tanggal).format("DD/MM/YYYY")}
                      </p>
                    </div>
                  </button>
                </motion.div>
              ))}

              {notifPiket?.data?.map((value, index) => (
                <motion.div
                  key={`piket-${index}`}
                  variants={notificationVariants}
                  initial="hidden"
                  animate="visible"
                  className="rounded-lg border border-gray-200 bg-white shadow-xs hover:shadow-sm"
                >
                  <button
                    onClick={() => {
                      setNotif(false);
                      navigate(
                        `/guru/laporan-guru-piket/buat-laporan/${
                          value?.id
                        }/${dayjs(value?.tanggal).format("YYYY-MM-DD")}`
                      );
                    }}
                    className="flex w-full items-start p-4 text-left"
                  >
                    <div className={`mr-3 rounded-full px-2 py-1 text-xs font-medium ${categoryColors[getCategory(notifPiket)]}`}>
                      Piket
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-800">
                        Belum membuat laporan guru piket
                      </p>
                      <p className="text-xs text-gray-500">
                        {dayjs(value?.tanggal).format("DD/MM/YYYY")}
                      </p>
                    </div>
                  </button>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    </section>
  );
}