import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import * as yup from "yup";
import { Formik, Field, Form, ErrorMessage } from "formik";
import {
  Form as SemanticForm,
  Button,
  Select,
  Input,
  Divider,
  Segment,
  Checkbox,
  Icon,
} from "semantic-ui-react";
import LayoutSiswa from "../../../module/layoutSiswa";
import useList from "../../../hook/useList";
import { FormLabel, ReactSelectAsync } from "../../../components";
import {
  useCreateLaporanDiniyyah,
  useLaporanPklDiniyyahDetail,
  useUpdateLaporanDiniyyah,
} from "../../../api/siswa/laporan-pkl";

const validationSchema = yup.object().shape({
  dzikir_pagi: yup.boolean().required("Dzikir pagi harus diisi"),
  dzikir_petang: yup.boolean().required("Dzikir petang harus diisi"),
  sholat_shubuh: yup
    .string()
    .oneOf(["sendirian", "berjamaah", "tidak solat"], "Pilih salah satu"),
  sholat_dzuhur: yup
    .string()
    .oneOf(["sendirian", "berjamaah", "tidak solat"], "Pilih salah satu"),
  sholat_ashar: yup
    .string()
    .oneOf(["sendirian", "berjamaah", "tidak solat"], "Pilih salah satu"),
  sholat_magrib: yup
    .string()
    .oneOf(["sendirian", "berjamaah", "tidak solat"], "Pilih salah satu"),
  sholat_isya: yup
    .string()
    .oneOf(["sendirian", "berjamaah", "tidak solat"], "Pilih salah satu"),
  dari_surat: yup.string(),
  sampai_surat: yup.string(),
  dari_ayat: yup.number().min(1, "Dari ayat harus minimal 1").nullable(),
  sampai_ayat: yup.number().min(1, "Sampai ayat harus minimal 1").nullable(),
  laporan_harian_pkl_id: yup
    .number()
    .required("ID Laporan Harian PKL harus diisi")
    .typeError("ID Laporan Harian PKL harus berupa angka"),
});

const solatOptions = [
  { key: "sendirian", value: "sendirian", text: "Sendirian" },
  { key: "berjamaah", value: "berjamaah", text: "Berjamaah" },
  { key: "tidak solat", value: "tidak solat", text: "Tidak Sholat" },
];

const LaporanDiniyyah = () => {
  const { id } = useParams();
  const { dataAlquran, listDataAlquran } = useList();
  const { data, isLoading: detailIsLoading } = useLaporanPklDiniyyahDetail(id);
  const { mutate, isLoading } = useCreateLaporanDiniyyah();
  const { isLoading: updateIsLoading, mutate: updateMutate } =
    useUpdateLaporanDiniyyah(data?.id);
  console.log(data && data ? "ok" : "no");
  const handleSubmit = (values) => {
    if (data !== null) {
      updateMutate(values);
    } else {
      mutate(values);
    }
  };

  console.log(data, "data");
  const navigate = useNavigate();
  const [initialValues, setInitialValues] = useState({
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
  });

  useEffect(() => {
    if (data) {
      console.log("true");
      setInitialValues({
        dzikir_pagi: data.dzikir_pagi || false,
        dzikir_petang: data.dzikir_petang || false,
        sholat_shubuh: data.sholat_shubuh || "",
        sholat_dzuhur: data.sholat_dzuhur || "",
        sholat_ashar: data.sholat_ashar || "",
        sholat_magrib: data.sholat_magrib || "",
        sholat_isya: data.sholat_isya || "",
        dari_surat: data.dari_surat || "",
        sampai_surat: data.sampai_surat || "",
        dari_ayat: data.dari_ayat || null,
        sampai_ayat: data.sampai_ayat || null,
        laporan_harian_pkl_id: id,
      });

      console.log("tes", initialValues.sholat_shubuh);
    }
  }, [data, id]);
  return (
    <LayoutSiswa title="Laporan Diniyyah Harian">
      <div className="mb-10">
        <Icon
          name="arrow left"
          size="large"
          onClick={() => navigate(-1)}
          className="cursor-pointer pb-4"
        />
      </div>
      <div className="flex flex-col gap-y-4 overflow-y-auto pb-12 w-full h-full pl-2 pr-5 mb-2">
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
          enableReinitialize
        >
          {({
            values,
            errors,
            touched,
            handleChange,
            handleBlur,
            handleSubmit,
            setFieldValue,
            dirty,
          }) => (
            <>
              

              <Segment loading={detailIsLoading}>
                <Form className="ui form" onSubmit={handleSubmit}>
                  <SemanticForm.Group widths="equal">
                    <SemanticForm.Field>
                      <FormLabel>Dari Surat</FormLabel>
                      <ReactSelectAsync
                        debounceTimeout={300}
                        value={{
                          value: values.dari_surat,
                          label: values.dari_surat || "Pilih surat",
                        }}
                        loadOptions={listDataAlquran}
                        onChange={(e) => setFieldValue("dari_surat", e.value)}
                        error={
                          errors?.dari_surat !== undefined &&
                          touched?.dari_surat
                        }
                        placeholder="Pilih Surat"
                        additional={{
                          page: 1,
                        }}
                      />
                      <ErrorMessage
                        name="dari_surat"
                        component="div"
                        className="ui pointing red basic label"
                      />
                    </SemanticForm.Field>

                    <SemanticForm.Field>
                      <label>Dari Ayat</label>
                      <Field
                        name="dari_ayat"
                        as={Input}
                        type="number"
                        placeholder="Dari Ayat"
                        value={values.dari_ayat}
                      />
                      <ErrorMessage
                        name="dari_ayat"
                        component="div"
                        className="ui pointing red basic label"
                      />
                    </SemanticForm.Field>
                  </SemanticForm.Group>

                  <SemanticForm.Group widths="equal">
                    <SemanticForm.Field>
                      <FormLabel>Sampai Surat</FormLabel>
                      <ReactSelectAsync
                        debounceTimeout={300}
                        value={{
                          value: values.sampai_surat,
                          label: values.sampai_surat || "Pilih surat",
                        }}
                        loadOptions={listDataAlquran}
                        onChange={(e) => setFieldValue("sampai_surat", e.value)}
                        error={
                          errors?.sampai_surat !== undefined &&
                          touched?.sampai_surat
                        }
                        placeholder="Pilih Surat"
                        additional={{
                          page: 1,
                        }}
                      />
                      <ErrorMessage
                        name="sampai_surat"
                        component="div"
                        className="ui pointing red basic label"
                      />
                    </SemanticForm.Field>

                    <SemanticForm.Field>
                      <label>Sampai Ayat</label>
                      <Field
                        name="sampai_ayat"
                        as={Input}
                        type="number"
                        placeholder="Sampai Ayat"
                        value={values.sampai_ayat}
                      />
                      <ErrorMessage
                        name="sampai_ayat"
                        component="div"
                        className="ui pointing red basic label"
                      />
                    </SemanticForm.Field>
                  </SemanticForm.Group>

                  <Divider section />

                  <SemanticForm.Group widths="equal">
                    <SemanticForm.Field>
                      <label>Sholat Shubuh</label>
                      <Select
                        options={solatOptions}
                        placeholder="Isi keterangan"
                        value={values.sholat_shubuh}
                        onChange={(e, data) => {
                          setFieldValue("sholat_shubuh", data.value);
                        }}
                      />
                      <ErrorMessage
                        name="sholat_shubuh"
                        component="div"
                        className="ui pointing red basic label"
                      />
                    </SemanticForm.Field>
                    <SemanticForm.Field>
                      <label>Sholat Dzuhur</label>
                      <Select
                        options={solatOptions}
                        placeholder="Isi keterangan"
                        value={values.sholat_dzuhur}
                        onChange={(e, data) => {
                          console.log(e);
                          console.log(data.value);
                          setFieldValue("sholat_dzuhur", data.value);
                        }}
                      />
                      <ErrorMessage
                        name="sholat_dzuhur"
                        component="div"
                        className="ui pointing red basic label"
                      />
                    </SemanticForm.Field>
                  </SemanticForm.Group>
                  <SemanticForm.Group widths="equal">
                    <SemanticForm.Field>
                      <label>Sholat Ashar</label>
                      <Select
                        options={solatOptions}
                        placeholder="Isi keterangan"
                        value={values.sholat_ashar}
                        onChange={(e, data) => {
                          console.log(e);
                          console.log(data.value);
                          setFieldValue("sholat_ashar", data.value);
                        }}
                      />
                      {/* onChange={(e) => setFieldValue("sholat_shubuh", e)} */}
                      <ErrorMessage
                        name="sholat_ashar"
                        component="div"
                        className="ui pointing red basic label"
                      />
                    </SemanticForm.Field>
                    <SemanticForm.Field>
                      <label>Sholat Magrib</label>
                      <Select
                        options={solatOptions}
                        placeholder="Isi keterangan"
                        value={values.sholat_magrib}
                        onChange={(e, data) => {
                          console.log(e);
                          console.log(data.value);
                          setFieldValue("sholat_magrib", data.value);
                        }}
                      />
                      <ErrorMessage
                        name="sholat_magrib"
                        component="div"
                        className="ui pointing red basic label"
                      />
                    </SemanticForm.Field>
                  </SemanticForm.Group>
                  <SemanticForm.Field>
                    <label>Sholat Isya</label>
                    <Select
                      options={solatOptions}
                      placeholder="Isi keterangan"
                      value={values.sholat_isya}
                      onChange={(e, data) => {
                        console.log(e);
                        console.log(data.value);
                        setFieldValue("sholat_isya", data.value);
                      }}
                    />
                    <ErrorMessage
                      name="sholat_isya"
                      component="div"
                      className="ui pointing red basic label"
                    />
                  </SemanticForm.Field>

                  <Divider section />

                  <div className="w-full flex justify-between items-center px-0 md:px-6">
                    <SemanticForm.Field>
                      <Checkbox
                        label="Dzikir Pagi"
                        checked={values.dzikir_pagi}
                        onChange={(e, data) => {
                          setFieldValue("dzikir_pagi", data.checked);
                        }}
                      />
                    </SemanticForm.Field>
                    <SemanticForm.Field>
                      <Checkbox
                        label="Dzikir Petang"
                        checked={values.dzikir_petang}
                        onChange={(e, data) => {
                          setFieldValue("dzikir_petang", data.checked);
                        }}
                      />
                    </SemanticForm.Field>
                  </div>

                  <Button
                    className="mt-2"
                    style={{ marginBottom: "20px", marginTop: "15px" }}
                    type="submit"
                    color="green"
                    loading={isLoading || updateIsLoading}
                    disabled={!dirty || isLoading || updateIsLoading}
                  >
                    Submit
                  </Button>
                </Form>
              </Segment>
            </>
          )}
        </Formik>
      </div>
    </LayoutSiswa>
  );
};

export default LaporanDiniyyah;
