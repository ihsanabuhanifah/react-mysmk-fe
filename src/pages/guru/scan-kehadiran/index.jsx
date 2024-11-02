import React, { useEffect, useState } from "react";
import LayoutPage from "../../../module/layoutPage";
import { Table } from "semantic-ui-react";
import { TableLoading } from "../../../components";
import { formatDate } from "../../../utils";
import { useQrScannerSiswa } from "../../../hook/useQrScannerSiswa";
import { cekWaktuSholat, useCreateWaktuSholat } from "../../../api/guru/kehadiransholat";
import toast, { Toaster } from 'react-hot-toast';
const notify = () => toast.success('Berhasil!');

const ScanKehadiran = () => {
  const [data, setData] = useState({
    waktu: "",
    tanggal: "",
  });
  const [kehadiran, setKehadiran] = useState([]);
  const [selectedWaktuSholat, setSelectedWaktuSholat] = useState("");
  const [isSelectedWaktuSholat, setIsSelectedWaktuSholat] = useState(false);
  const [countdown, setCountdown] = useState(600);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const { mutate } = useCreateWaktuSholat()

  useEffect(() => {
    const savedWaktuSholat = localStorage.getItem("selectedWaktuSholat");
    const countdown = localStorage.getItem("countdown");
    const savedAttendance = localStorage.getItem("kehadiran");

    if (savedWaktuSholat || countdown || savedAttendance) {
      setIsModalVisible(true);
    }
  }, []);

  useEffect(() => {
    if (kehadiran.length > 0) {
      const savedWaktuSholat = localStorage.getItem("selectedWaktuSholat");
      const dataSTRING = JSON.stringify(kehadiran);
      localStorage.setItem("kehadiran", dataSTRING);
      mutate({text: dataSTRING, waktu: savedWaktuSholat });
      notify()
    }
  }, [kehadiran, mutate]);

  const handleUsePreviousData = async () => {
    const savedWaktuSholat = localStorage.getItem("selectedWaktuSholat");
    const countdown = localStorage.getItem("countdown");
    const savedAttendanceJSON = localStorage.getItem("kehadiran");
    const savedAttendance = JSON.parse(savedAttendanceJSON)

    if (savedWaktuSholat) {
      setSelectedWaktuSholat(savedWaktuSholat);
      setIsSelectedWaktuSholat(true);
      setCountdown(countdown);
    }
    setKehadiran(savedAttendance);
    setIsModalVisible(false);
    setIsSelectedWaktuSholat(true)
    startCountdown();
    await handleOpenCamera();
  };

  const handleDiscardPreviousData = () => {
    localStorage.removeItem("selectedWaktuSholat");
    localStorage.removeItem("countdown");
    localStorage.removeItem("kehadiran");
    setIsModalVisible(false);
  };

  const handleScanResult = (result) => {
    const waktu = localStorage.getItem("countdown");
    const { id, name } = JSON.parse(result);
    const scanTime = new Date().toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });

    setKehadiran((prev) => {
      const alreadyScanned = prev.some((entry) => entry.id === id);
      if (alreadyScanned) {
        return prev;
      }
      const newData = {
        id,
        name,
        kehadiran: scanTime,
        isTelat: Number(waktu) === 2
      }
      return [
        ...prev,
        newData
      ];
    });
  };

  const { isHasCamera, isCameraOpen, handleOpenCamera, handleStopCamera, ref } =
    useQrScannerSiswa(handleScanResult);

  const waktuSholatOptions = [
    { value: "subuh", label: "Subuh" },
    { value: "dzuhur", label: "Dzuhur" },
    { value: "ashar", label: "Ashar" },
    { value: "maghrib", label: "Maghrib" },
    { value: "isya", label: "Isya" },
  ];

  const handleConfirmWaktuSholat = async () => {
    handleDiscardPreviousData()
    const data = await cekWaktuSholat(selectedWaktuSholat)
    if (selectedWaktuSholat) {
      setIsSelectedWaktuSholat(true);
      setData((prev) => {
        return {
          waktu: selectedWaktuSholat,
          tanggal: Date.now(),
        };
      });
      if(data.data.data !== false) {
        const dataOBJECT = JSON.parse(data.data.data.kehadiran)
        setKehadiran(dataOBJECT)
      }
      localStorage.setItem("selectedWaktuSholat", selectedWaktuSholat);
      await handleOpenCamera();
      startCountdown();
    }
  };

  const startCountdown = () => {
    const interval = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        localStorage.setItem("countdown", prev);
        return prev - 1;
      });
    }, 1000);
  };

  window.addEventListener("beforeunload", function (event) {
    const confirmationMessage = "Apakah Anda yakin ingin meninggalkan halaman ini? Perubahan yang belum disimpan mungkin hilang.";
    
    event.returnValue = confirmationMessage; // Untuk Firefox
    return confirmationMessage; // Untuk browser lain
});

  return (
    <LayoutPage title={"Scan Kehadiran"}>
      <div className="relative flex min-h-[80vh] items-center justify-center bg-black">
        <video
          ref={ref}
          className="absolute inset-0 h-full w-full object-cover"
          autoPlay
        ></video>

        <div className="absolute bottom-8 left-0 right-0 z-10 flex justify-center">
          {!isCameraOpen ? (
            <button
              onClick={async () => {
                await handleOpenCamera();
              }}
              className="rounded-lg bg-green-500 px-4 py-2 text-white transition duration-300 hover:bg-green-600"
            >
              Start Camera
            </button>
          ) : (
            <button
              onClick={handleStopCamera}
              className="rounded-lg bg-red-500 px-4 py-2 text-white transition duration-300 hover:bg-red-600"
            >
              Stop Camera
            </button>
          )}
        </div>

        {!isHasCamera && (
          <div className="absolute left-0 right-0 top-0 z-10 flex items-center justify-center bg-red-500 py-2 text-white">
            Your device does not have a camera.
          </div>
        )}
      </div>

      <div
        className={`absolute inset-0 flex flex-col items-center justify-center bg-white bg-opacity-90 transition-opacity duration-500 ${
          isSelectedWaktuSholat
            ? "pointer-events-none opacity-0"
            : "opacity-100"
        } z-20`}
      >
        <h1 className="mb-4 text-2xl font-bold">Pilih Waktu Sholat</h1>
        <select
          className="mb-4 rounded-md border p-2"
          value={selectedWaktuSholat}
          onChange={(e) => setSelectedWaktuSholat(e.target.value)}
        >
          <option value="" disabled>
            Pilih waktu sholat
          </option>
          {waktuSholatOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <button
          className="rounded-lg bg-blue-500 px-4 py-2 text-white transition duration-300 hover:bg-blue-600"
          onClick={handleConfirmWaktuSholat} // Panggil fungsi handleConfirmWaktuSholat
        >
          Konfirmasi
        </button>
        {/* {isModalVisible && (
          <button
            className="rounded-lg mt-2 bg-green-500 px-4 py-2 text-white transition duration-300 hover:bg-green-600"
            onClick={handleUsePreviousData} // Panggil fungsi handleConfirmWaktuSholat
          >
            Gunakan Data Sebelumnya
          </button>
        )} */}
      </div>

      {isSelectedWaktuSholat && (
        <>
          <h3>
            Waktu Sholat {selectedWaktuSholat} tanggal{" "}
            {formatDate(data.tanggal)}.. Countdown: {Math.floor(countdown / 60)}
            :{("0" + (countdown % 60)).slice(-2)}
          </h3>

          <Table celled selectable>
            <Table.Header>
              <Table.Row>
                <Table.HeaderCell>No</Table.HeaderCell>
                <Table.HeaderCell>ID</Table.HeaderCell>
                <Table.HeaderCell>Nama</Table.HeaderCell>
                <Table.HeaderCell>Kehadiran</Table.HeaderCell>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              <TableLoading
                count={4}
                data={kehadiran}
                messageEmpty={"Tidak ada data"}
              >
                {kehadiran &&
                  kehadiran.map((kehadiranEntry, i) => (
                    <Table.Row key={i}>
                      <Table.Cell>{i + 1}</Table.Cell>
                      <Table.Cell>{kehadiranEntry.id}</Table.Cell>
                      <Table.Cell>{kehadiranEntry.name}</Table.Cell>
                      <Table.Cell className={`${kehadiranEntry.isTelat && 'text-red-600'}`}>{kehadiranEntry.kehadiran}</Table.Cell>
                    </Table.Row>
                  ))}
              </TableLoading>
            </Table.Body>
          </Table>
        </>
      )}
      <Toaster position="top-right" />
    </LayoutPage>
  );
};

export default ScanKehadiran;
