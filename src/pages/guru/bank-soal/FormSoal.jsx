import React, { useContext, useEffect, useState } from "react";
import { useQuery, useQueryClient } from "react-query";
import { useParams } from "react-router-dom";
import {
  pgOptions,
  pointOptions,
  tfOptions,
  tipeSoalOptions,
} from "../../../utils/options";
import { Input, Form, Select, Button, Icon, TextArea } from "semantic-ui-react";
import { DeleteButton, AddButton, FormLabel } from "../../../components";
import { toast } from "react-toastify";
import { getOptions } from "../../../utils/format";
import useList from "../../../hook/useList";
import { Formik, FormikProvider, useFormik } from "formik";
import * as Yup from "yup";

import {
  createBankSoal,
  updateBankSoal,
  detailBankSoal,
} from "../../../api/guru/bank_soal";
import LayoutPage from "../../../module/layoutPage";
import Editor from "../../../components/Editor";
import MemoizedEditor from "../../../components/MemorizeEditor";
import { SocketContext } from "../../../SocketProvider";
import ImageUploader from "./ImageUpload";

let personalSchema = Yup.object().shape({
  materi: Yup.string().nullable().required("wajib disii"),
  mapel_id: Yup.string().nullable().required("wajib pilih"),
  point: Yup.string().nullable().required("wajib pilih"),
  tipe: Yup.string().nullable(),
  soal: Yup.object().shape({
    soal: Yup.string().nullable().required("wajib isi"),
    tipe: Yup.string().nullable(),
    a: Yup.string().nullable(),
    b: Yup.string().nullable(),
    c: Yup.string().nullable(),
    d: Yup.string().nullable(),
    e: Yup.string().nullable(),
  }),
  jawaban: Yup.string()
    .nullable()
    .when("tipe", {
      is: (id) => {
        if (["ES", "LV"].includes(id) === false) {
          return true;
        }
      },
      then: (id) => Yup.string().nullable().required("wajib pilih"),
    }),
});
let AbsensiSchema = Yup.object().shape({
  payload: Yup.array().of(personalSchema),
});

export default function FormSoal({ id }) {
  const { socket } = useContext(SocketContext);
  const [memorize, setMemorize] = useState(false);

  const { dataMapel } = useList();

  const queryClient = useQueryClient();
  let { data, isFetching, refetch } = useQuery(
    //query key
    ["/bank-soal/update", [id]],
    //axios function,triggered when page/pageSize change
    () => detailBankSoal(id),
    //configuration
    {
      // refetchInterval: 1000 * 60 * 60,
      enabled: id !== null,
      staleTime: 1000 * 60 * 10,
      select: (response) => {
        let data = response.data.soal;

        data.soal = JSON.parse(data.soal);
        setInitialState({
          payload: [data],
        });
        return response.data.soal;
      },
    },
  );

  useEffect(() => {
    refetch();
  }, [id]);

  const [initialState, setInitialState] = useState({
    payload: [
      {
        materi: "",
        mapel_id: null,
        soal: {
          soal: "",
          tipe: "",
          a: null,
          b: null,
          c: null,
          d: null,
          e: null,
        },
        jawaban: "",
        tipe: "",
        point: 10,
      },
    ],
  });

  const onSubmit = async (values, { resetForm }) => {
    try {
      let response;

      // return console.log('va', values)
      if (id === undefined || id === null) {
        response = await createBankSoal(values);
        resetForm();
        setInitialState({
          payload: [
            {
              ...values.payload[0],

              soal: {
                soal: "",
                tipe: values.payload[0].soal.tipe,
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

      queryClient.invalidateQueries("/bank-soal/list");
      if (id) {
        queryClient.invalidateQueries("/guru/ujian/analisa");
        queryClient.invalidateQueries("/bank-soal/update");
      }
      localStorage.removeItem("create_soal");

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

  let local = localStorage.getItem("create_soal");

  const formik = useFormik({
    initialValues: id ? initialState : local ? JSON.parse(local) : initialState,
    // initialValues : initialState,
    validationSchema: AbsensiSchema,
    enableReinitialize: true,
    onSubmit: onSubmit,
  });
  const {
    errors,
    touched,
    handleChange,
    handleBlur,
    handleSubmit,
    setFieldValue,
    isSubmitting,
    values,
  } = formik;

  useEffect(() => {
    if (!id) {
      localStorage.setItem("create_soal", JSON.stringify(formik.values));
    }
  }, [formik.values]);

  useEffect(() => {
    if (!socket) return;

    socket.on("simpan.reply", (data) => {
      console.log("Data", data);
    });

    return () => {
      socket.off("simpan.reply");
    };
  }, [socket]); // ← Dependency `data` tidak perlu

  return (
    <LayoutPage
      isLoading={isFetching}
      title={id === undefined ? "Form Tambah Soal" : "Form Update Soal"}
    >
      <div className="p-0">
        <FormikProvider values={formik}>
          {" "}
          <Form onSubmit={handleSubmit}>
            {values?.payload?.map((value, index) => (
              <div className="space-y-5" key={index}>
                <section className="mt-10 grid grid-cols-1 gap-5 rounded-lg border p-5 lg:grid-cols-3">
                  {id === undefined && (
                    <div className="col-span-3 flex justify-end">
                      <DeleteButton
                        disabled={values.payload.length <= 1}
                        onClick={() => {
                          let filtered = values.payload.filter(
                            (i, itemIndex) => {
                              return itemIndex != index;
                            },
                          );

                          setFieldValue("payload", filtered);
                        }}
                        size="small"
                      />
                    </div>
                  )}

                  <div className="col-span-3">
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
                        setFieldValue(`payload[${index}]mapel_id`, data?.value);
                      }}
                      placeholder="Pilih"
                      search
                      searchInput={{
                        id: `payload[${index}]mapel_id`,
                        name: `payload[${index}]mapel_id`,
                      }}
                      error={
                        errors?.payload?.[index]?.mapel_id !== undefined &&
                        errors?.payload?.[index]?.mapel_id
                      }
                    />
                  </div>

                  <div className="col-span-3">
                    <Form.Field
                      control={Input}
                      label={`Materi`}
                      placeholder="Materi"
                      name={`payload[${index}]materi`}
                      onChange={(e, data) => {
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
                  <div className="col-span-3">
                    <ImageUploader
                      values={values}
                      setFieldValue={setFieldValue}
                      index={index}
                      setMemorize={setMemorize}
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
                        setFieldValue(`payload[${index}]soal.tipe`, data.value);
                      }}
                      error={
                        errors?.payload?.[index]?.tipe !== undefined &&
                        errors?.payload?.[index]?.tipe
                      }
                      value={value?.tipe}
                    />
                  </div>

                  {["ES", "LV"].includes(value.tipe) === false && (
                    <div>
                      <Form.Dropdown
                        selection
                        search
                        label={{
                          children: "Jawaban",
                          htmlFor: `payload[${index}]jawaban`,
                          name: `payload[${index}]jawaban`,
                        }}
                        placeholder="Pilih"
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
                  )}
                </section>

                <section className="rounded-md border p-5 shadow-md">
                  <div className="mb-5">
                    <FormLabel>Uraian Soal</FormLabel>
                    {memorize ? (
                      <MemoizedEditor
                        error={
                          errors?.payload?.[index]?.soal?.soal !== undefined &&
                          errors?.payload?.[index]?.soal?.soal
                        }
                        value={
                          value?.soal.soal === null ? "" : value?.soal.soal
                        }
                        handleChange={(content) => {
                          setFieldValue(`payload[${index}]soal.soal`, content);
                        }}
                      />
                    ) : (
                      <Editor
                        error={
                          errors?.payload?.[index]?.soal?.soal !== undefined &&
                          errors?.payload?.[index]?.soal?.soal
                        }
                        value={
                          value?.soal.soal === null ? "" : value?.soal.soal
                        }
                        handleChange={(content) => {
                          setFieldValue(`payload[${index}]soal.soal`, content);
                        }}
                      />
                    )}
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
                        {memorize ? (
                          <MemoizedEditor
                            error={
                              errors?.payload?.[index]?.soal?.soal !==
                                undefined &&
                              errors?.payload?.[index]?.soal?.soal
                            }
                            value={
                              value?.soal.soal === null ? "" : value?.soal.soal
                            }
                            handleChange={(content) => {
                              setFieldValue(
                                `payload[${index}]soal.soal`,
                                content,
                              );
                            }}
                          />
                        ) : (
                          <Editor
                            error={
                              errors?.payload?.[index]?.soal?.a !== undefined &&
                              errors?.payload?.[index]?.soal?.a
                            }
                            value={value?.soal.a === null ? "" : value?.soal.a}
                            handleChange={(content) => {
                              console.log("co", content);
                              setFieldValue(`payload[${index}]soal.a`, content);
                            }}
                          />
                        )}
                      </section>
                      <section>
                        <FormLabel>Pilihan B</FormLabel>
                        {memorize ? (
                          <MemoizedEditor
                            error={
                              errors?.payload?.[index]?.soal?.b !== undefined &&
                              errors?.payload?.[index]?.soal?.b
                            }
                            value={value?.soal.b === null ? "" : value?.soal.b}
                            handleChange={(content) => {
                              setFieldValue(`payload[${index}]soal.b`, content);
                            }}
                          />
                        ) : (
                          <Editor
                            error={
                              errors?.payload?.[index]?.soal?.b !== undefined &&
                              errors?.payload?.[index]?.soal?.b
                            }
                            value={value?.soal.b === null ? "" : value?.soal.b}
                            handleChange={(content) => {
                              setFieldValue(`payload[${index}]soal.b`, content);
                            }}
                          />
                        )}
                      </section>

                      <section>
                        <FormLabel>Pilihan C</FormLabel>
                        {memorize ? (
                          <MemoizedEditor
                            error={
                              errors?.payload?.[index]?.soal?.c !== undefined &&
                              errors?.payload?.[index]?.soal?.c
                            }
                            value={value?.soal.c === null ? "" : value?.soal.c}
                            handleChange={(content) => {
                              setFieldValue(`payload[${index}]soal.c`, content);
                            }}
                          />
                        ) : (
                          <Editor
                            error={
                              errors?.payload?.[index]?.soal?.c !== undefined &&
                              errors?.payload?.[index]?.soal?.c
                            }
                            value={value?.soal.c === null ? "" : value?.soal.c}
                            handleChange={(content) => {
                              setFieldValue(`payload[${index}]soal.c`, content);
                            }}
                          />
                        )}
                      </section>

                      <section>
                        <FormLabel>Pilihan D</FormLabel>
                        {memorize ? (
                          <MemoizedEditor
                            error={
                              errors?.payload?.[index]?.soal?.d !== undefined &&
                              errors?.payload?.[index]?.soal?.d
                            }
                            va
                            value={value?.soal.d === null ? "" : value?.soal.d}
                            handleChange={(content) => {
                              setFieldValue(`payload[${index}]soal.d`, content);
                            }}
                          />
                        ) : (
                          <Editor
                            error={
                              errors?.payload?.[index]?.soal?.d !== undefined &&
                              errors?.payload?.[index]?.soal?.d
                            }
                            va
                            value={value?.soal.d === null ? "" : value?.soal.d}
                            handleChange={(content) => {
                              setFieldValue(`payload[${index}]soal.d`, content);
                            }}
                          />
                        )}
                      </section>

                      <section>
                        <FormLabel>Pilihan E</FormLabel>
                        {memorize ? (
                          <MemoizedEditor
                            error={
                              errors?.payload?.[index]?.soal?.e !== undefined &&
                              errors?.payload?.[index]?.soal?.e
                            }
                            va
                            value={value?.soal.e === null ? "" : value?.soal.e}
                            handleChange={(content) => {
                              setFieldValue(`payload[${index}]soal.e`, content);
                            }}
                          />
                        ) : (
                          <Editor
                            error={
                              errors?.payload?.[index]?.soal?.e !== undefined &&
                              errors?.payload?.[index]?.soal?.e
                            }
                            va
                            value={value?.soal.e === null ? "" : value?.soal.e}
                            handleChange={(content) => {
                              setFieldValue(`payload[${index}]soal.e`, content);
                            }}
                          />
                        )}
                      </section>
                    </div>
                  )}
                </section>
              </div>
            ))}

            <div className="mt-5">
              {id === undefined && (
                <Button
                  basic
                  fluid
                  type="button"
                  onClick={() => {
                    setFieldValue("payload", [
                      ...values.payload,
                      {
                        materi:
                          values.payload[values.payload.length - 1].materi,
                        mapel_id:
                          values.payload[values.payload.length - 1].mapel_id,
                        soal: {
                          soal: "",
                          tipe: "",
                          a: null,
                          b: null,
                          c: null,
                          d: null,
                          e: null,
                        },
                        jawaban: "",
                        tipe: values.payload[values.payload.length - 1].tipe,
                        point: values.payload[values.payload.length - 1].point,
                      },
                    ]);
                  }}
                  color="teal"
                  content="Tambah"
                  icon="add"
                  labelPosition="left"
                />
              )}
            </div>

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
        </FormikProvider>
      </div>
    </LayoutPage>
  );
}
