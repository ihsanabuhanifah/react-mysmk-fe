import { LabelDurasi, LabelStatus, LabelTipeUjian } from '../../../components/Label'
import IMGTES from '../../../image/MADINATULQURAN.png'

import { formatWaktu } from '../../../utils/waktu'
import { Button, Icon } from 'semantic-ui-react'
import { IoChevronForwardOutline } from 'react-icons/io5'

export default function Card({ item, handleExam }) {
	console.log(item)
	return (
		<div className="border flex rounded-md text-xs w-full gap-x-2">
			<img className="w-[200px] bg-cover border-r-2 h-[150px] border-t-0 rounded-tr-md rounded-tl-md" src={IMGTES} alt="exam.jpg" />

			<section className="h-full flex-1 flex flex-col py-2 pl-2 pr-4 justify-between">
				<div className="flex justify-between">
					<div className="flex items-center gap-x-2">
						<div className="flex flex-col">
							<p className="font-black font-poppins text-3xl leading-none mb-0">{item.ujian.mapel.nama_mapel}</p>
							<p className="text-xs opacity-70">{item.teacher.nama_guru}</p>
						</div>
						<div className='flex gap-x-1'>
							<span>
								<LabelStatus status={item.ujian.jenis_ujian} />
							</span>
							<span>
								<LabelTipeUjian status={item.ujian.tipe_ujian} />
							</span>
						</div>
					</div>

					<div className="flex items-center gap-x-2">
						<p className="text-[12px] mb-0">{item.ujian.durasi} Menit</p>
						<IoChevronForwardOutline size={16} />
					</div>
				</div>

				<div className="flex w-full justify-end">
					<Button
						content={item.status === 'open' ? 'Kerjakan' : item.status === 'progress' ? 'Lanjutkan' : 'Sudah Selesai'}
						type="button"
						disabled={item.status === 'finish'}
						onClick={handleExam}
						icon={() => <Icon name="edit" />}
						size="tiny"
						color="green"
					/>
				</div>

				<div className="flex w-full justify-between">
					<Waktu title="Waktu Mulai" waktu={item.ujian.waktu_mulai} />
					<Waktu title="Waktu Selesai" waktu={item.ujian.waktu_selesai} />
					<Waktu title="Jam Mulai" waktu={item.ujian.jam_mulai} />
					<Waktu title="Jam Mulai" waktu={item.ujian.jam_selesai} />
				</div>
			</section>

			<div className={`w-[20px] h-full rounded-r-md ${item.status === 'open' ? 'bg-[#18a558]' : item.status === 'progress' ? 'bg-blue-400' : 'bg-gray-200'}`}></div>

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
	)
}

function Waktu({ title, waktu }) {
	return (
		<div className="flex flex-col">
			<p className="text-[14px] mb-0 font-black opacity-80">{title}</p>
			<p className="mb-0 text-[12px]">{formatWaktu(waktu)}</p>
		</div>
	)
}
