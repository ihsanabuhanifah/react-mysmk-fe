import { Formik } from 'formik'
import React, { useEffect, useState } from 'react'
import { Button, Icon, Select, Form, Input } from 'semantic-ui-react'
import { getOptionsText } from '../../../utils/format'

const FilterHasilUjian = ({ params, setParams, setVisible, dataMapel }) => {
	let [mp, setMp] = useState('Semua Mapel')
  let [kls, setKls] = useState('Semua Kelas')

	const onSubmit = (values, { resetForm }) => {
		setParams((prev) => {
			return {
				...prev,
        nama_mapel: mp === 'Semua Mapel' ? '' : mp,
        kelas: kls === 'Semua Kelas' ? '' : kls
			}
		})
		setVisible(false)
		resetForm()
	}

  const mapelsOptions = [
    { id: 9999, nama_mapel: "Semua Mapel" },
    ...(Array.isArray(dataMapel) ? dataMapel : []),
  ];

  const kelasOptions = [
    {id: 1, kelas: 'Semua Kelas'},
    {id: 2, kelas: 'X'},
    {id: 3, kelas: 'XI'},
    {id: 4, kelas: 'XII'},
  ]

	return (
		<Formik initialValues={params} enableReinitialize onSubmit={onSubmit}>
			{({ handleSubmit, setFieldValue }) => (
				<Form onSubmit={handleSubmit}>
					<section className="p-5 bg-gray-50 border shadow-2xl h-screen space-y-5 relative">
						<div className="flex items-center justify-between">
							<button
								type="b"
								onClick={() => {
									setVisible(false)
								}}
								className="text-lg"
							>
								Tutup
							</button>
							<button
								type="button"
								onClick={() => {
									setParams({
										nama_mapel: null,
										ta_id: null,
										tanggal: null,
									})
									setMp('Semua Mapel')
									setKls('Semua Kelas')
									setVisible(false)
								}}
								className="text-lg"
							>
								Reset
							</button>
						</div>

						<div className="text-left">
							<Form.Field
								control={Select}
								options={getOptionsText(mapelsOptions, 'nama_mapel')}
								label={{
									children: 'Mata Pelajaran',
								}}
								onChange={(event, data) => {
									setMp(data?.value)
								}}
								placeholder="Mata Pelajaran"
								search
								value={mp}
							/>
						</div>
						<div className="text-left">
							<Form.Field
								control={Select}
								options={getOptionsText(kelasOptions, 'kelas')}
								label={{
									children: 'Kelas',
								}}
								onChange={(event, data) => {
									setKls(data?.value)
								}}
								placeholder="Kelas"
								search
								value={kls}
							/>
						</div>
						<div className="absolute bottom-2 xl:bottom-12 right-2 left-2">
							<Button icon={() => <Icon name="filter" />} type="submit" content="Terapkan" fluid color="teal" />
						</div>
					</section>
				</Form>
			)}
		</Formik>
	)
}

export default FilterHasilUjian
