import React from 'react'

export default function LayoutSiswa({ title, children }) {
	return (
		<div className="w-full h-screen flex flex-col">
			<div className="w-full border-b border-black/5 h-[73px] bg-white flex items-center">
				<h1 className="text-2xl ml-5 capitalize mb-10 font-black font-poppins">{title}</h1>
			</div>

      <div className="flex-1 px-3 pb-4 pt-5 overflow-y-auto h-full w-full bg-white">
        {children}
      </div>
		</div>
	)
}
