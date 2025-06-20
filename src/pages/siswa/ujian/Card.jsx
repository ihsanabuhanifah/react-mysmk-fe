import dayjs from "dayjs";
import {
  LabelDurasi,
  LabelStatus,
  LabelTipeUjian,
} from "../../../components/Label";
import IMGTES from "../../../image/less.webp";
import { formatWaktu } from "../../../utils/waktu";
import { Button, Icon, Label } from "semantic-ui-react";

export default function Card({ item, handleExam }) {
  const getButtonState = () => {
    switch (item.status) {
      case "open":
        return {
          text: "Kerjakan Sekarang",
          color: "green",
          icon: "pencil alternate"
        };
      case "progress":
        return {
          text: "Lanjutkan Ujian",
          color: "blue",
          icon: "play"
        };
      default:
        return {
          text: "Selesai Dikerjakan",
          color: "grey",
          icon: "check"
        };
    }
  };

  const buttonState = getButtonState();

  return (
    <div className="group relative h-full w-full overflow-hidden rounded-xl bg-white shadow-lg transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
      {/* Card Image with Gradient Overlay */}
      <div className="relative h-48 w-full overflow-hidden">
        <img
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          src={IMGTES}
          alt={item.ujian.judul_ujian}
        />
        
        {/* Dark Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 to-transparent"></div>
        
        {/* Sequence Number for Hierarchical Exams */}
        {item.ujian.is_hirarki && (
          <div className="absolute bottom-0 right-0 top-0 flex w-16 items-center justify-center bg-gradient-to-l from-black/70 via-black/50 to-transparent">
            <span className="text-4xl font-bold text-white">
              {item.ujian.urutan}
            </span>
          </div>
        )}
        
        {/* Badges Container */}
        <div className="absolute left-3 top-3 flex flex-wrap gap-2">
          <LabelDurasi duration={item.ujian.durasi} />
          <LabelStatus status={item.ujian.jenis_ujian} />
          <LabelTipeUjian status={item.ujian.tipe_ujian} />
        </div>
      </div>

      {/* Card Content */}
      <div className="p-4">
        {/* Subject and Teacher */}
        <div className="mb-3">
          <h3 className="text-xl font-bold text-gray-900 line-clamp-1">
            {item.mapel.nama_mapel}
          </h3>
          <p className="text-sm text-gray-600">
            Oleh: {item.teacher.nama_guru}
          </p>
        </div>
        
        {/* Exam Title */}
        <p className="mb-4 text-sm font-medium text-gray-700 line-clamp-2">
          {item.ujian.judul_ujian}
        </p>

        {/* Time Information */}
        <div className="mb-4 grid grid-cols-2 gap-3">
          <TimeBadge 
            title="Mulai" 
            time={item.ujian.waktu_mulai} 
            icon="clock outline" 
          />
          <TimeBadge 
            title="Selesai" 
            time={item.ujian.waktu_selesai} 
            icon="hourglass end" 
          />
        </div>

        {/* Action Button */}
        <Button
          fluid
          size="small"
          color={buttonState.color}
          onClick={() => {
            localStorage.setItem("mapel", item.mapel.nama_mapel);
            handleExam();
          }}
          disabled={item.status === "finish"}
          className={`transition-all hover:shadow-md ${
            item.status === "finish" ? "opacity-70" : ""
          }`}
        >
          <Icon name={buttonState.icon} />
          {buttonState.text}
        </Button>
      </div>
    </div>
  );
}

function TimeBadge({ title, time, icon }) {
  return (
    <div className="flex items-center space-x-2 rounded-lg bg-gray-50 p-2">
      <Icon name={icon} className="!mr-1 !text-gray-500" />
      <div>
        <p className="text-xs font-semibold text-gray-500">{title}</p>
        <p className="text-xs font-medium text-gray-700">
          {time === "-" 
            ? "-" 
            : dayjs(time).subtract(7, 'hour').format("DD MMM, HH:mm")}
        </p>
      </div>
    </div>
  );
}