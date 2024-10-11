import {
  LabelDurasi,
  LabelStatus,
  LabelTipeUjian,
} from "../../../components/Label";
import IMGTES from "../../../image/less.webp";

import { formatWaktu } from "../../../utils/waktu";
import { Button, Icon, Label } from "semantic-ui-react";

export default function Card({ item, handleExam }) {
  return (
    <div className="flex h-[330px] w-full flex-col rounded-md border text-xs shadow-sm">
      <div className="relative h-[55%] w-full overflow-hidden rounded-t-md bg-gray-400">
        <img
          className="h-full w-full object-cover"
          src={IMGTES}
          alt="exam.jpg"
        />

        <div className="absolute inset-0 bg-gradient-to-b from-black/40 to-transparent"></div>
        {item.ujian.is_hirarki && (
          <div className="absolute bottom-0 right-0 top-0 flex w-[25%] items-center justify-center bg-gradient-to-l from-black/70 to-transparent">
            <p className="pl-8 text-4xl font-black text-white">
              {item.ujian.urutan}
            </p>
          </div>
        )}

        <div className="absolute inset-0 left-2 top-2 flex h-auto items-start">
          <Label
            size="tiny"
            content={`${item.ujian.durasi} Menit`}
            color="gray"
            as="a"
          />
          <LabelStatus status={item.ujian.jenis_ujian} />
          <LabelTipeUjian status={item.ujian.tipe_ujian} />
        </div>
      </div>

      <section className="flex h-[45%] w-full flex-col justify-between px-2 pb-2 pt-4">
        <div className="flex flex-col">
          <p className="mb-0 font-poppins text-2xl font-black capitalize leading-none">
            {item.mapel.nama_mapel}{" "}
            <span className="text-sm opacity-70">{item.teacher.nama_guru}</span>
          </p>
          <p className="text-sm font-medium line-clamp-1">
            ({item.ujian.judul_ujian})
          </p>{" "}
        </div>

        <div className="flex w-full justify-between gap-1">
          <Waktu title="Ujian Dibuka" waktu={item.ujian.waktu_mulai} />
          <Waktu title="Ujian Ditutup" waktu={item.ujian.waktu_selesai} />
          <Waktu title="Jam Mulai" waktu={item.jam_mulai} />
          <Waktu title="Jam Mulai" waktu={item.jam_selesai} />
        </div>

        <Button
          content={
            item.status === "open"
              ? "Kerjakan"
              : item.status === "progress"
                ? "Lanjutkan"
                : "Sudah Selesai"
          }
          type="button"
          disabled={item.status === "finish"}
          onClick={handleExam}
          icon={() => <Icon name="edit" />}
          size="tiny"
          fluid
          color={
            item.status === "open"
              ? "green"
              : item.status === "progress"
                ? "blue"
                : "bg-gray-200"
          }
        />
      </section>
    </div>
  );
}

function Waktu({ title, waktu }) {
  if (waktu === "-") {
    return (
      <div className="flex flex-col">
        <p className="mb-0 text-[12px] font-black opacity-80">{title}</p>
        <p className="mb-0 text-[10px]">-</p>
      </div>
    );
  }
  return (
    <div className="flex flex-col">
      <p className="mb-0 text-[12px] font-black opacity-80">{title}</p>
      <p className="mb-0 text-[10px]">{formatWaktu(waktu)}</p>
    </div>
  );
}
