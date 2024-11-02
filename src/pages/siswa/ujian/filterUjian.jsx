import { Formik } from 'formik'
import React, { useEffect, useState } from 'react'
import { Button, Icon, Select, Form, Input } from 'semantic-ui-react'
import { getOptionsText } from '../../../utils/format'

const FilterUjian = ({ params, setParams, setVisible, dataMapel }) => {
	let [mp, setMp] = useState('')
	let [st, setSt] = useState('Semua')
  let [stValue, setStValue] = useState('')

  useEffect(() => {
		if (st === 'Sedang Dikerjakan') {
			setStValue('progress')
		} else if (st === 'Belum Dikerjakan') {
			setStValue('open')
		} else if (st === 'Selesai Dikerjakan') {
			setStValue('finish')
		} else if (st === 'Semua') {
			setStValue(null)
		}
	}, [st])

	const onSubmit = (values, { resetForm }) => {
		setParams((prev) => {
			return {
				...prev,
        status: stValue,
        nama_mapel: mp
			}
		})
		setVisible(false)
		resetForm()
	}

  const statusOptions = [
    { key: 'semua', text: 'Semua'},
    { key: 'progress', text: 'Sedang Dikerjakan'},
    { key: 'open', text: 'Belum Dikerjakan'},
    { key: 'finish', text: 'Selesai Dikerjakan'},
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
									setMp('')
									setSt('Semua')
									setVisible(false)
								}}
								className="text-lg"
							>
								Reset
							</button>
						</div>

						{/* <div className="text-left">
							<Form.Field
								control={Select}
								options={getOptionsText(dataMapel, 'nama_mapel')}
								label={{
									children: 'Mata Pelajaran',
								}}
								onChange={(event, data) => {
									setMp(data?.value)
								}}
								placeholder="Mata Pelajaran"
								search
								value={mp}
								clearable
							/>
						</div> */}
						<div className="text-left">
							<Form.Field
								control={Select}
								options={getOptionsText(statusOptions, 'text')}
								label={{
									children: 'Status',
								}}
								onChange={(event, data) => {
									setSt(data?.value)
								}}
								placeholder="Status"
								search
								value={st}
								clearable
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

export default FilterUjian
