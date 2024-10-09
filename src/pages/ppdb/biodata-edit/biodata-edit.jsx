/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useState } from "react";
import * as yup from "yup";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button, Form } from "semantic-ui-react";
import { Input } from "../../../components/input";
import { Formik } from "formik";
import { toast } from "react-toastify";
import { CreateDataCalonSantri } from "../../../api/ppdb/pendaftaran";
import { format, parseISO } from "date-fns";
import Profile from "../../../image/ppdb/profile.png";
import { useQuery } from "react-query";
import {
  getProfileCalonSantri,
  useProfileCalonSantri,
  useUpdateProfileCalonSantri,
} from "../../../api/ppdb/profile";
import lodash from "lodash";

const BiodataCalonSantriSchema = yup.object().shape({
  nama_siswa: yup.string().nullable().default("").required("wajib di isi!"),
  tanggal_lahir: yup.string().nullable().default("").required("Wajib diisi!"),
  tempat_lahir: yup.string().nullable().default("").required("wajib di isi!"),
  alamat: yup.string().nullable().default("").required("wajib di isi!"),
  sekolah_asal: yup.string().nullable().default("").required("wajib di isi!"),
  nisn: yup
    .string()
    .nullable()
    .default("")
    .min(10, "Minimal 10 digit")
    .max(10)
    .required("Wajib di isi"),
  nis: yup
    .string()
    .nullable()
    .default("")
    .min(10, "Minimal 10 digit")
    .max(10)
    .required("Wajib di isi"),
  nik: yup
    .string()
    .nullable()
    .default("")
    .min(16, "Minimal 16 digit")
    .max(16)
    .required("Wajib di isi"),
  jenis_kelamin: yup.string().nullable().default("").required("wajib di isi!"),
  anak_ke: yup.number().nullable().default("").required("wajib di isi!"),
  nama_ayah: yup.string().nullable().default("").required("wajib di isi!"),
  pekerjaan_ayah: yup.string().nullable().default("").required("wajib di isi!"),
  nama_ibu: yup.string().nullable().default("").required("wajib di isi!"),
  pekerjaan_ibu: yup.string().nullable().default("").required("wajib di isi!"),
  nama_wali: yup.string().nullable().default("").optional(),
  pekerjaan_wali: yup.string().nullable().default("").optional(),
  hubungan: yup.string().nullable().default("").optional(),
});

export default function BiodataUpdatePPdb() {
  const navigate = useNavigate();
  const { profileData } = useProfileCalonSantri();
  const { updateProfile, mutate } = useUpdateProfileCalonSantri(
    profileData?.id
  );


  const initialState = {
    nama_siswa: profileData?.nama_siswa,
    tanggal_lahir: profileData?.tanggal_lahir,
    tempat_lahir: profileData?.tempat_lahir,
    alamat: profileData?.alamat,
    sekolah_asal: profileData?.sekolah_asal,
    nisn: profileData?.nisn,
    nik: profileData?.nik,
    nis: profileData?.nis,
    jenis_kelamin: profileData?.jenis_kelamin,
    anak_ke: profileData?.anak_ke,
    nama_ayah: profileData?.nama_ayah,
    pekerjaan_ayah: profileData?.pekerjaan_ayah,
    nama_ibu: profileData?.nama_ibu,
    pekerjaan_ibu: profileData?.pekerjaan_ibu,
    nama_wali: profileData?.nama_wali,
    pekerjaan_wali: profileData?.pekerjaan_wali,
    hubungan: profileData?.hubungan,
  };

  const onSubmit = async (values, { setErrors }) => {
    console.log("values yang di kirim pada mutate adalah:", values);
    mutate(values);
  };

  return (
    <div className="mt-4 pr-[40%] pb-8 h-full overflow-y-auto overflow-x-hidden">
      <div className="">
        <h1 className="text-2xl pl-5 capitalize mb-8 font-black font-poppins">
          Update Biodata
        </h1>
        <p className="pl-5 pb-12 font-poppins">
          Silahkan isi data diri anda dengan lengkap dan benar, kekeliruan dalam
          pengisian dapat membuat anda tidak lulus verifikasi data
        </p>
      </div>

      <div className="flex flex-col w-full items-center ml-5">
        <div className="w-[85px] border relative h-[85px] rounded-full bg-red-200 mb-4">
          <img
            src={Profile}
            alt="You"
            className="w-full relative z-0 rounded-full"
          />
          <div className="w-[20px] h-[20px] bg-blue-500 absolute z-[5] rounded-full bottom-1 right-1 "></div>
        </div>

        <Formik
          initialValues={initialState}
          validationSchema={BiodataCalonSantriSchema}
          enableReinitialize
          onSubmit={onSubmit}
        >
          {({
            values,
            errors,
            touched,
            handleChange,
            handleBlur,
            handleSubmit,
            setFieldValue,
            isSubmitting,
          }) => (
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
                    pointing: "above",
                  }
                }
                type="text"
              />
              <Form.Field
                control={Input}
                label="Tanggal Lahir"
                name="tanggal_lahir"
                onChange={handleChange}
                onBlur={handleBlur}
                value={
                  values.tanggal_lahir
                    ? format(parseISO(values.tanggal_lahir), "yyyy-MM-dd")
                    : ""
                }
                disabled={isSubmitting}
                fluid
                error={
                  errors.tanggal_lahir &&
                  touched.tanggal_lahir && {
                    content: `${errors?.tanggal_lahir}`,
                    pointing: "above",
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
                    pointing: "above",
                  }
                }
                type="text"
              />
              <Form.Field
                control={Input}
                label="NISN"
                name="nisn"
                onChange={(data) => {
                  const { value } = data.target;
                  if (/^[0-9]*$/.test(value) && value.length <= 10) {
                    setFieldValue("nisn", value);
                  }
                }}
                onBlur={handleBlur}
                value={values.nisn}
                disabled={isSubmitting}
                fluid
                error={
                  errors.nisn &&
                  touched.nisn && {
                    content: `${errors?.nisn}`,
                    pointing: "above",
                  }
                }
                type="text"
              />
              <Form.Field
                control={Input}
                label="NIS"
                name="nis"
                onChange={(data) => {
                  const { value } = data.target;
                  if (/^[0-9]*$/.test(value) && value.length <= 10) {
                    setFieldValue("nis", value);
                  }
                }}
                onBlur={handleBlur}
                value={values.nis}
                disabled={isSubmitting}
                fluid
                error={
                  errors.nis &&
                  touched.nis && {
                    content: `${errors?.nis}`,
                    pointing: "above",
                  }
                }
                type="text"
              />
              <Form.Field
                control={Input}
                label="NIK"
                name="nik"
                onChange={(data) => {
                  const { value } = data.target;
                  if (/^[0-9]*$/.test(value) && value.length <= 16) {
                    setFieldValue("nik", value);
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
                    pointing: "above",
                  }
                }
                type="text"
              />
              <Form.Field
                control={Input}
                label="Jenis Kelamin"
                name="jenis_kelamin"
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.jenis_kelamin}
                disabled={isSubmitting}
                fluid
                error={
                  errors.jenis_kelamin &&
                  touched.jenis_kelamin && {
                    content: `${errors?.jenis_kelamin}`,
                    pointing: "above",
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
                error={
                  errors.anak_ke &&
                  touched.anak_ke && {
                    content: `${errors?.anak_ke}`,
                    pointing: "above",
                  }
                }
                type="text"
              />
              <Form.Field
                control={Input}
                label="Alamat Tinggal"
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
                    pointing: "above",
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
                    pointing: "above",
                  }
                }
                type="text"
              />
              <div className="text-customGreen font-semibold text-xl py-8">
                <p>Data Orang Tua</p>
              </div>

              <Form.Field
                control={Input}
                label="Nama Bapak"
                name="nama_ayah"
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.nama_ayah}
                disabled={isSubmitting}
                fluid
                error={
                  errors.nama_ayah &&
                  touched.nama_ayah && {
                    content: `${errors?.nama_ayah}`,
                    pointing: "above",
                  }
                }
                type="text"
              />

              <Form.Field
                control={Input}
                label="Nama Ibu"
                name="nama_ibu"
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.nama_ibu}
                disabled={isSubmitting}
                fluid
                error={
                  errors.nama_ibu &&
                  touched.nama_ibu && {
                    content: `${errors?.nama_ibu}`,
                    pointing: "above",
                  }
                }
                type="text"
              />
              <Form.Field
                control={Input}
                label="Pekerjaan Bapak"
                name="pekerjaan_ayah"
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.pekerjaan_ayah}
                disabled={isSubmitting}
                fluid
                error={
                  errors.pekerjaan_ayah &&
                  touched.pekerjaan_ayah && {
                    content: `${errors?.pekerjaan_ayah}`,
                    pointing: "above",
                  }
                }
                type="text"
              />
              <Form.Field
                control={Input}
                label="Pekerjaan Ibu"
                name="pekerjaan_ibu"
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.pekerjaan_ibu}
                disabled={isSubmitting}
                fluid
                error={
                  errors.pekerjaan_ibu &&
                  touched.pekerjaan_ibu && {
                    content: `${errors?.pekerjaan_ibu}`,
                    pointing: "above",
                  }
                }
                type="text"
              />
              <div className="text-customGreen text-xl py-8">
                <p className="font-semibold">Data Wali</p>
                <p className="text-base italic">
                  Perhatian! Data wali hanya diisi apabila{" "}
                  <a className="text-red-500 font-medium">
                    calon santri tidak memiliki orang tua
                  </a>
                </p>
              </div>
              <Form.Field
                control={Input}
                label="Nama Wali"
                name="nama_wali"
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.nama_wali}
                disabled={isSubmitting}
                fluid
                error={
                  errors.nama_wali &&
                  touched.nama_wali && {
                    content: `${errors?.nama_wali}`,
                    pointing: "above",
                  }
                }
                type="text"
              />
              <Form.Field
                control={Input}
                label="Pekerjaan Wali"
                name="pekerjaan_wali"
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.pekerjaan_wali}
                disabled={isSubmitting}
                fluid
                error={
                  errors.pekerjaan_wali &&
                  touched.pekerjaan_wali && {
                    content: `${errors?.pekerjaan_wali}`,
                    pointing: "above",
                  }
                }
                type="text"
              />
              <Form.Field
                control={Input}
                label="Hubungan"
                name="hubungan"
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.hubungan}
                disabled={isSubmitting}
                fluid
                error={
                  errors.hubungan &&
                  touched.hubungan && {
                    content: `${errors?.hubungan}`,
                    pointing: "above",
                  }
                }
                type="text"
              />
              <Button
                content={isSubmitting ? "Proses" : "Simpan"}
                type="submit"
                fluid
                size="medium"
                color="green"
                loading={isSubmitting}
                disabled={isSubmitting || lodash.isEqual(initialState, values)}
              />
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
}
