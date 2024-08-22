import React from "react";
import { useParams } from "react-router-dom";
import * as yup from "yup";
import LayoutSiswa from "../../../module/layoutSiswa";
import { useFormik } from "formik";
import useList from "../../../hook/useList";
import { FormLabel, ReactSelectAsync } from "../../../components";

const validationSchema = yup.object().shape({
  dzikir_pagi: yup.boolean().required("Dzikir pagi harus diisi"),
  dzikir_petang: yup.boolean().required("Dzikir petang harus diisi"),
  sholat_shubuh: yup
    .string()
    .oneOf(
      ["sendirian", "berjamaah", "tidak",],
      "Sholat Shubuh harus bernilai 'sendirian' atau 'berjamaah'"
    )
    .required("Sholat Shubuh harus diisi"),
  sholat_dzuhur: yup
    .string()
    .oneOf(
      ["sendirian", "berjamaah", "tidak"],
      "Sholat Dzuhur harus bernilai 'sendirian' atau 'berjamaah'"
    )
    .required("Sholat Dzuhur harus diisi"),
  sholat_ashar: yup
    .string()
    .oneOf(
      ["sendirian", "berjamaah", "tidak"],
      "Sholat Ashar harus bernilai 'sendirian' atau 'berjamaah'"
    )
    .required("Sholat Ashar harus diisi"),
  sholat_magrib: yup
    .string()
    .oneOf(
      ["sendirian", "berjamaah", "tidak"],
      "Sholat Magrib harus bernilai 'sendirian' atau 'berjamaah'"
    )
    .required("Sholat Magrib harus diisi"),
  sholat_isya: yup
    .string()
    .oneOf(
      ["sendirian", "berjamaah", "tidak"],
      "Sholat Isya harus bernilai 'sendirian' atau 'berjamaah'"
    )
    .required("Sholat Isya harus diisi"),
  dari_surat: yup.string().required("Dari surat harus diisi"),
  sampai_surat: yup.string().required("Sampai surat harus diisi"),
  dari_ayat: yup
    .number()
    .min(1, "Dari ayat harus minimal 1")
    .required("Dari ayat harus diisi"),
  sampai_ayat: yup
    .number()
    .min(1, "Sampai ayat harus minimal 1")
    .moreThan(
      yup.ref("dari_ayat"),
      "Sampai ayat harus lebih besar dari dari ayat"
    )
    .required("Sampai ayat harus diisi"),
  laporan_harian_pkl_id: yup
    .number()
    .required("ID Laporan Harian PKL harus diisi")
    .typeError("ID Laporan Harian PKL harus berupa angka"),
});

const LaporanDiniyyah = () => {
  const { id } = useParams();

  let { dataAlquran, listDataAlquran } = useList();

  const formik = useFormik({
    initialValues: {
      dzikir_pagi: false,
      dzikir_petang: false,
      sholat_shubuh: "",
      sholat_dzuhur: "",
      sholat_ashar: "",
      sholat_magrib: "",
      sholat_isya: "",
      dari_surat: "",
      sampai_surat: "",
      dari_ayat: null,
      sampai_ayat: null,
      laporan_harian_pkl_id: id,
    },
    validationSchema: validationSchema,
    onSubmit: (values) => {
      console.log("Form values:", values);
    },
  });

  const {
    handleChange,
    handleSubmit,
    setFieldValue,
    handleBlur,
    values,
    errors,
    touched,
  } = formik;

  return (
    <LayoutSiswa title="Laporan Diniyyah Harian">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="flex flex-wrap -mx-3 mb-6">
          <div className="w-full px-3">
            <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">
              Dari Surat
            </label>
            <ReactSelectAsync
              debounceTimeout={300}
              value={values?.dari_surat}
              loadOptions={listDataAlquran}
              onChange={(e) => setFieldValue("dari_surat", e.value)}
              error={errors?.dari_surat !== undefined && touched?.dari_surat}
              placeholder="Pilih Surat"
              additional={{
                page: 1,
              }}
            />
            {errors.dari_surat && touched.dari_surat ? (
              <p className="text-red-500 text-xs italic">{errors.dari_surat}</p>
            ) : null}
          </div>
        </div>

        {/* Implementasi input lainnya berdasarkan data dari yup validation */}
        <div className="flex flex-wrap -mx-3 mb-6">
          <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
            <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">
              Sholat Shubuh
            </label>
            <div className="relative">
              <select
                name="sholat_shubuh"
                value={values.sholat_shubuh}
                onChange={handleChange}
                onBlur={handleBlur}
                className="block appearance-none w-full bg-gray-200 border border-gray-200 text-gray-700 py-3 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
              >
                <option value="" label="Pilih" />
                <option value="sendirian" label="Sendirian" />
                <option value="berjamaah" label="Berjamaah" />
              </select>
              {errors.sholat_shubuh && touched.sholat_shubuh ? (
                <p className="text-red-500 text-xs italic">{errors.sholat_shubuh}</p>
              ) : null}
            </div>
          </div>
        </div>

        {/* Tambahkan input lainnya seperti di atas untuk form-field lainnya */}

        <div className="flex items-center justify-between">
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            type="submit"
          >
            Save Laporan
          </button>
        </div>
      </form>
    </LayoutSiswa>
  );
};

export default LaporanDiniyyah;
