import React, { useRef, useState } from "react";
import { useQuery } from "react-query";
import { useParams } from "react-router-dom";
import {
  pgOptions,
  pointOptions,
  tfOptions,
  tipeSoalOptions,
} from "../../../utils/options";
import { Input, Form, Select, Button, TextArea, Icon } from "semantic-ui-react";
import { DeleteButton, AddButton, Label, FormLabel } from "../../../components";
import { toast } from "react-toastify";
import ReactQuill from "react-quill";
import { getOptions } from "../../../utils/format";
import useList from "../../../hook/useList";
import { Formik } from "formik";

import {
  createBankSoal,
  updateBankSoal,
  detailBankSoal,
} from "../../../api/guru/bank_soal";
import LayoutPage from "../../../module/layoutPage";
import Editor from "../../../components/Editor";

export default function FormSoal() {
  const reactQuillRef = useRef(null);
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

      // return console.log('va', values)
      if (id === undefined) {
        response = await createBankSoal(values);
        resetForm();
        setInitialState({
          payload: [
            {
              ...values.payload[0],
              materi: "",

              soal: {
                soal: "",
                a: null,
                b: null,
                c: null,
                d: null,
                e: null,
              },
              jawaban: "",

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
    <LayoutPage
      title={id === undefined ? "Form Tambah Soal" : "Form Update Soal"}
    >
      <div className="p-0  ">
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
                <div className="space-y-5 " key={index}>
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
                  <section className=" grid grid-cols-1 lg:grid-cols-3 gap-5">
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

                    {value.tipe !== "ES" && (
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
                            setFieldValue(
                              `payload[${index}]jawaban`,
                              data.value
                            );
                          }}
                          error={
                            errors?.payload?.[index]?.jawaban !== undefined &&
                            errors?.payload?.[index]?.jawaban
                          }
                          value={value?.jawaban}
                        />
                      </div>
                    )}
                  </section>

                  <section className="border shadow-md p-5 rounded-md">
                    <div className="mb-5">
                      <FormLabel>Uraian Soal</FormLabel>
                      <Editor
                        value={
                          value?.soal.soal === null ? "" : value?.soal.soal
                        }
                        handleChange={(content) => {
                          setFieldValue(`payload[${index}]soal.soal`, content);
                        }}
                      />
                    </div>
                    {/* <Form.Field
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
                    /> */}

                    {value.tipe === "PG" && (
                      <div className="space-y-5">
                        <section>
                          <FormLabel>Pilihan A</FormLabel>
                          <Editor
                            value={value?.soal.a === null ? "" : value?.soal.a}
                            handleChange={(content) => {
                              setFieldValue(`payload[${index}]soal.a`, content);
                            }}
                          />
                        </section>
                        <section>
                          <FormLabel>Pilihan B</FormLabel>
                          <Editor
                            value={value?.soal.b === null ? "" : value?.soal.b}
                            handleChange={(content) => {
                              setFieldValue(`payload[${index}]soal.b`, content);
                            }}
                          />
                        </section>

                        <section>
                          <FormLabel>Pilihan C</FormLabel>
                          <Editor
                            value={value?.soal.c === null ? "" : value?.soal.c}
                            handleChange={(content) => {
                              setFieldValue(`payload[${index}]soal.c`, content);
                            }}
                          />
                        </section>

                        <section>
                          <FormLabel>Pilihan D</FormLabel>
                          <Editor
                            value={value?.soal.d === null ? "" : value?.soal.d}
                            handleChange={(content) => {
                              setFieldValue(`payload[${index}]soal.d`, content);
                            }}
                          />
                        </section>

                        <section>
                          <FormLabel>Pilihan E</FormLabel>
                          <Editor
                            value={value?.soal.e === null ? "" : value?.soal.e}
                            handleChange={(content) => {
                              setFieldValue(`payload[${index}]soal.e`, content);
                            }}
                          />
                        </section>
                      </div>
                    )}
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
    </LayoutPage>
  );
}
