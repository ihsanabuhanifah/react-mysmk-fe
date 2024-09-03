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
		<div className="border flex flex-col rounded-md text-xs w-full h-[330px] shadow-sm">
			<div className="bg-gray-400 relative w-full h-[55%] overflow-hidden rounded-t-md">
				<img className="w-full h-full object-cover" src={IMGTES} alt="exam.jpg" />


				<div className="absolute inset-0 bg-gradient-to-b from-black/40 to-transparent"></div>
				{
					item.ujian.is_hirarki && (
					<div className='absolute bottom-0 top-0 right-0 flex items-center justify-center bg-gradient-to-l from-black/70 to-transparent w-[25%]'>
						<p className='text-white text-4xl font-black pl-8'>{item.ujian.urutan}</p>
					</div>
					)
				}

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
					<p className="font-black font-poppins text-2xl leading-none mb-0 capitalize">{item.mapel.nama_mapel} <span className='font-medium text-sm'>({item.ujian.judul_ujian})</span> </p>
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
					color={item.status === 'open' ? 'green' : item.status === 'progress' ? 'blue' : 'bg-gray-200'}
				/>
			</section>
		</div>
	)
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
