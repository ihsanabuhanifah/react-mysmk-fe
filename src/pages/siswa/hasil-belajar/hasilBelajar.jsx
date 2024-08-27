import React from 'react'
import LayoutSiswa from '../../../module/layoutSiswa'
import { Button, Icon, Input, Menu, Sidebar, Table } from 'semantic-ui-react'
import { TableLoading } from '../../../components'
import { useGetHasilBelajar } from '../../../api/siswa/hasil_belajar'
import { useNavigate } from 'react-router-dom'
import { IoFilterOutline } from 'react-icons/io5'
import FilterHasilBelajar from './filter'
import { format, parseISO } from 'date-fns'

export default function HasilBelajar() {
	const navigate = useNavigate()
	const { data, isFetching, setParams, dataTa, params } = useGetHasilBelajar()
  let [visible, setVisible] = React.useState(false);

	return (
		<LayoutSiswa title="Hasil Belajar">
			<Sidebar
        as={Menu}
        animation="overlay"
        icon="labeled"
        inverted
        direction="right"
        onHide={() => setVisible(false)}
        vertical
        visible={visible}
        width="wide"
      >
				<FilterHasilBelajar 
					params={params}
					setParams={setParams}
					setVisible={setVisible}
					dataTa={dataTa}
				/>
			</Sidebar>
			<div className="h-full pl-2 pr-5 w-full">
				<section className="grid grid-cols-4 gap-4">
					<div className="col-span-4 md:col-span-3">
						<Input
							fluid
							loading={false}
							icon="search"
							onChange={(e) => {
								setParams((prev) => {
									return {
										...prev,
										nama_mapel: e.target.value,
									}
								})
							}}
							iconPosition="left"
							placeholder="Search..."
						/>
					</div>
					<div className="col-span-4 md:col-span-1">
						<Button
							content={'Filter'}
							type="button"
							fluid
							icon={() => <Icon name="filter" />}
							size="medium"
							color="teal"
							onClick={() => {
								setVisible(!visible);
							}}
						/>
					</div>
				</section>
				<Table called basic>
					<Table.Header>
						<Table.HeaderCell>No</Table.HeaderCell>
						<Table.HeaderCell>Mapel</Table.HeaderCell>
						<Table.HeaderCell>Tahun Ajaran</Table.HeaderCell>
						<Table.HeaderCell>Rata Nilai Tugas</Table.HeaderCell>
						<Table.HeaderCell>Rata Nilai Harian</Table.HeaderCell>
						<Table.HeaderCell>Rata Nilai PTS</Table.HeaderCell>
						<Table.HeaderCell>Rata Nilai PAS</Table.HeaderCell>
						<Table.HeaderCell>Rata Nilai US</Table.HeaderCell>
						<Table.HeaderCell>Nilai Akhir</Table.HeaderCell>
						<Table.HeaderCell>Deskripsi</Table.HeaderCell>
						<Table.HeaderCell>Tanggal</Table.HeaderCell>
						<Table.HeaderCell>Aksi</Table.HeaderCell>
					</Table.Header>
					<Table.Body>
						<TableLoading count={10} isLoading={isFetching} data={data?.data} messageEmpty="Data tidak ditemukan">
							{data?.data.map((value, i) => (
								<Table.Row key={i}>
									<Table.Cell>{i + 1}</Table.Cell>
									<Table.Cell>{value?.nama_mapel}</Table.Cell>
									<Table.Cell>{value?.hasil_belajar[0]?.tahun_ajaran?.nama_tahun_ajaran}</Table.Cell>
									<Table.Cell>{value?.hasil_belajar[0]?.rata_nilai_tugas ?? '-'}</Table.Cell>
									<Table.Cell>{value?.hasil_belajar[0]?.rata_nilai_harian ?? '-'}</Table.Cell>
									<Table.Cell>{value?.hasil_belajar[0]?.rata_nilai_pts ?? '-'}</Table.Cell>
									<Table.Cell>{value?.hasil_belajar[0]?.rata_nilai_pas ?? '-'}</Table.Cell>
									<Table.Cell>{value?.hasil_belajar[0]?.rata_nilai_us ?? '-'}</Table.Cell>
									<Table.Cell>{value?.hasil_belajar[0]?.nilai ?? '-'}</Table.Cell>
									<Table.Cell>{value?.hasil_belajar[0]?.deskripsi ?? '-'}</Table.Cell>
									<Table.Cell>{format(parseISO(value?.hasil_belajar[0]?.createdAt), 'yyyy-MM-dd')}</Table.Cell>
									<Table.Cell>
										<Button onClick={() => navigate(`/siswa/hasil-belajar/${value.id}`)} content="Detail" type="button" size="medium" color="green" />
									</Table.Cell>
								</Table.Row>
							))}
						</TableLoading>
					</Table.Body>
				</Table>
			</div>
		</LayoutSiswa>
	)
}
