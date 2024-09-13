import {
  LabelDurasi,
  LabelStatus,
  LabelTipeUjian,
} from "../../../components/Label";
import IMGTES from "../../../image/less.webp";

import { formatWaktu } from "../../../utils/waktu";
import { Button, Icon, Label } from "semantic-ui-react";

export default function Card({ item, handleExam }) {
  console.log(item);
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

      <section className="w-full flex h-[45%] justify-between flex-col pt-4 pb-2 px-2">
        <div className="flex flex-col">
          
            <p className="font-black font-poppins text-xl leading-none mb-1">
              {item.ujian?.mapel?.nama_mapel} - {item.ujian.judul_ujian}
            </p>
            <p className="text-sm opacity-70">{item.teacher.nama_guru}</p>
         
         
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
      {/* endd */}

      {/* <section className="px-2 my-2">
        <div
          style={{
            lineHeight: "1em",
            padding: "2px",
            margin: 0,
          }}
          className="flex items-center justify-between"
        >
          <div>
            {" "}
            <h4 style={{ margin: 0 }}>{item.ujian.mapel.nama_mapel}</h4>{" "}
            <p style={{ margin: 0 }}>{item.teacher.nama_guru}</p>{" "}
          </div>
          <span>
            <LabelDurasi status={item.ujian.durasi} />
          </span>
        </div>

        <section className="border rounded-md p-2">
          <div className="w-full grid grid-cols-2 ">
            <span className="font-semibold">Waktu Mulai</span>
            <span>: {formatWaktu(item.ujian.waktu_mulai)}</span>
          </div>
          <div className="w-full grid grid-cols-2 ">
            <span className="font-semibold">Waktu Selesai</span>
            <span>: {formatWaktu(item.ujian.waktu_selesai)}</span>
          </div>
          <div className="w-full grid grid-cols-2 ">
            <span className="font-semibold">Jam Mulai</span>
            <span>: {formatWaktu(item.jam_mulai)}</span>
          </div>
          <div className="w-full grid grid-cols-2 ">
            <span className="font-semibold">Selesai Mulai</span>
            <span>: {formatWaktu(item.jam_selesai)}</span>
          </div>
        </section>

        <section className="flex items-center space-x-2 mt-2">
          <span>
            <LabelStatus status={item.status} />
          </span>
          <span>
            <LabelStatus status={item.ujian.jenis_ujian} />
          </span>
          <span>
            <LabelTipeUjian status={item.ujian.tipe_ujian} />
          </span>
        </section>

        <div className="mt-5">
          <Button
            content={
              item.status === "open"
                ? "Kerjakan"
                : item.status === "progress"
                ? "Lanjutkan"
                : "Sudah Selesai"
            }
            type="button"
            fluid
            disabled={item.status === "finish"}
            onClick={handleExam}
            icon={() => <Icon name="edit" />}
            size="tiny"
            color="green"
          />
        </div>
      </section> */}
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
