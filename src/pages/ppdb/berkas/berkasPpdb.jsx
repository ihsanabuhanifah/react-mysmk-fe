import React, { useState } from "react";
import { Form, Button, Icon } from "semantic-ui-react";
import { Formik } from "formik";
import * as yup from "yup";
import { toast } from "react-toastify";
import {
  useProfileCalonSantri,
  useUpdateProfileCalonSantri,
} from "../../../api/ppdb/profile";

const BerkasPpdbSchema = yup.object().shape({
  kk: yup.mixed().required("File harus diunggah!"),
  ijazah: yup.mixed().required("File harus diunggah!"),
  akte: yup.mixed().required("File harus diunggah!"),
  skb: yup.mixed().required("File harus diunggah!"),
  surat_pernyataan: yup.mixed().required("File harus diunggah!"),
});

export default function BerkasPpdb() {
  const { profileData } = useProfileCalonSantri();
  const { updateProfile, mutate } = useUpdateProfileCalonSantri(
    profileData?.id
  );

  const initialState = {
    kk: profileData.kk || "",
    ijazah: profileData.ijazah || "",
    akte: profileData.akte | "",
    skb: profileData.skb | "",
    surat_pernyataan: profileData.surat_pernyataan | "",
  };

  const handleSubmit = (values) => {
    const formData = new FormData();
    Object.keys(values).forEach((key) => {
      if (values[key]) {
        formData.append(key, values[key]);
      }
    });
    mutate(formData);
  };


  // const onSubmit = (values) => {
  //   const formData = new FormData();
  //   formData.append("kk", values.kk);
  //   formData.append("ijazah", values.ijazah);
  //   formData.append("akte", values.akte);
  //   formData.append("skb", values.skb);
  //   formData.append("surat_pernyataan", values.surat_pernyataan);
  
  //   mutate(formData);
  // };

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
        onSubmit={handleSubmit}
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
              <label htmlFor="kk">Kartu Keluarga</label>
              <div className="relative">
                <input
                  id="kk"
                  name="kk"
                  type="file"
                  className="hidden"
                  onChange={(event) => {
                    const file = event.target.files[0];
                    setFieldValue("kk", file);
                  }}
                  onBlur={handleBlur}
                  disabled={isSubmitting}
                />
                <div className="flex items-center border border-gray-300 rounded px-4 py-2 cursor-pointer hover:bg-gray-100">
                  <Button
                    as="label"
                    htmlFor="kk"
                    type="button"
                    className="ml-auto"
                    disabled={isSubmitting}
                  >
                    <Icon name="upload" />
                  </Button>
                  <span className="mr-2 text-gray-500">
                    {values.kk ? values.kk.name : "Pilih File"}
                  </span>
                </div>
              </div>
              {errors.kk && touched.kk && (
                <div className="text-red-500 text-sm mt-1">{errors.kk}</div>
              )}
            </Form.Field>

            <Form.Field className="mb-4">
              <label htmlFor="ijazah">Ijazah Sekolah</label>
              <div className="relative">
                <input
                  id="ijazah"
                  name="ijazah"
                  type="file"
                  className="hidden"
                  onChange={(event) => {
                    const file = event.target.files[0];
                    setFieldValue("ijazah", file);
                  }}
                  onBlur={handleBlur}
                  disabled={isSubmitting}
                />
                <div className="flex items-center border border-gray-300 rounded px-4 py-2 cursor-pointer hover:bg-gray-100">
                  <Button
                    as="label"
                    htmlFor="ijazah"
                    type="button"
                    className="ml-auto"
                    disabled={isSubmitting}
                  >
                    <Icon name="upload" />
                  </Button>
                  <span className="mr-2 text-gray-500">
                    {values.ijazah ? values.ijazah.name : "Pilih File"}
                  </span>
                </div>
              </div>
              {errors.ijazah && touched.ijazah && (
                <div className="text-red-500 text-sm mt-1">{errors.ijazah}</div>
              )}
            </Form.Field>

            <Form.Field className="mb-4">
              <label htmlFor="akte">Akte Kelahiran</label>
              <div className="relative">
                <input
                  id="akte"
                  name="akte"
                  type="file"
                  className="hidden"
                  onChange={(event) => {
                    const file = event.target.files[0];
                    setFieldValue("akte", file);
                  }}
                  onBlur={handleBlur}
                  disabled={isSubmitting}
                />
                <div className="flex items-center border border-gray-300 rounded px-4 py-2 cursor-pointer hover:bg-gray-100">
                  <Button
                    as="label"
                    htmlFor="akte"
                    type="button"
                    className="ml-auto"
                    disabled={isSubmitting}
                  >
                    <Icon name="upload" />
                  </Button>
                  <span className="mr-2 text-gray-500">
                    {values.akte ? values.akte.name : "Pilih File"}
                  </span>
                </div>
              </div>
              {errors.akte && touched.akte && (
                <div className="text-red-500 text-sm mt-1">{errors.akte}</div>
              )}
            </Form.Field>

            <Form.Field className="mb-4">
              <label htmlFor="skb">Surat Keterangan Baik</label>
              <div className="relative">
                <input
                  id="skb"
                  name="skb"
                  type="file"
                  className="hidden"
                  onChange={(event) => {
                    const file = event.target.files[0];
                    setFieldValue("skb", file);
                  }}
                  onBlur={handleBlur}
                  disabled={isSubmitting}
                />
                <div className="flex items-center border border-gray-300 rounded px-4 py-2 cursor-pointer hover:bg-gray-100">
                  <Button
                    as="label"
                    htmlFor="skb"
                    type="button"
                    className="ml-auto"
                    disabled={isSubmitting}
                  >
                    <Icon name="upload" />
                  </Button>
                  <span className="mr-2 text-gray-500">
                    {values.skb ? values.skb.name : "Pilih File"}
                  </span>
                </div>
              </div>
              {errors.skb && touched.skb && (
                <div className="text-red-500 text-sm mt-1">{errors.skb}</div>
              )}
            </Form.Field>

            <Form.Field className="mb-4">
              <label htmlFor="surat_pernyataan">Surat Pernyataan</label>
              <div className="relative">
                <input
                  id="surat_pernyataan"
                  name="surat_pernyataan"
                  type="file"
                  className="hidden"
                  onChange={(event) => {
                    const file = event.target.files[0];
                    setFieldValue("surat_pernyataan", file);
                  }}
                  onBlur={handleBlur}
                  disabled={isSubmitting}
                />
                <div className="flex items-center border border-gray-300 rounded px-4 py-2 cursor-pointer hover:bg-gray-100">
                  <Button
                    as="label"
                    htmlFor="surat_pernyataan"
                    type="button"
                    className="ml-auto"
                    disabled={isSubmitting}
                  >
                    <Icon name="upload" />
                  </Button>
                  <span className="mr-2 text-gray-500">
                    {values.surat_pernyataan
                      ? values.surat_pernyataan.name
                      : "Pilih File"}
                  </span>
                </div>
              </div>
              {errors.surat_pernyataan && touched.surat_pernyataan && (
                <div className="text-red-500 text-sm mt-1">
                  {errors.surat_pernyataan}
                </div>
              )}
            </Form.Field>
            {/* Add similar fields for 'akte', 'skb', and 'surat_pernyataan' with unique name and id */}

            <Button
              content={isSubmitting ? "Proses" : "Upload Berkas"}
              type="submit"
              fluid
              size="medium"
              color="green"
              loading={isSubmitting}
              disabled={isSubmitting}
            />
          </Form>
        )}
      </Formik>
    </div>
  );
}
