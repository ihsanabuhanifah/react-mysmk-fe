/* eslint-disable jsx-a11y/anchor-is-valid */
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
  ijazah: yup.string().nullable(),
  akte: yup.string().nullable(),
  skb: yup.string().nullable(),
  surat_pernyataan: yup.string().nullable(),
});

export default function BerkasPpdb() {
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
      <div className="pl-5 pb-5">
        <p className="font-poppins italic">
          Perhatian! Ukuran masing-masing file{" "}
          <a className="text-red-500 font-medium text-lg"> Maksimal 3 MB</a>
        </p>
        <p>
          apabila ukuran file anda terlalu besar,anda bisa mengecilkan ukuran
          file{" "}
          <a
            href="https://tinyjpg.com/"
            className="underline hover:text-blue-400"
          >
            Disini
          </a>
        </p>
        <p className="pb-6 font-poppins">
          Silahkan unggah berkas yang diperlukan untuk pendaftaran calon santri.
          Pastikan file yang diunggah sesuai dengan format yang diminta.
        </p>
      </div>

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
          <Form onSubmit={handleSubmit} className="w-full pl-5">
            {/* {JSON.stringify(values)} */}
            <Form.Field className="mb-4">
              <label>Kartu Keluarga</label>
              {!values.kk ? (
                <DropzoneFile
                  handleDrop={(cont) => {
                    if (cont && cont[0]) { // Jika cont adalah array
                      const file = cont[0];
                      if (file.size > 10 * 1024) {
                        alert("File anda terlalu besar! Maksimal 10 KB.");
                        return; // Hentikan proses jika file terlalu besar
                      }
                    }
                    setFieldValue("kk", cont);
                    console.log("File uploaded:", cont); // Tambahkan ini untuk debugging
                  }}
                />
              ) : (
                <div className="flex items-center space-x-2">
                  {/* Tombol Delete */}
                  <Button
                    icon="delete"
                    color="red"
                    onClick={() => {
                      setFieldValue("kk", null);
                      console.log("File deleted");
                    }}
                  />
                  {/* Link Tautan */}
                  {values.kk && (
                    <a
                      target="_blank"
                      rel="noreferrer"
                      href={
                        typeof values.kk === "string"
                          ? values.kk
                          : URL.createObjectURL(values.kk)
                      }
                      className="text-blue-500 underline"
                    >
                      {values.kk.name || "Lihat Dokumen"}
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
                <DropzoneFile
                  handleDrop={(cont) => {
                     // Cek apakah file melebihi 500 KB
                     if (cont.size > 10 * 1024) {
                      alert("File anda terlalu besar! Maksimal 10 KB.");
                      return; // Hentikan proses jika file terlalu besar
                    }
                    setFieldValue("ijazah", cont);
                    console.log("File uploaded:", cont); // Tambahkan ini untuk debugging
                  }}
                />
              ) : (
                <div className="flex items-center space-x-2">
                  {/* Tombol Delete */}
                  <Button
                    icon="delete"
                    color="red"
                    onClick={() => {
                      setFieldValue("ijazah", null);
                      console.log("File deleted");
                    }}
                  />
                  {/* Link Tautan */}
                  {values.ijazah && (
                    <a
                      target="_blank"
                      rel="noreferrer"
                      href={
                        typeof values.ijazah === "string"
                          ? values.ijazah
                          : URL.createObjectURL(values.ijazah)
                      }
                      className="text-blue-500 underline"
                    >
                      {values.ijazah.name || "Lihat Dokumen"}
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
                <DropzoneFile
                  handleDrop={(cont) => {
                      // Cek apakah file melebihi 500 KB
                      if (cont.size > 10 * 1024) {
                        alert("File anda terlalu besar! Maksimal 10 KB.");
                        return; // Hentikan proses jika file terlalu besar
                      }
                    setFieldValue("akte", cont);
                    console.log("File uploaded:", cont); // Tambahkan ini untuk debugging
                  }}
                />
              ) : (
                <div className="flex items-center space-x-2">
                  {/* Tombol Delete */}
                  <Button
                    icon="delete"
                    color="red"
                    onClick={() => {
                      setFieldValue("akte", null);
                      console.log("File deleted");
                    }}
                  />
                  {/* Link Tautan */}
                  {values.akte && (
                    <a
                      target="_blank"
                      rel="noreferrer"
                      href={
                        typeof values.akte === "string"
                          ? values.akte
                          : URL.createObjectURL(values.akte)
                      }
                      className="text-blue-500 underline"
                    >
                      {values.akte.name || "Lihat Dokumen"}
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
                <DropzoneFile
                  handleDrop={(cont) => {
                     // Cek apakah file melebihi 500 KB
                     if (cont.size > 10 * 1024) {
                      alert("File anda terlalu besar! Maksimal 10 KB.");
                      return; // Hentikan proses jika file terlalu besar
                    }
                    setFieldValue("skb", cont);
                    console.log("File uploaded:", cont); // Tambahkan ini untuk debugging
                  }}
                />
              ) : (
                <div className="flex items-center space-x-2">
                  {/* Tombol Delete */}
                  <Button
                    icon="delete"
                    color="red"
                    onClick={() => {
                      setFieldValue("skb", null);
                      console.log("File deleted");
                    }}
                  />
                  {/* Link Tautan */}
                  {values.skb && (
                    <a
                      target="_blank"
                      rel="noreferrer"
                      href={
                        typeof values.skb === "string"
                          ? values.skb
                          : URL.createObjectURL(values.skb)
                      }
                      className="text-blue-500 underline"
                    >
                      {values.skb.name || "Lihat Dokumen"}
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
                <DropzoneFile
                  handleDrop={(cont) => {
                    // Cek apakah file melebihi 500 KB
                    if (cont.size > 10 * 1024) {
                      alert("File anda terlalu besar! Maksimal 10 KB.");
                      return; // Hentikan proses jika file terlalu besar
                    }
                    setFieldValue("surat_pernyataan", cont);
                    console.log("File uploaded:", cont); // Tambahkan ini untuk debugging
                  }}
                />
              ) : (
                <div className="flex items-center space-x-2">
                  {/* Tombol Delete */}
                  <Button
                    icon="delete"
                    color="red"
                    onClick={() => {
                      setFieldValue("surat_pernyataan", null);
                      console.log("File deleted");
                    }}
                  />
                  {/* Link Tautan */}
                  {values.surat_pernyataan && (
                    <a
                      target="_blank"
                      rel="noreferrer"
                      href={
                        typeof values.surat_pernyataan === "string"
                          ? values.surat_pernyataan
                          : URL.createObjectURL(values.surat_pernyataan)
                      }
                      className="text-blue-500 underline"
                    >
                      {values.surat_pernyataan.name || "Lihat Dokumen"}
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
