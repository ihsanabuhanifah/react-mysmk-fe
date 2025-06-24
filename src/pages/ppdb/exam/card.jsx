import { useState, useEffect } from "react"; // Import useState dan useEffect
import { useTakeExamCalonSantri } from "../../../api/ppdb/examCalonSantri";
import {
  createPenilaian,
  useFetchNilaiDetails,
} from "../../../api/ppdb/penilaian"; // Import API
import {
  LabelDurasi,
  LabelStatus,
  LabelTipeUjian,
} from "../../../components/Label";
import IMGTES from "../../../image/ppdb/less.webp";

import { formatWaktu } from "../../../utils/waktu";
import { Button, Icon, Label } from "semantic-ui-react";

export default function Card({ item, handleExamCalonSantri }) {
  // Use the custom hook to fetch the data based on ID
  const { data } = useFetchNilaiDetails(item.id);


  return (
    <div className="border flex flex-col rounded-md text-xs w-full h-[330px] shadow-sm">
      <div className="bg-gray-400 relative w-full h-[55%] overflow-hidden rounded-t-md">
        <img
          className="w-full h-full object-cover"
          src={IMGTES}
          alt="exam.jpg"
        />

        <div className="absolute inset-0 bg-gradient-to-b from-black/40 to-transparent"></div>

        <div className="absolute inset-0 flex top-2 left-2 h-auto items-start">
          <LabelStatus status={item.jenis_ujian} />
          <LabelTipeUjian status={item.tipe_ujian} />
        </div>
      </div>

      <section className="w-full flex h-[45%] justify-between flex-col pt-4 pb-2 px-2">
        <div className="flex flex-col">
          <p className="font-black font-poppins text-xl leading-none mb-1">
            TEST {item.judul_ujian}
          </p>
        </div>

        <div className="flex w-full gap-4">
          <Waktu title="Ujian Dibuka" waktu={item.waktu_mulai} />
          <Waktu title="Ujian Ditutup" waktu={item.waktu_selesai} />
        </div>

        {/* Display the status */}
        <p className="mt-2 text-sm font-semibold text-gray-700">
          Status: {data?.status || "open"}
        </p>
        <Button
          content={
            item.status === "open"
            ? "Kerjakan"
            : data.status === "progress"
            ? "Lanjutkan"
            : data.status === "finish"
            ? "Selesai"
            : "open"
          }
          type="button"
          fluid
          disabled={data?.status === "finish"}
          onClick={handleExamCalonSantri}
          icon={() => <Icon name="edit" />}
          size="tiny"
          color={(data?.status || item.status) === "locked" ? "grey" : "green"}
        />
      </section>
    </div>
  );
}

function Waktu({ title, waktu }) {
  if (waktu === "-") {
    return (
      <div className="flex flex-col">
        <p className="text-[12px] mb-0 font-black opacity-80">{title}</p>
        <p className="mb-0 text-[10px]">-</p>
      </div>
    );
  }
  return (
    <div className="flex flex-col">
      <p className="text-[12px] mb-0 font-black opacity-80">{title}</p>
      <p className="mb-0 text-[10px]">{formatWaktu(waktu)}</p>
    </div>
  );
}