import { listSiswaOptions } from "../../../api/list";
import React, { useState } from "react";
import { useQuery } from "react-query";
import { useParams } from "react-router-dom";
import {
  kategoriOptions,
  pgOptions,
  pointOptions,
  semesterOptions,
  tfOptions,
  tipeSoalOptions,
} from "../../../utils/options";
import {
  Input,
  Segment,
  Form,
  Select,
  Button,
  Header,
  Divider,
  TextArea,
  Dropdown,
  Icon,
} from "semantic-ui-react";
import { DeleteButton, AddButton } from "../../../components";
import { toast } from "react-toastify";
import { ReactSelectAsync, FormLabel } from "../../../components";
import { getOptions } from "../../../utils/format";
import dayjs from "dayjs";
import useList from "../../../hook/useList";
import { Formik } from "formik";
import * as Yup from "yup";
import {
  createBankSoal,
  updateBankSoal,
  detailBankSoal,
} from "../../../api/guru/bank_soal";

export default function FormSoal() {
  const { dataMapel } = useList();
  const { id } = useParams();
  let { data, isLoading } = useQuery(
    //query key
    ["/bank-soal/update"],
    //axios function,triggered when page/pageSize change
    () => detailBankSoal(id),
    //configuration
    {
      // refetchInterval: 1000 * 60 * 60,
      enabled: id !== undefined,
      select: (response) => {
        return response.data.soal;
      },
      onSuccess: (data) => {
        console.log("data", data);
        data.soal = JSON.parse(data.soal);

        setInitialState({
          payload: [data],
        });
      },
    }
  );

  const [initialState, setInitialState] = useState({
    payload: [
      {
        materi: "",
        mapel_id: null,
        soal: {
          soal: "",
          a: null,
          b: null,
          c: null,
          d: null,
          e: null,
        },
        jawaban: "",
        tipe: "PG",
        point: 10,
      },
    ],
  });

  const onSubmit = async (values, { resetForm }) => {
    try {
      let response;
      if (id === undefined) {
        response = await createBankSoal(values);
        resetForm();
        setInitialState({
          payload: [
            {
              materi: "",
              mapel_id: null,
              soal: {
                soal: "",
                a: null,
                b: null,
                c: null,
                d: null,
                e: null,
              },
              jawaban: "",
              tipe: "PG",
              point: 10,
            },
          ],
        });
      } else {
        response = await updateBankSoal(id, values);
      }

      toast.success(response?.data?.msg, {
        position: "top-right",
        autoClose: 1000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
      });
    } catch (err) {
      if (err?.response?.status === 422) {
        return toast.warn(err?.response?.data?.msg, {
          position: "top-right",
          autoClose: 1000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "colored",
        });
      }

      return toast.error("Ada Kesalahan", {
        position: "top-right",
        autoClose: 1000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
      });
    }
  };
  return (
    <Segment>
      <div className="p-0 lg:p-5  ">
        <Header>
          {id === undefined ? "Form Tambah Soal" : "Form Update Soal"}
        </Header>
        <Divider></Divider>
        <Formik
          initialValues={initialState}
          enableReinitialize
          // validationSchema={AbsensiSchema}
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
            <Form onSubmit={handleSubmit}>
              {values?.payload?.map((value, index) => (
                <div className="space-y-5 border  p-5 shadow-md " key={index}>
                  {id === undefined && (
                    <section className="flex items-center justify-end">
                      <AddButton
                        disabled={false}
                        onClick={() => {
                          setFieldValue("payload", [
                            ...values.payload,
                            {
                              materi: "",
                              mapel_id: null,
                              soal: {
                                soal: "",
                                a: null,
                                b: null,
                                c: null,
                                d: null,
                                e: null,
                              },
                              jawaban: "",
                              tipe: "PG",
                              point: 10,
                            },
                          ]);
                        }}
                        size="small"
                      />
                      <DeleteButton
                        disabled={values.payload.length <= 1}
                        onClick={() => {
                          let filtered = values.payload.filter(
                            (i, itemIndex) => {
                              return itemIndex !== index;
                            }
                          );

                          setFieldValue("payload", filtered);
                        }}
                        size="small"
                      />
                    </section>
                  )}
                  <section className=" grid grid-cols-3 gap-5">
                    <div>
                      <Form.Field
                        control={Select}
                        value={value?.mapel_id}
                        options={getOptions(dataMapel?.data, "nama_mapel")}
                        label={{
                          children: "Mata Pelajaran",
                          htmlFor: `payload[${index}]mapel_id`,
                          name: `payload[${index}]mapel_id`,
                        }}
                        onChange={(event, data) => {
                          setFieldValue(
                            `payload[${index}]mapel_id`,
                            data?.value
                          );
                        }}
                        placeholder="Pilih Mata Pelajaran"
                        search
                        searchInput={{
                          id: `payload[${index}]mapel_id`,
                          name: `payload[${index}]mapel_id`,
                        }}
                      />
                    </div>
                    <div>
                      <Form.Field
                        control={Input}
                        label={`Materi`}
                        placeholder="Materi"
                        name={`payload[${index}]materi`}
                        onChange={(e, data) => {
                          console.log("e", e);

                          setFieldValue(`payload[${index}]materi`, data.value);
                        }}
                        onBlur={handleBlur}
                        value={value?.materi === null ? "" : value?.materi}
                        disabled={isSubmitting}
                        fluid
                        type="text"
                        error={
                          errors?.payload?.[index]?.materi !== undefined &&
                          errors?.payload?.[index]?.materi
                        }
                      />
                    </div>
                    <div>
                      <Form.Dropdown
                        selection
                        search
                        label={{
                          children: "Point",
                          htmlFor: `payload[${index}]point`,
                          name: `payload[${index}]point`,
                        }}
                        placeholder="Jumlah Point"
                        options={pointOptions}
                        id={`payload[${index}]point`}
                        name={`payload[${index}]point`}
                        onChange={(e, data) => {
                          setFieldValue(`payload[${index}]point`, data.value);
                        }}
                        error={
                          errors?.payload?.[index]?.point !== undefined &&
                          errors?.payload?.[index]?.point
                        }
                        value={value?.point}
                      />
                    </div>
                    <div>
                      <Form.Dropdown
                        selection
                        search
                        label={{
                          children: "Tipe Soal",
                          htmlFor: `payload[${index}]tipe`,
                          name: `payload[${index}]tipe`,
                        }}
                        placeholder="Tipe Soal"
                        options={tipeSoalOptions}
                        id={`payload[${index}]tipe`}
                        name={`payload[${index}]tipe`}
                        onChange={(e, data) => {
                          setFieldValue(`payload[${index}]tipe`, data.value);
                        }}
                        error={
                          errors?.payload?.[index]?.tipe !== undefined &&
                          errors?.payload?.[index]?.tipe
                        }
                        value={value?.tipe}
                      />
                    </div>
                    <div>
                      <Form.Dropdown
                        selection
                        search
                        label={{
                          children: "Jawaban",
                          htmlFor: `payload[${index}]jawaban`,
                          name: `payload[${index}]jawaban`,
                        }}
                        placeholder="Tipe Soal"
                        options={value?.tipe === "TF" ? tfOptions : pgOptions}
                        id={`payload[${index}]jawaban`}
                        name={`payload[${index}]jawaban`}
                        onChange={(e, data) => {
                          setFieldValue(`payload[${index}]jawaban`, data.value);
                        }}
                        error={
                          errors?.payload?.[index]?.jawaban !== undefined &&
                          errors?.payload?.[index]?.jawaban
                        }
                        value={value?.jawaban}
                      />
                    </div>
                  </section>
                  <section>
                    <Form.Field
                      control={TextArea}
                      label={`Soal`}
                      placeholder="soal"
                      name={`payload[${index}]soal.soal`}
                      onChange={(e, data) => {
                        console.log("e", e);

                        setFieldValue(`payload[${index}]soal.soal`, data.value);
                      }}
                      onBlur={handleBlur}
                      value={value?.soal.soal === null ? "" : value?.soal.soal}
                      disabled={isSubmitting}
                      fluid
                      type="text"
                      error={
                        errors?.payload?.[index]?.soal.soal !== undefined &&
                        errors?.payload?.[index]?.soal.soal
                      }
                    />

                    <div>
                      <Form.Field
                        control={Input}
                        label={`Pilihan A`}
                        placeholder="A"
                        name={`payload[${index}]soal.a`}
                        onChange={(e, data) => {
                          console.log("e", e);

                          setFieldValue(`payload[${index}]soal.a`, data.value);
                        }}
                        onBlur={handleBlur}
                        value={value?.soal.a === null ? "" : value?.soal.a}
                        disabled={isSubmitting}
                        fluid
                        type="text"
                        error={
                          errors?.payload?.[index]?.soal.a !== undefined &&
                          errors?.payload?.[index]?.soal.a
                        }
                      />
                      <Form.Field
                        control={Input}
                        label={`Pilihan B`}
                        placeholder="B"
                        name={`payload[${index}]soal.b`}
                        onChange={(e, data) => {
                          console.log("e", e);

                          setFieldValue(`payload[${index}]soal.b`, data.value);
                        }}
                        onBlur={handleBlur}
                        value={value?.soal.b === null ? "" : value?.soal.b}
                        disabled={isSubmitting}
                        fluid
                        type="text"
                        error={
                          errors?.payload?.[index]?.soal.b !== undefined &&
                          errors?.payload?.[index]?.soal.b
                        }
                      />
                      <Form.Field
                        control={Input}
                        label={`Pilihan C`}
                        placeholder="C"
                        name={`payload[${index}]soal.c`}
                        onChange={(e, data) => {
                          console.log("e", e);

                          setFieldValue(`payload[${index}]soal.c`, data.value);
                        }}
                        onBlur={handleBlur}
                        value={value?.soal.c === null ? "" : value?.soal.c}
                        disabled={isSubmitting}
                        fluid
                        type="text"
                        error={
                          errors?.payload?.[index]?.soal.c !== undefined &&
                          errors?.payload?.[index]?.soal.c
                        }
                      />
                      <Form.Field
                        control={Input}
                        label={`Pilihan D`}
                        placeholder="D"
                        name={`payload[${index}]soal.d`}
                        onChange={(e, data) => {
                          console.log("e", e);

                          setFieldValue(`payload[${index}]soal.d`, data.value);
                        }}
                        onBlur={handleBlur}
                        value={value?.soal.d === null ? "" : value?.soal.d}
                        disabled={isSubmitting}
                        fluid
                        type="text"
                        error={
                          errors?.payload?.[index]?.soal.d !== undefined &&
                          errors?.payload?.[index]?.soal.d
                        }
                      />
                      <Form.Field
                        control={Input}
                        label={`Pilihan E`}
                        placeholder="E"
                        name={`payload[${index}]soal.e`}
                        onChange={(e, data) => {
                          console.log("e", e);

                          setFieldValue(`payload[${index}]soal.e`, data.value);
                        }}
                        onBlur={handleBlur}
                        value={value?.soal.e === null ? "" : value?.soal.e}
                        disabled={isSubmitting}
                        fluid
                        type="text"
                        error={
                          errors?.payload?.[index]?.soal.e !== undefined &&
                          errors?.payload?.[index]?.soal.e
                        }
                      />
                    </div>
                  </section>
                </div>
              ))}

              <div className="mt-5">
                <Button
                  content={isSubmitting ? "Menyimpan" : "Simpan"}
                  type="submit"
                  fluid
                  icon={() => <Icon name="save" />}
                  loading={isSubmitting}
                  size="medium"
                  color="teal"
                  disabled={isSubmitting}
                />
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </Segment>
  );
}
