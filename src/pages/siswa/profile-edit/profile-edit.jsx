import React from 'react'
import BlankProfile from '../../../image/blankprofile.jpg'
import * as Yup from 'yup'
import { useSelector } from 'react-redux'
import { Formik } from 'formik'
import { Button, Form, Input } from 'semantic-ui-react'
import { format, parseISO } from 'date-fns'
import { useUpdateProfile } from '../../../api/siswa/profile'

const profileSchema = Yup.object().shape({
	nama_siswa: Yup.string().nullable().required('Wajib Diisi'),
	nik: Yup.string().nullable().optional().min(16, 'Min 16 Digit').max(16),
	tempat_lahir: Yup.string().nullable().optional().required('Wajib Diisi'),
	alamat: Yup.string().nullable().optional(),
	sekolah_asal: Yup.string().nullable().optional(),
	jenis_kelamin: Yup.string().nullable().optional(),
	anak_ke: Yup.number().nullable().optional().min(1, 'Min 1'),
	tanggal_lahir: Yup.date().nullable().optional(),
})

export default function ProfileEdit() {
	const santriProfile = useSelector((state) => state.data.profile)

	const initialState = {
		nama_siswa: santriProfile.nama_siswa,
		nik: santriProfile.nik,
		tempat_lahir: santriProfile.tempat_lahir,
		alamat: santriProfile.alamat,
		sekolah_asal: santriProfile.sekolah_asal,
		jenis_kelamin: santriProfile.jenis_kelamin,
		anak_ke: santriProfile.anak_ke,
		tanggal_lahir: santriProfile.tanggal_lahir,
	}

	const { mutate } = useUpdateProfile();

	const onSubmit = async (values, { setErrors }) => {
		values.tanggal_lahir = format(parseISO(values.tanggal_lahir), 'yyyy-MM-dd')
		console.log(values)
		mutate(values)
	}

	return (
		<div className="mt-4  pr-[40%] pb-8 h-full overflow-y-auto overflow-x-hidden">
			<h1 className="text-2xl pl-5 capitalize mb-8 font-black font-poppins">Edit Profile</h1>

			<div className="flex flex-col w-full items-center ml-5">
				<div className="w-[85px] border relative h-[85px] rounded-full bg-red-200 mb-4">
					<img src={BlankProfile} alt="You" className="w-full relative z-0 rounded-full" />
					<div className="w-[20px] h-[20px] bg-blue-500 absolute z-10 rounded-full bottom-1 right-1 "></div>
				</div>

				<Formik initialValues={initialState} validationSchema={profileSchema} enableReinitialize onSubmit={onSubmit}>
					{({ values, errors, touched, handleChange, handleBlur, handleSubmit, setFieldValue, isSubmitting }) => (
						<Form onSubmit={handleSubmit} className="w-full">
							<Form.Field
								control={Input}
								label="Nama Lengkap"
								name="nama_siswa"
								onChange={handleChange}
								onBlur={handleBlur}
								value={values.nama_siswa}
								disabled={isSubmitting}
								fluid
								error={
									errors.nama_siswa &&
									touched.nama_siswa && {
										content: `${errors?.nama_siswa}`,
										pointing: 'above',
									}
								}
								type="text"
							/>
							<Form.Field
								control={Input}
								label="Jenis Kelamin"
								name="jenis_kelamin"
								onBlur={handleBlur}
								value={values.jenis_kelamin}
								disabled={isSubmitting}
								fluid
								error={
									errors.jenis_kelamin &&
									touched.jenis_kelamin && {
										content: `${errors?.jenis_kelamin}`,
										pointing: 'above',
									}
								}
								type="text"
							/>
							<Form.Field
								control={Input}
								label="Anak Ke"
								name="anak_ke"
								onChange={handleChange}
								onBlur={handleBlur}
								value={values.anak_ke}
								disabled={isSubmitting}
								fluid
								min={1}
								error={
									errors.anak_ke &&
									touched.anak_ke && {
										content: `${errors?.anak_ke}`,
										pointing: 'above',
									}
								}
								type="number"
							/>
							<Form.Field
								control={Input}
								label="Tanggal Lahir"
								name="tanggal_lahir"
								onChange={handleChange}
								onBlur={handleBlur}
								value={format(parseISO(values.tanggal_lahir), 'yyyy-MM-dd')}
								disabled={isSubmitting}
								fluid
								error={
									errors.tanggal_lahir &&
									touched.tanggal_lahir && {
										content: `${errors?.tanggal_lahir}`,
										pointing: 'above',
									}
								}
								type="date"
							/>
							<Form.Field
								control={Input}
								label="Tempat Lahir"
								name="tempat_lahir"
								onChange={handleChange}
								onBlur={handleBlur}
								value={values.tempat_lahir}
								disabled={isSubmitting}
								fluid
								error={
									errors.tempat_lahir &&
									touched.tempat_lahir && {
										content: `${errors?.tempat_lahir}`,
										pointing: 'above',
									}
								}
								type="text"
							/>
							<Form.Field
								control={Input}
								label="NIK"
								name="nik"
								onChange={(data) => {
									const { value } = data.target
									if (/^[0-9]*$/.test(value) && value.length <= 16) {
										setFieldValue('nik', value)
									}
								}}
								onBlur={handleBlur}
								value={values.nik}
								disabled={isSubmitting}
								fluid
								error={
									errors.nik &&
									touched.nik && {
										content: `${errors?.nik}`,
										pointing: 'above',
									}
								}
								type="text"
							/>

							<Form.Field
								control={Input}
								label="Alamat"
								name="alamat"
								onChange={handleChange}
								onBlur={handleBlur}
								value={values.alamat}
								disabled={isSubmitting}
								fluid
								error={
									errors.alamat &&
									touched.alamat && {
										content: `${errors?.alamat}`,
										pointing: 'above',
									}
								}
								type="text"
							/>
							<Form.Field
								control={Input}
								label="Sekolah Asal"
								name="sekolah_asal"
								onChange={handleChange}
								onBlur={handleBlur}
								value={values.sekolah_asal}
								disabled={isSubmitting}
								fluid
								error={
									errors.sekolah_asal &&
									touched.sekolah_asal && {
										content: `${errors?.sekolah_asal}`,
										pointing: 'above',
									}
								}
								type="text"
							/>
							<Button content={isSubmitting ? 'Proses' : 'Simpan'} type="submit" fluid size="medium" color="green" loading={isSubmitting} disabled={isSubmitting} />
						</Form>
					)}
				</Formik>
			</div>
		</div>
	)
}
