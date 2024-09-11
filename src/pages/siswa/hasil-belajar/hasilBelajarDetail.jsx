import React from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import LayoutSiswa from '../../../module/layoutSiswa'
import { useGetHasilBelajarDetail } from '../../../api/siswa/hasil_belajar'
import { Table } from 'semantic-ui-react'
import { IoArrowBackOutline } from 'react-icons/io5'
import { LoadingPage, TableLoading } from '../../../components'
import { format } from 'date-fns'
import { LabelStatus } from '../../../components/Label'

export default function HasilBelajarDetail() {
	const { id_mapel } = useParams()
	const navigate = useNavigate()

	const { data, isLoading } = useGetHasilBelajarDetail(id_mapel)

	console.log(data)

	if(isLoading) {
		return <LoadingPage />
	}

	return (
		<LayoutSiswa title={`Hasil Belajar ${data?.data[0] ? data?.data[0].mapel?.nama_mapel : ''}`}>
			<div className="w-full pl-2 pr-5 h-full">
				<button onClick={() => navigate('/siswa/hasil-belajar')} className='flex items-center gap-2 hover:text-[#18a558]'>
					<IoArrowBackOutline size={20} />
					<p>Kembali</p>
				</button>
				<Table called basic>
					<Table.Header>
						<Table.HeaderCell>No</Table.HeaderCell>
						<Table.HeaderCell>Jenis</Table.HeaderCell>
						<Table.HeaderCell>Durasi</Table.HeaderCell>
						<Table.HeaderCell>Jam Mulai</Table.HeaderCell>
						<Table.HeaderCell>Jam Selesai</Table.HeaderCell>
						<Table.HeaderCell>Nilai Akhir</Table.HeaderCell>
						<Table.HeaderCell>Nilai Ujian</Table.HeaderCell>
						<Table.HeaderCell>Keterangan</Table.HeaderCell>
					</Table.Header>
					<Table.Body>
						<TableLoading count={10} isLoading={isLoading} data={data?.data} messageEmpty='Data tidak ditemukan'>
							{data?.data?.map((value, i) => (
								<Table.Row key={i}>
									<Table.Cell>{i + 1}</Table.Cell>
									<Table.Cell className='capitalize'><LabelStatus status={value?.jenis_ujian}/> </Table.Cell>
									<Table.Cell>{value?.ujian?.durasi}</Table.Cell>
									<Table.Cell>{format(new Date(value?.jam_mulai), 'HH:mm')}</Table.Cell>
									<Table.Cell>{format(new Date(value?.jam_selesai), 'HH:mm')}</Table.Cell>
									<Table.Cell>{value?.exam_result}</Table.Cell>
									<Table.Cell>{value?.exam ? value?.exam.slice(1, -1) : '-'}</Table.Cell>
									<Table.Cell>{value?.keterangan ?? '-'}</Table.Cell>
								</Table.Row>
							))}
						</TableLoading>
					</Table.Body>
				</Table>
			</div>
		</LayoutSiswa>
	)
}
