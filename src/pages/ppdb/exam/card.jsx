import {
    LabelDurasi,
    LabelStatus,
    LabelTipeUjian,
  } from "../../../components/Label";
  
  import { formatWaktu } from "../../../utils/waktu";
  import { Button, Icon } from "semantic-ui-react";
  
  export default function Card({ item, handleExam }) {
    return (
      <div className="border rounded-md text-xs ">
        <img
          className="w-full h-[120px] border-t-0 rounded-tr-md rounded-tl-md"
          src="http://localhost:8085/file-1722260251838.JPEG"
          alt="exam.jpg"
        />
        <section className="px-2 my-2">
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
        </section>
      </div>
    );
  }
  