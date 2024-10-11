import React from "react";
import BlankProfile from "../../../image/blankprofile.jpg";
import * as Yup from "yup";
import { useSelector } from "react-redux";
import { Formik } from "formik";
import { Button, Form, Input, Loader, TextArea } from "semantic-ui-react";
import { format, parseISO } from "date-fns";
import { useUpdateProfile } from "../../../api/siswa/profile";
import lodash from "lodash";
import { LoadingPage } from "../../../components";
import { IoPencilOutline } from "react-icons/io5";
import Editor from "../../../components/Editor";
import useUploadFile from "../../../hook/useUpload";
import ImageWithFallback from "../../../components/ImageWithFallback";
import { useZUStore } from "../../../zustand/zustore";

const profileSchema = Yup.object().shape({
  nama_siswa: Yup.string().nullable().required("Wajib Diisi"),
  nik: Yup.string().nullable().optional().min(16, "Min 16 Digit").max(16),
  tempat_lahir: Yup.string().nullable().optional().required("Wajib Diisi"),
  alamat: Yup.string().nullable().optional(),
  sekolah_asal: Yup.string().nullable().optional(),
  jenis_kelamin: Yup.string().nullable().optional(),
  anak_ke: Yup.number().nullable().optional().min(1, "Min 1"),
  tanggal_lahir: Yup.date().nullable().optional(),
});

export default function ProfileEdit() {
  const { profile } = useZUStore((state) => state);

  const { upload, isLoading: isLoadUpload } = useUploadFile();

  const initialState = {
    nama_siswa: profile.nama_siswa,
    nik: profile.nik,
    tempat_lahir: profile.tempat_lahir,
    alamat: profile.alamat,
    sekolah_asal: profile.sekolah_asal,
    jenis_kelamin: profile.jenis_kelamin,
    anak_ke: profile.anak_ke,
    tanggal_lahir: profile.tanggal_lahir,
  };

  const { mutate, isLoading } = useUpdateProfile();

  const onSubmit = async (values, { setErrors }) => {
    values.tanggal_lahir = format(parseISO(values.tanggal_lahir), "yyyy-MM-dd");
    console.log(values);
    mutate(values);
  };

  return (
    <>
      {isLoading || isLoadUpload ? (
        <div className="ml-5 mt-[30px]">
          <Loader active inline="left" />
        </div>
      ) : (
        <div className="mt-4 w-full xl:pr-[40%] border-l border-black/5">
          <h1 className="mb-8 pl-5 font-poppins text-2xl font-black capitalize lg:pl-16 xl:pl-5">
            Edit Profile
          </h1>

          <div className="flex w-full flex-col items-center px-5 lg:px-16 xl:px-5">
            <div
              onClick={() => {
                upload();
                // baru berhasil upload belum keganti di db
              }}
              className="relative mb-4 h-[85px] w-[85px] cursor-pointer rounded-full border bg-gray-200"
            >
              <ImageWithFallback
                src={profile?.user?.image}
                alt="You"
                fallbackSrc="/blankprofile.jpg"
              />
            </div>

            <Formik
              initialValues={initialState}
              validationSchema={profileSchema}
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
                handleReset,
                resetForm,
              }) => {
                const handleCancel = () => {
                  resetForm({ values: initialState });
                };

                return (
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
                      min={1}
                      error={
                        errors.anak_ke &&
                        touched.anak_ke && {
                          content: `${errors?.anak_ke}`,
                          pointing: "above",
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
                      value={format(
                        parseISO(values.tanggal_lahir),
                        "yyyy-MM-dd",
                      )}
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
                      label="NIK"
                      name="nik"
                      // onChange={(data) => {
                      // 	const { value } = data.target
                      // 	if (/^[0-9]*$/.test(value) && value.length <= 16) {
                      // 		setFieldValue('nik', value)
                      // 	}
                      // }}
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
                      control={TextArea}
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
                          pointing: "above",
                        }
                      }
                      type="textarea"
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
                    <section className="space-y-2">
                      <Button
                        content={isSubmitting ? "Proses" : "Simpan"}
                        type="submit"
                        fluid
                        size="medium"
                        color="green"
                        loading={isSubmitting}
                        disabled={
                          isSubmitting || lodash.isEqual(initialState, values)
                        }
                      />
                      <Button
                        content="Cancel"
                        type="reset"
                        fluid
                        size="medium"
                        color="blue"
                        onClick={handleCancel}
                        disabled={
                          isSubmitting || lodash.isEqual(initialState, values)
                        }
                      />
                    </section>
                  </Form>
                );
              }}
            </Formik>
          </div>
        </div>
      )}
    </>
  );
}
