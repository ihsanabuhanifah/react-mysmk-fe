import React from 'react'
import { IoNotifications } from 'react-icons/io5'
import { useListNotif } from '../api/siswa/exam'
import { useZUStore } from '../zustand/zustore'

export default function LayoutSiswa({ title, children }) {
	const { data, isFetched } = useListNotif()
	const { setShowNotif, showNotif } = useZUStore((state) => state)

	return (
		<div className="w-full h-screen flex flex-col">
			<div className="flex w-full pl-5 pr-12 border-b items-center justify-between border-black/5">
				<div className="w-full   h-[73px] bg-white flex items-center">
					<h1 className="text-2xl capitalize mb-10 font-black font-poppins">{title}</h1>
					{JSON.stringify(showNotif)}
				</div>

				<button
					onClick={() => {
						setShowNotif()
					}}
					className="relative"
				>
					<IoNotifications size={30} className="" />
					{isFetched && (
						<span className="absolute top-1 right-1 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/2 -translate-y-1/2 bg-red-600 rounded-full">{data?.list?.count}</span>
					)}
				</button>
			</div>

			<div className="flex-1 px-3 pt-5 overflow-hidden h-full w-full bg-white">{children}</div>
		</div>
	)
}
