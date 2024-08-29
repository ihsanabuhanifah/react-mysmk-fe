import React, { useState } from "react";
import { Form, Button, Icon } from "semantic-ui-react";
import { Formik } from "formik";
import * as yup from "yup";
import { toast } from "react-toastify";
import {
  useProfileCalonSantri,
  useUpdateProfileCalonSantri,
} from "../../../api/ppdb/profile";
import Dropzone from "react-dropzone";
import { useNavigate } from "react-router-dom";
import DropzoneFile from "../../../components/Dropzone";

const BerkasPpdbSchema = yup.object().shape({
  foto: yup.string().nullable(),
  kk: yup.string().nullable(),
  ijazah: yup.string().nullable().required("File harus diunggah!"),
  akte: yup.string().nullable().required("File harus diunggah!"),
  skb: yup.string().nullable().required("File harus diunggah!"),
  surat_pernyataan: yup.string().nullable().required("File harus diunggah!"),
});

export default function BerkasPpdb() {
  const [file, setFile] = useState("");
  const navigate = useNavigate();
  const { profileData } = useProfileCalonSantri();
  const { updateProfile, mutate } = useUpdateProfileCalonSantri(
    profileData?.id
  );

  const initialState = {
    kk: profileData.kk,
    ijazah: profileData.ijazah,
    akte: profileData.akte,
    skb: profileData.skb,
    surat_pernyataan: profileData.surat_pernyataan,
  };

  const onSubmit = async (values, { setErrors }) => {
    console.log("values yang di kirim pada mutate adalah:", values);
    mutate(values);
  };

  return (
    <div className="mt-4 ml-4 pr-[40%] pb-8 h-full overflow-y-auto overflow-x-hidden">
      <h3 className="text-2xl pl-5 capitalize mb-8 font-black font-poppins">
        Unggah Berkas Calon Santri
      </h3>
      <p className="pl-5 pb-12 font-poppins">
        Silahkan unggah berkas yang diperlukan untuk pendaftaran calon santri.
        Pastikan file yang diunggah sesuai dengan format yang diminta.
      </p>

      <Formik
        initialValues={initialState}
        validationSchema={BerkasPpdbSchema}
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
            <Form.Field className="mb-4">
              <label>Kartu Keluarga</label>
              {!values.kk ? (
                <Dropzone
                  onDrop={(acceptedFiles) => {
                    setFieldValue("kk", acceptedFiles[0]);
                  }}
                >
                  {({ getRootProps, getInputProps }) => (
                    <div
                      {...getRootProps()}
                      className="border-dashed border-2 border-gray-300 p-4 cursor-pointer"
                    >
                      <input {...getInputProps()} />
                      <p>
                        Drag 'n' drop file Kartu Keluarga di sini, atau klik
                        untuk memilih file
                      </p>
                    </div>
                  )}
                </Dropzone>
              ) : (
                <div className="flex items-center space-x-2">
                  <Button
                    icon="delete"
                    color="red"
                    onClick={() => {
                      setFieldValue("kk", null);
                    }}
                  />
                  {values.kk instanceof File && (
                    <a
                      target="_blank"
                      rel="noreferrer"
                      href={URL.createObjectURL(values.kk)}
                    >
                      {values.kk.name}
                    </a>
                  )}
                </div>
              )}
              {touched.kk && errors.kk && (
                <div className="text-red-500 text-sm mt-1">{errors.kk}</div>
              )}
            </Form.Field>

            <Form.Field className="mb-4">
              <label>Ijazah Sekolah</label>
              {!values.ijazah ? (
                <Dropzone
                  onDrop={(acceptedFiles) => {
                    setFieldValue("ijazah", acceptedFiles[0]);
                  }}
                >
                  {({ getRootProps, getInputProps }) => (
                    <div
                      {...getRootProps()}
                      className="border-dashed border-2 border-gray-300 p-4 cursor-pointer"
                    >
                      <input {...getInputProps()} />
                      <p>
                        Drag 'n' drop file Ijazah di sini, atau klik untuk memilih file
                      </p>
                    </div>
                  )}
                </Dropzone>
              ) : (
                <div className="flex items-center space-x-2">
                  <Button
                    icon="delete"
                    color="red"
                    onClick={() => {
                      setFieldValue("ijazah", null);
                    }}
                  />
                  {values.ijazah instanceof File && (
                    <a
                      target="_blank"
                      rel="noreferrer"
                      href={URL.createObjectURL(values.ijazah)}
                    >
                      {values.ijazah.name}
                    </a>
                  )}
                </div>
              )}
              {touched.ijazah && errors.ijazah && (
                <div className="text-red-500 text-sm mt-1">{errors.ijazah}</div>
              )}
            </Form.Field>

            <Form.Field className="mb-4">
              <label>Akte Kelahiran</label>
              {!values.akte ? (
                <Dropzone
                  onDrop={(acceptedFiles) => {
                    setFieldValue("akte", acceptedFiles[0]);
                  }}
                >
                  {({ getRootProps, getInputProps }) => (
                    <div
                      {...getRootProps()}
                      className="border-dashed border-2 border-gray-300 p-4 cursor-pointer"
                    >
                      <input {...getInputProps()} />
                      <p>
                        Drag 'n' drop file Akte di sini, atau klik untuk memilih file
                      </p>
                    </div>
                  )}
                </Dropzone>
              ) : (
                <div className="flex items-center space-x-2">
                  <Button
                    icon="delete"
                    color="red"
                    onClick={() => {
                      setFieldValue("akte", null);
                    }}
                  />
                  {values.akte instanceof File && (
                    <a
                      target="_blank"
                      rel="noreferrer"
                      href={URL.createObjectURL(values.akte)}
                    >
                      {values.akte.name}
                    </a>
                  )}
                </div>
              )}
              {touched.akte && errors.akte && (
                <div className="text-red-500 text-sm mt-1">{errors.akte}</div>
              )}
            </Form.Field>

            <Form.Field className="mb-4">
              <label>Surat Keterangan Baik</label>
              {!values.skb ? (
                <Dropzone
                  onDrop={(acceptedFiles) => {
                    setFieldValue("skb", acceptedFiles[0]);
                  }}
                >
                  {({ getRootProps, getInputProps }) => (
                    <div
                      {...getRootProps()}
                      className="border-dashed border-2 border-gray-300 p-4 cursor-pointer"
                    >
                      <input {...getInputProps()} />
                      <p>
                        Drag 'n' drop file Surat Keterangan Baik di sini, atau
                        klik untuk memilih file
                      </p>
                    </div>
                  )}
                </Dropzone>
              ) : (
                <div className="flex items-center space-x-2">
                  <Button
                    icon="delete"
                    color="red"
                    onClick={() => {
                      setFieldValue("skb", null);
                    }}
                  />
                  {values.skb instanceof File && (
                    <a
                      target="_blank"
                      rel="noreferrer"
                      href={URL.createObjectURL(values.skb)}
                    >
                      {values.skb.name}
                    </a>
                  )}
                </div>
              )}
              {touched.skb && errors.skb && (
                <div className="text-red-500 text-sm mt-1">{errors.skb}</div>
              )}
            </Form.Field>

            <Form.Field className="mb-4">
              <label>Surat Pernyataan</label>
              {!values.surat_pernyataan ? (
                <Dropzone
                  onDrop={(acceptedFiles) => {
                    setFieldValue("surat_pernyataan", acceptedFiles[0]);
                  }}
                >
                  {({ getRootProps, getInputProps }) => (
                    <div
                      {...getRootProps()}
                      className="border-dashed border-2 border-gray-300 p-4 cursor-pointer"
                    >
                      <input {...getInputProps()} />
                      <p>
                        Drag 'n' drop file Surat Pernyataan di sini, atau klik untuk memilih file
                      </p>
                    </div>
                  )}
                </Dropzone>
              ) : (
                <div className="flex items-center space-x-2">
                  <Button
                    icon="delete"
                    color="red"
                    onClick={() => {
                      setFieldValue("surat_pernyataan", null);
                    }}
                  />
                  {values.surat_pernyataan instanceof File && (
                    <a
                      target="_blank"
                      rel="noreferrer"
                      href={URL.createObjectURL(values.surat_pernyataan)}
                    >
                      {values.surat_pernyataan.name}
                    </a>
                  )}
                </div>
              )}
              {touched.surat_pernyataan && errors.surat_pernyataan && (
                <div className="text-red-500 text-sm mt-1">
                  {errors.surat_pernyataan}
                </div>
              )}
            </Form.Field>

            <Button type="submit" color="blue" disabled={isSubmitting}>
              {isSubmitting ? "Menyimpan..." : "Simpan"}
            </Button>
          </Form>
        )}
      </Formik>
    </div>
  );
}
