import { Formik } from 'formik'
import React, { useState } from 'react'
import { Button, Icon, Select, Form, Input } from 'semantic-ui-react'
import { getOptionsText } from '../../../utils/format'

const FilterHasilBelajar = ({ params, setParams, setVisible, dataTa, dataKelas }) => {
	let [th, setTh] = useState('')
	let [tg, setTg] = useState('')
	let [kls, setKls] = useState('')

	const onSubmit = (values, { resetForm }) => {
		setParams((prev) => {
			return {
				...prev,
				ta_id: th,
        tanggal: tg,
				nama_kelas: kls,
			}
		})
		setVisible(false)
		resetForm()
	}

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
									setTh('')
									setTg('')
									setKls('')
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
								options={getOptionsText(dataTa, 'nama_tahun_ajaran')}
								label={{
									children: 'Tahun Pelajaran',
								}}
								onChange={(event, data) => {
									setTh(data?.value)
								}}
								placeholder="Tahun Pelajaran"
								search
								value={th}
								clearable
							/>
						</div>
						
						<div className="text-left">
							<Form.Field
								control={Select}
								options={getOptionsText(dataKelas, 'nama_kelas')}
								label={{
									children: 'Kelas',
								}}
								onChange={(event, data) => {
									setKls(data?.value)
								}}
								placeholder="Kelas"
								search
								value={kls}
								clearable
							/>
						</div>

						<div className='text-left'>
							<Form.Field 
                type='date'
                control={Input}
                label="Tanggal"
                name="tanggal"
                onChange={(e) => setTg(e.target.value)}
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

export default FilterHasilBelajar
