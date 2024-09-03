import React from 'react'
import { useNavigate } from 'react-router-dom'
import { MdClose } from 'react-icons/md'
import { showFormattedDate } from '../utils/waktu'
import { useListNotif } from '../api/siswa/exam'
import { useZUStore } from '../zustand/zustore'

export default function Notifikasi() {
	let navigate = useNavigate()
	const { data } = useListNotif()
	const { setShowNotif } = useZUStore((state) => state)

	return (
		<section className="mt-0 w-full overflow-auto p-3 pt-5 h-full xl:h-full xl:border-l-2">
			<div className="px-2 flex items-center mb-4 justify-between">
				<h1 className="text-lg xl:block hidden mb-0">{showFormattedDate(new Date())}</h1>
				<button className="block" onClick={setShowNotif}>
					<MdClose className="w-6 h-6" />
				</button>
			</div>
			<div className="h-[90%] overflow-visible">
				<h2 className="font-poppins mb-4 font-bold text-xl px-2">Pemberitahuan</h2>
				<div>
					{data?.list?.count === 0 ? (
						<p className="p-2 text-[#00b5ad]">Tidak Ada Pemberitahuan</p>
					) : (
						<>
							<section>
								{data?.list?.rows?.map((value, index) => (
									<div key={index}>
										<button
											onClick={() => {
												setShowNotif()
												navigate(`/siswa/ujian`)
											}}
											className="text-sm xl:text-xs flex items-center italic text-justify hover:bg-green-400 xl:hover:bg-blue-50 p-2 text-white xl:text-red-500 hover:text-red-600"
										>
											<div className="h-12 w-2 bg-green-400 mr-5"></div>
											<div>
												Anda belum mengerjakan ujian mata pelajaran {value.mapel.nama_mapel} ({value.ujian.judul_ujian})
											</div>
										</button>
									</div>
								))}
							</section>
						</>
					)}
				</div>
			</div>
		</section>
	)
}
