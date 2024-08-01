import React from 'react'
import { useParams } from 'react-router-dom'
import LayoutSiswa from '../../../module/layoutSiswa'
import { useGetHasilBelajarDetail } from '../../../api/siswa/hasil_belajar'
import { Table } from 'semantic-ui-react'

export default function HasilBelajarDetail() {
	const { id_mapel } = useParams()

	const { data, isLoading } = useGetHasilBelajarDetail(id_mapel)

	console.log(data)

	return (
		<LayoutSiswa title="Hasil Belajar Detail">
			<div className="w-full pl-2 pr-5 h-full">
				<Table.Header>
					<Table.HeaderCell>No</Table.HeaderCell>
					<Table.HeaderCell>Mapel</Table.HeaderCell>
					<Table.HeaderCell>Nilai Akhir</Table.HeaderCell>
					<Table.HeaderCell>Deskripsi</Table.HeaderCell>
					<Table.HeaderCell>Aksi</Table.HeaderCell>
				</Table.Header>
			</div>
		</LayoutSiswa>
	)
}
