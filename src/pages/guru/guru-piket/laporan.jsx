import React from "react";
import LayoutPage from "../../../module/layoutPage";
import { useNavigate, useParams } from "react-router-dom";

import { Formik } from "formik";
import * as Yup from "yup";
import { toast } from "react-toastify";
import { useQuery } from "react-query";
import { getOptionsText } from "../../../utils/format";
import { DeleteButton, Label } from "../../../components";
import {
  Select,
  Form,
  Button,
  Radio,
  TextArea,
  Message,
  Icon
} from "semantic-ui-react";
import { izinGuruOptions } from "../../../utils/options";
import {
  postLaporanGuruPiket,
  getDetailLaporanGuruPiket,
} from "../../../api/guru/laporan";

import useList from "../../../hook/useList";

let absenSchema = Yup.object().shape({
  nama_kelas: Yup.string().required("wajib diisi"),
  nama_guru: Yup.string().required("wajib pilih"),
  alasan: Yup.string().required("wajib diisi"),
  tugas: Yup.boolean().required("wajib diisi"),
});

let laporanSchema = Yup.object().shape({
  // pelanggaran: Yup.array().of(absenSchema),
  laporan: Yup.object().shape({
    guru: Yup.object().shape({
      isSemuaHadir: Yup.boolean().required("wajib disi"),
      absen: Yup.array().of(absenSchema),
    }),
    catatan: Yup.string().required("Catatan Wajib Disi"),
  }),
});

export default function LaporanGuruPiket() {
  let { tanggal, id } = useParams();
  const [initialState, setInitialState] = React.useState({
    id: id,
    tanggal: tanggal,
    laporan: {
      guru: {
        isSemuaHadir: "",
        absen: [],
      },

      catatan: "",
    },
  });

  let { data, isLoading } = useQuery(
    //query key
    ["laporan_guru_piket", { id, tanggal }],
    //axios function,triggered when page/pageSize change
    () => getDetailLaporanGuruPiket(id, tanggal),
    //configuration
    {
      enabled: tanggal !== undefined && id !== undefined,
      //   refetchOnWindowFocus: false,
      //   refetchOnmount: false,
      //   refetchOnReconnect: false,
      //   retry: false,
      //   staleTime: twentyFourHoursInMs,
      select: (response) => {
        return response.data.data;
      },
      onSuccess: (data) => {
        setInitialState(data);
      },
    }
  );
  let { dataKelas, dataGuru } = useList();

  const onSubmit = async (values) => {
    try {
      const response = await postLaporanGuruPiket(values);

      return toast.success(response?.data?.msg, {
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
    <LayoutPage title={`Buat Laporan Piket`}>
      <section className="mt-5">
        <Formik
          initialValues={initialState}
          validationSchema={laporanSchema}
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
            <Form onSubmit={handleSubmit}>
              <div className="space-y-5 ">
                <section className="space-y-5 overflow-visible h-full">
                  <p className="font-bold text-lg">
                    {" "}
                    1. Apakah ada kelas yang gurunya tidak hadir?
                  </p>
                  <div className="flex space-x-5">
                    <Radio
                      readOnly={false}
                      name="laporan.guru.isSemuaHadir"
                      value={values?.laporan?.guru?.isSemuaHadir}
                      error
                      checked={
                        values?.laporan?.guru?.isSemuaHadir === false
                          ? true
                          : false
                      }
                      onChange={() => {
                        setFieldValue("laporan.guru.isSemuaHadir", false);
                        setFieldValue("laporan.guru.absen", [
                          {
                            nama_guru: "",
                            nama_kelas: "",
                            alasan: "",
                            tugas: null,
                          },
                        ]);
                      }}
                      label="Ya"
                    ></Radio>
                    <Radio
                      readOnly={false}
                      name="laporan.guru.isSemuaHadir"
                      value={values?.laporan?.guru?.isSemuaHadir}
                      checked={
                        values?.laporan?.guru?.isSemuaHadir === true
                          ? true
                          : false
                      }
                      onChange={() => {
                        setFieldValue("laporan.guru.isSemuaHadir", true);
                        setFieldValue("laporan.guru.absen", []);
                      }}
                      label="Tidak"
                    ></Radio>
                  </div>

                  {console.log(errors)}
                  {errors?.laporan?.guru?.isSemuaHadir &&
                    touched.laporan?.guru?.isSemuaHadir && <p>wajib disi</p>}

                  {!values?.laporan?.guru?.isSemuaHadir && (
                    <div className="space-y-2 ">
                      {values?.laporan?.guru?.absen?.map((absen, index) => (
                        <>
                          <section className="grid grid-cols-12  gap-5 ">
                            <div className=" col-span-12 md:col-span-12 lg:col-span-12 xl:col-span-3 ">
                              <Form.Field
                                control={Select}
                                value={absen?.nama_kelas}
                                options={getOptionsText(
                                  dataKelas?.data,
                                  "nama_kelas"
                                )}
                                label={{
                                  children: "Kelas",
                                  htmlFor: `laporan.guru.absen[${index}]nama_kelas`,
                                  name: `laporan.guru.absen[${index}]nama_kelas`,
                                }}
                                onChange={(event, data) => {
                                  setFieldValue(
                                    `laporan.guru.absen[${index}]nama_kelas`,
                                    data?.value
                                  );
                                }}
                                placeholder="Nama Kelas"
                                search
                                searchInput={{
                                  id: `laporan.guru.absen[${index}]nama_kelas`,
                                  name: `laporan.guru.absen[${index}]nama_kelas`,
                                }}
                              />
                            </div>
                            <div className=" col-span-12 md:col-span-12 lg:col-span-12 xl:col-span-3">
                              <Form.Field
                                control={Select}
                                value={absen?.nama_guru}
                                options={getOptionsText(
                                  dataGuru?.data,
                                  "nama_guru"
                                )}
                                label={{
                                  children: "Nama Guru",
                                  htmlFor: `laporan.guru.absen[${index}]nama_guru`,
                                  name: `laporan.guru.absen[${index}]nama_guru`,
                                }}
                                onChange={(event, data) => {
                                  setFieldValue(
                                    `laporan.guru.absen[${index}]nama_guru`,
                                    data?.value
                                  );
                                }}
                                placeholder="Nama Guru"
                                search
                                searchInput={{
                                  id: `laporan.guru.absen[${index}]nama_guru`,
                                  name: `laporan.guru.absen[${index}]nama_guru`,
                                }}
                              />
                            </div>

                            <div className="col-span-12 md:col-span-12 lg:col-span-12 xl:col-span-3">
                              <Form.Dropdown
                                selection
                                search
                                label={{
                                  children: "Alasan",
                                  htmlFor: `laporan.guru.absen[${index}]alasan`,
                                  name: `laporan.guru.absen[${index}]alasan`,
                                }}
                                options={izinGuruOptions}
                                id={`laporan.guru.absen[${index}]alasan`}
                                name={`laporan.guru.absen[${index}]alasan`}
                                onChange={(e, data) => {
                                  setFieldValue(
                                    `laporan.guru.absen[${index}]alasan`,
                                    data.value
                                  );
                                }}
                                // error={
                                //   errors?.absensi_kehadiran?.[index]?.kehadiran
                                //     ?.alasan !== undefined &&
                                //   errors?.absensi_kehadiran?.[index]?.kehadiran
                                //     ?.alasan
                                // }
                                value={absen?.alasan}
                              />
                            </div>

                            <div className="col-span-12 md:col-span-12 :col-span-12 xl:col-span-2  ">
                              <Form.Group grouped>
                                <label>Sudah diberikan Tugas?</label>
                                <Form.Group inline className=" h-12" as="div">
                                  <Form.Field
                                    control={Radio}
                                    label="Ya"
                                    value={absen?.tugas}
                                    checked={
                                      absen.tugas === true ? true : false
                                    }
                                    onChange={(e, data) => {
                                      setFieldValue(
                                        `laporan.guru.absen[${index}]tugas`,
                                        true
                                      );
                                    }}
                                  />
                                  <Form.Field
                                    control={Radio}
                                    label="Tidak"
                                    value={absen?.tugas}
                                    checked={
                                      absen.tugas === false ? true : false
                                    }
                                    onChange={(e, data) => {
                                      setFieldValue(
                                        `laporan.guru.absen[${index}]tugas`,
                                        false
                                      );
                                    }}
                                  />
                                </Form.Group>
                              </Form.Group>
                            </div>
                            <div className="col-start-1 col-span-12 md:col-span-12 lg:col-span-12 xl:col-span-1 flex justify-end">
                              <DeleteButton
                                disabled={
                                  values.laporan.guru.absen?.length <= 1
                                }
                                onClick={() => {
                                  let filtered =
                                    values.laporan.guru.absen.filter(
                                      (i, itemIndex) => {
                                        return itemIndex !== index;
                                      }
                                    );

                                  setFieldValue("laporan.guru.absen", filtered);
                                }}
                                size="small"
                              />
                            </div>
                          </section>
                        </>
                      ))}

                      {values?.laporan?.guru?.absen.length > 0 && (
                        <section className=" flex items-center w-full">
                          <Button
                            basic
                            fluid

                            type="button"
                            onClick={() => {
                              setFieldValue("laporan.guru.absen", [
                                ...values.laporan.guru.absen,
                                {
                                  nama_guru: "",
                                  nama_kelas: "",
                                  alasan: "",
                                  tugas: null,
                                },
                              ]);
                            }}
                            color="teal"
                            content="Tambah"
                            icon="add"
                            labelPosition="left"
                          />
                        </section>
                      )}
                    </div>
                  )}
                </section>
                <section className="w-full bg">
                  <p className="font-bold text-lg">
                    2. Tindakan terhadap kelas kosong
                  </p>
                  <div className=" w-full">
                    <Form.Field
                      control={TextArea}
                      //   label="Catat"
                      placeholder="Tindakah terhadap kelas kosong"
                      name={`laporan.catatan`}
                      id={`laporan.catatan`}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      value={values?.laporan?.catatan}
                      // error={
                      //   errors.laporan?.catatan && {
                      //     content: `${errors?.laporan?.catatan}`,
                      //     pointing: "above",
                      //     color: "red",
                      //     basic: true,
                      //   }
                      // }
                      fluid
                    />
                  </div>
                </section>

                {errors.laporan !== undefined && (
                  <Message color="red">Silahkan Lengkapi Form sebelum Menyimpan Laporan</Message>
                )}
                <section>
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
                </section>
              </div>
            </Form>
          )}
        </Formik>
      </section>
    </LayoutPage>
  );
}
