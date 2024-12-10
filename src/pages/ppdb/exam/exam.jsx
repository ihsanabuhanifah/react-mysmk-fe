import Card from "./card";
import React, { useEffect, useState } from "react";
import ExamPage from "./ExamPage";
import { Button, Dropdown, Loader } from "semantic-ui-react";
import { LoadingPage } from "../../../components";
import LayoutPpdb from "../../../module/layoutPpdb";
import {
  useExamCalonSantri,
  useTakeExamCalonSantri,
} from "../../../api/ppdb/examCalonSantri";
import {
  createPenilaian,
  useFetchNilaiDetails,
} from "../../../api/ppdb/penilaian"; // Pastikan ini diimport
import { useDetailPembayaran } from "../../../api/ppdb/pembayaran";
export default function UjianPpdb() {
  const [examActive, setExamActive] = useState(null);
  const {
    data = { data: [] },
    setParams,
    isFetching,
  } = useExamCalonSantri(examActive);
  const [selectedStatus, setSelectedStatus] = useState("Semua");
  const { dataPembayaran } = useDetailPembayaran();
  const { mutate: takeExamMutate } = useTakeExamCalonSantri(); // Ambil mutate dari hook
  const { data: dataNilai } = useFetchNilaiDetails();

  useEffect(() => {
    if (selectedStatus === "Sedang Dikerjakan") {
      setParams((prev) => ({
        ...prev,
        status: "progress",
      }));
    } else if (selectedStatus === "Belum Dikerjakan") {
      setParams((prev) => ({
        ...prev,
        status: "open",
      }));
    } else if (selectedStatus === "Selesai Dikerjakan") {
      setParams((prev) => ({
        ...prev,
        status: "finish",
      }));
    } else if (selectedStatus === "Semua") {
      setParams((prev) => ({
        ...prev,
        status: null,
      }));
    }
  }, [selectedStatus, setParams]);

  const handleStatusChange = (e, { value }) => {
    setSelectedStatus(value);
  };

  const statusOptions = [
    { key: "semua", text: "Semua", value: "Semua" },
    { key: "progress", text: "Sedang Dikerjakan", value: "Sedang Dikerjakan" },
    { key: "open", text: "Belum Dikerjakan", value: "Belum Dikerjakan" },
    { key: "finish", text: "Selesai Dikerjakan", value: "Selesai Dikerjakan" },
  ];

  const handleExamCalonSantri = async (itemId) => {
    try {
      console.log("Membuat penilaian...");
      const response = await createPenilaian({ examId: itemId });
      console.log("Penilaian berhasil:", response);

      if (response.status === 200) {
        console.log("Memanggil API takeExam...");
        takeExamMutate(itemId, {
          onSuccess: () => {
            console.log("takeExam berhasil");
            setExamActive(itemId); // Langsung navigasi ke halaman ujian
          },
          onError: (err) => {
            console.error("takeExam gagal:", err);
          },
        });
      }
    } catch (error) {
      console.error("Gagal membuat penilaian", error);
    }
  };

  // const handleExamCalonSantri = async (itemId) => {
  //   try {
  //     // Membuat penilaian
  //     const response = await createPenilaian({ examId: itemId });
  //     if (response.status === 200) {
  //       setExamActive(itemId);

  //       // Memanggil API untuk mengambil ujian
  //       takeExamMutate(itemId);
  //     }
  //   } catch (error) {
  //     console.error("Gagal membuat penilaian", error);
  //   }
  // };

  // Check if profileData is incomplete
  const isPembayaranIncomplete = dataPembayaran
    ? Object.values(dataPembayaran).some((value) => value === null)
    : true;

  return (
    <LayoutPpdb title="Ujian calon Santri">
      <section className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-4 gap-5">
        {isPembayaranIncomplete ? (
          <div className="card bg-red-100 p-4 rounded-md shadow-md w-full">
            <p className="text-red-600 font-semibold">
              Silahkan lakukan pembayaran terlebih dahulu!
            </p>
          </div>
        ) : examActive ? (
          <ExamPage examActive={examActive} setExamActive={setExamActive} />
        ) : (
          <>
            {data &&
              data.data.map((item, index) => (
                <React.Fragment key={index}>
                  <Card
                    item={{
                      ...item,
                      status: item.status,
                    }}
                    handleExamCalonSantri={() =>
                      handleExamCalonSantri(item.id) && setExamActive(item.id)
                    }
                    setExamActive={setExamActive}
                  />
                </React.Fragment>
              ))}
          </>
        )}
        {/* {examActive ? (
          <ExamPage examActive={examActive} setExamActive={setExamActive} />
        ) : (
          <>
            {data &&
              data.data.map((item, index) => (
                <React.Fragment key={index}>
                  <Card
                    item={{
                      ...item,
                      status: item.status,
                    }}
                    handleExamCalonSantri={() =>
                      handleExamCalonSantri(item.id) && setExamActive(item.id)
                    }
                    setExamActive={setExamActive}
                  />
                </React.Fragment>
              ))}
          </>
        )} */}
        {}
      </section>
    </LayoutPpdb>
  );
}
