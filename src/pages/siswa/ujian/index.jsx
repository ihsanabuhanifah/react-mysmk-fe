import { useSelector } from 'react-redux'
import LayoutSiswa from '../../../module/layoutSiswa'
import { useExam } from '../../../api/siswa/exam'
import Card from './Card'
import React, { useEffect, useState } from 'react'
import ExamPage from './ExamPage'
import { Button, Dropdown, Loader } from 'semantic-ui-react'
import { LoadingPage } from '../../../components'

export default function UjianSiswa() {
	const [examActive, setExamActive] = useState(null)
	const { data, setParams, isFetching } = useExam(examActive)
	const [selectedStatus, setSelectedStatus] = useState('Sedang Dikerjakan')

	useEffect(() => {
		if (selectedStatus === 'Sedang Dikerjakan') {
			setParams((prev) => ({
				...prev,
				status: 'progress',
			}))
		} else if (selectedStatus === 'Belum Dikerjakan') {
			setParams((prev) => ({
				...prev,
				status: 'open',
			}))
		} else if (selectedStatus === 'Selesai Dikerjakan') {
			setParams((prev) => ({
				...prev,
				status: 'finish',
			}))
		}
	}, [selectedStatus, setParams])

	const handleStatusChange = (e, { value }) => {
		setSelectedStatus(value)
	}

	const statusOptions = [
		{ key: 'progress', text: 'Sedang Dikerjakan', value: 'Sedang Dikerjakan' },
		{ key: 'open', text: 'Belum Dikerjakan', value: 'Belum Dikerjakan' },
		{ key: 'finish', text: 'Selesai Dikerjakan', value: 'Selesai Dikerjakan' },
	]

	return (
		<LayoutSiswa title="Exam">
			{!examActive && (
				<div className="pl-2 pr-2 xl:pr-5">
					<div className="mb-4">
						<Dropdown id="status" selection options={statusOptions} value={selectedStatus} onChange={handleStatusChange} className="w-full sm:w-auto" />
					</div>
				</div>
			)}
			<section className="grid grid-cols-1 mt-4 md:grid-cols-2 xl:grid-cols-3 gap-4 overflow-y-auto pb-20 w-full h-full pl-2 pr-2 xl:pr-5">
				{isFetching ? (
					<div className="mt-[30px]">
						<Loader active inline="left" />
					</div>
				) : examActive ? (
					<ExamPage examActive={examActive} setExamActive={setExamActive} />
				) : data && data.data.rows.length === 0 ? (
					<div className="text-left col-span-full">
						<p>Tidak ada exam yang tersedia</p>
					</div>
				) : (
					data.data.rows.map((item, index) => (
						<React.Fragment key={index}>
							<Card
								item={item}
								handleExam={() => {
									setExamActive(item.id)
								}}
								setExamActive={setExamActive}
							/>
						</React.Fragment>
					))
				)}
			</section>
		</LayoutSiswa>
	)
}
