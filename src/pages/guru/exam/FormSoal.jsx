import React, { useEffect, useState } from "react";
import { useQuery, useQueryClient } from "react-query";
import { useLocation, useNavigate, useParams } from "react-router-dom";

import {
  durasiOptions,
  jenisOptions,
  tipeUjianOptions,
} from "../../../utils/options";
import {
  Form,
  Select,
  Button,
  Icon,
  Input,
  Message,
  MessageHeader,
  Checkbox,
  TextArea,
} from "semantic-ui-react";

import { toast } from "react-toastify";
import { getOptions } from "../../../utils/format";

import usePage from "../../../hook/usePage";
import useList from "../../../hook/useList";
import { Formik, FormikProvider, useFormik } from "formik";
import * as Yup from "yup";
import {
  listBankSoal,
  createExam,
  updateExam,
} from "../../../api/guru/bank_soal";

import LayoutPage from "../../../module/layoutPage";

import { detailUjian, useCekUrutan } from "../../../api/guru/ujian";
import ModalView from "./ModalView";
import TableSoal from "./TableSoal";
import useDebounce from "../../../hook/useDebounce";

let personalSchema = Yup.object().shape({
  jenis_ujian: Yup.string().nullable().required("wajib disii"),
  mapel_id: Yup.string().nullable().required("wajib disii"),
  kelas_id: Yup.string().nullable().required("wajib disii"),
  waktu_mulai: Yup.string().nullable().required("wajib disii"),
  waktu_selesai: Yup.string().nullable().required("wajib disii"),
  tipe_ujian: Yup.string().nullable().required("wajib disii"),
  durasi: Yup.string().nullable().required("wajib disii"),
  ta_id: Yup.string().nullable().required("wajib disii"),
  soal: Yup.array().min(1, "Minimal pilih satu soal"),
});
let AbsensiSchema = Yup.object().shape({
  payload: Yup.array().of(personalSchema),
});

export default function FormExam() {
  let [open, setOpen] = useState(false);
  let [preview, setPreview] = useState({});
  const { dataMapel, dataKelas, dataTa } = useList();
  let [urutan, setUrutan] = useState(0);
  const { id } = useParams();
  let queryClient = useQueryClient();
  const location = useLocation();
  const navigate = useNavigate();

  let { data: dataExam, isFetching: isLoadingSoal } = useQuery(
    //query key
    ["/bank-soal/update", id],
    //axios function,triggered when page/pageSize change
    () => detailUjian(id),
    //configuration
    {
      // refetchInterval: 1000 * 60 * 60,
      enabled: id !== undefined,
      select: (response) => {
        return response.data.detail_ujian;
      },
      onSuccess: (data) => {
        console.log("dar", data);
        // data.soal = JSON.parse(data.soal);

        setInitialState({
          payload: [
            {
              jenis_ujian: data.jenis_ujian,
              judul_ujian: data.judul_ujian,
              mapel_id: data.mapel_id,
              kelas_id: location?.pathname?.includes("copy")
                ? ""
                : data.kelas_id,
              waktu_mulai: addSevenHours(data.waktu_mulai),
              waktu_selesai: addSevenHours(data.waktu_selesai),
              status: data.status,
              student_access: JSON.parse(data.student_access),
              soal: JSON.parse(data.soal),
              tipe_ujian: data.tipe_ujian,
              durasi: data.durasi,
              ta_id: data.ta_id,
              urutan: data.urutan,
              is_hirarki: data.is_hirarki,
            },
          ],
        });
      },
    }
  );
  let { page, pageSize, setPage, setPageSize } = usePage();
  let [mapel_id, setMapel_id] = useState("");
  let [materi, setMateri] = useState("");
  let debouncedName = useDebounce(materi, 600);

  useEffect(() => {
    if (!!dataExam?.mapel_id === true) {
      setMapel_id(dataExam.mapel_id);
    } else {
      setMapel_id("");
    }
  }, [dataExam?.mapel_id]);

  let params = {
    page,
    pageSize,
    mapel_id,
    materi: debouncedName,
    isExam: true,

    is_all: 0,
  };

  let { data, isLoading } = useQuery(
    //query key
    ["/bank-soal/list", params],
    //axios function,triggered when page/pageSize change
    () => listBankSoal(params),
    //configuration
    {
      // refetchInterval: 1000 * 60 * 60,
      enabled: id ? !!dataExam?.mapel_id === true : true,
      select: (response) => {
        return response.data;
      },
    }
  );

  const [initialState, setInitialState] = useState({
    payload: [
      {
        judul_ujian: "",
        jenis_ujian: "",
        mapel_id: null,
        kelas_id: null,
        waktu_mulai: null,
        waktu_selesai: null,
        status: "draft",
        student_access: [],
        soal: [],
        tipe_ujian: "",
        durasi: null,
        ta_id: null,
        before: "",
        urutan: 1,
        is_hirarki: "",
      },
    ],
  });

  const onSubmit = async (values, { resetForm }) => {
    const soal = values.payload?.[0].soal.map((item) => item.id);

    try {
      let response;
      if (id === undefined) {
        response = await createExam({
          payload: [
            {
              ...values.payload[0],
              soal: soal,
            },
          ],
        });
        resetForm();
        setInitialState({
          payload: [
            {
              jenis_ujian: "",
              mapel_id: null,
              kelas_id: null,
              waktu_mulai: "",
              waktu_selesai: "",
              status: "draft",
              student_access: [],
              soal: [],
              ta_id: null,
              before: "",
              urutan: 1,
              is_hirarki: "",
            },
          ],
        });
      } else {
        if (location?.pathname?.includes("copy")) {
          response = await createExam({
            payload: [
              {
                ...values.payload[0],
                soal: soal,
              },
            ],
          });
          resetForm();
        } else {
          response = await updateExam(id, {
            payload: [
              {
                ...values.payload[0],
                soal: soal,
              },
            ],
          });
        }
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

      queryClient.invalidateQueries("/ujian/list");
    } catch (err) {
      console.log("err", err);
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

  const formik = useFormik({
    initialValues: initialState,
    validationSchema: AbsensiSchema,
    enableReinitialize: true,
    onSubmit: onSubmit,
  });

  const {
    values,
    errors,
    touched,
    handleChange,
    handleBlur,
    handleSubmit,
    setFieldValue,
    isSubmitting,
  } = formik;

  const mutate = useCekUrutan();

  useEffect(() => {
    if (
      !!values.payload[0].mapel_id === true &&
      !!values.payload[0].kelas_id &&
      !!values.payload[0].ta_id
    ) {
      mutate.mutate(values.payload[0], {
        onSuccess: (res) => {
          console.log("res", res);
          setUrutan(res.data.data);
        },
      });
    }
  }, [
    values.payload[0].mapel_id,
    values.payload[0].kelas_id,
    values.payload[0].ta_id,
  ]);

  return (
    <LayoutPage
      isLoading={isLoadingSoal}
      title={id === undefined ? "Form Tambah Ujian" : "Form Update Ujian"}
    >
      {open && <ModalView open={open} setOpen={setOpen} preview={preview} />}
      <div
        style={{
          zoom: "80%",
        }}
        className="p-0 lg:p-2  "
      >
        <FormikProvider value={formik}>
          <Form onSubmit={handleSubmit}>
            {id && values.payload[0].urutan > 1 && (
              <Message
                warning
                header="You must register before you can do that!"
                content="Visit our registration page, then try again."
              />
            )}
            <section>
              {values?.payload?.map((value, index) => (
                <div
                  className="space-y-5 col-span-3  p-5   overflow-auto "
                  key={index}
                >
                  <section className=" grid grid-cols-1 lg:grid-cols-3 gap-5">
                    <div className="col-span-3">
                      <Form.Field
                        control={TextArea}
                        label={{
                          children: "Tujuan Pembalajaran (TP)",
                          htmlFor: `payload[${index}]judul_ujian`,
                          name: `payload[${index}]judul_ujian`,
                        }}
                        placeholder="Judul Ujian"
                        options={jenisOptions}
                        id={`payload[${index}]judul_ujian`}
                        name={`payload[${index}]judul_ujian`}
                        onChange={(e) => {
                          setFieldValue(
                            `payload[${index}]judul_ujian`,
                            e.target.value
                          );
                        }}
                        error={
                          errors?.payload?.[index]?.judul_ujian !== undefined &&
                          errors?.payload?.[index]?.judul_ujian
                        }
                        value={value?.judul_ujian}
                      />
                    </div>
                    <div>
                      <Form.Field
                        control={Select}
                        value={value?.kelas_id}
                        options={getOptions(dataKelas?.data, "nama_kelas")}
                        label={{
                          children: "Kelas",
                          htmlFor: `payload[${index}]kelas_id`,
                          name: `payload[${index}]kelas_id`,
                        }}
                        onChange={(event, data) => {
                          setFieldValue(
                            `payload[${index}]kelas_id`,
                            data?.value
                          );
                        }}
                        error={
                          errors?.payload?.[index]?.kelas_id !== undefined &&
                          errors?.payload?.[index]?.kelas_id
                        }
                        placeholder="Pilih Kelas"
                        search
                        searchInput={{
                          id: `payload[${index}]kelas_id`,
                          name: `payload[${index}]kelas_id`,
                        }}
                      />
                    </div>
                    <div>
                      <Form.Field
                        disabled={values.payload[0].soal.length > 0}
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

                          setMapel_id(data?.value);
                        }}
                        error={
                          errors?.payload?.[index]?.mapel_id !== undefined &&
                          errors?.payload?.[index]?.mapel_id
                        }
                        placeholder="Pilih Mata Pelajaran"
                        search
                        searchInput={{
                          id: `payload[${index}]mapel_id`,
                          name: `payload[${index}]mapel_id`,
                        }}
                      />
                    </div>
                    <div>
                      <Form.Dropdown
                        selection
                        search
                        label={{
                          children: "Jenis Ujian",
                          htmlFor: `payload[${index}]jenis_ujian`,
                          name: `payload[${index}]jenis_ujian`,
                        }}
                        placeholder="Jenis Ujian"
                        options={jenisOptions}
                        id={`payload[${index}]jenis_ujian`}
                        name={`payload[${index}]jenis_ujian`}
                        onChange={(e, data) => {
                          setFieldValue(
                            `payload[${index}]jenis_ujian`,
                            data.value
                          );
                        }}
                        error={
                          errors?.payload?.[index]?.jenis_ujian !== undefined &&
                          errors?.payload?.[index]?.jenis_ujian
                        }
                        value={value?.jenis_ujian}
                      />
                    </div>

                    <div>
                      <Form.Field
                        control={Input}
                        label={{
                          children: "Waktu Mulai",
                          htmlFor: `payload[${index}]waktu_mulai`,
                          name: `payload[${index}]waktu_mulai`,
                        }}
                        placeholder="Jenis Ujian"
                        options={jenisOptions}
                        id={`payload[${index}]waktu_mulai`}
                        name={`payload[${index}]waktu_mulai`}
                        onChange={(e) => {
                          setFieldValue(
                            `payload[${index}]waktu_mulai`,
                            e.target.value
                          );
                        }}
                        error={
                          errors?.payload?.[index]?.waktu_mulai !== undefined &&
                          errors?.payload?.[index]?.waktu_mulai
                        }
                        type="datetime-local"
                        value={value?.waktu_mulai}
                      />
                    </div>
                    <div>
                      <Form.Field
                        control={Input}
                        label={{
                          children: "Waktu Selesai",
                          htmlFor: `payload[${index}]waktu_selesai`,
                          name: `payload[${index}]waktu_selesai`,
                        }}
                        placeholder="Jenis Ujian"
                        options={jenisOptions}
                        id={`payload[${index}]waktu_selesai`}
                        name={`payload[${index}]waktu_selesai`}
                        onChange={(e) => {
                          setFieldValue(
                            `payload[${index}]waktu_selesai`,
                            e.target.value
                          );
                        }}
                        error={
                          errors?.payload?.[index]?.waktu_selesai !==
                            undefined && errors?.payload?.[index]?.waktu_selesai
                        }
                        type="datetime-local"
                        value={value?.waktu_selesai}
                      />
                    </div>

                    <div>
                      <Form.Dropdown
                        selection
                        search
                        label={{
                          children: "Tipe Ujian",
                          htmlFor: `payload[${index}]tipe_ujian`,
                          name: `payload[${index}]tipe_ujian`,
                        }}
                        placeholder="Pilih"
                        options={tipeUjianOptions}
                        id={`payload[${index}]tipe_ujian`}
                        name={`payload[${index}]tipe_ujian`}
                        onChange={(e, data) => {
                          setFieldValue(
                            `payload[${index}]tipe_ujian`,
                            data.value
                          );
                        }}
                        error={
                          errors?.payload?.[index]?.tipe_ujian !== undefined &&
                          errors?.payload?.[index]?.tipe_ujian
                        }
                        value={value?.tipe_ujian}
                      />
                    </div>
                    <div>
                      <Form.Dropdown
                        selection
                        search
                        label={{
                          children: "Durasi",
                          htmlFor: `payload[${index}]durasi`,
                          name: `payload[${index}]durasi`,
                        }}
                        placeholder="Jenis Ujian"
                        options={durasiOptions}
                        id={`payload[${index}]durasi`}
                        name={`payload[${index}]durasi`}
                        onChange={(e, data) => {
                          setFieldValue(`payload[${index}]durasi`, data.value);
                        }}
                        error={
                          errors?.payload?.[index]?.durasi !== undefined &&
                          errors?.payload?.[index]?.durasi
                        }
                        value={value?.durasi}
                      />
                    </div>
                    <div>
                      <Form.Field
                        control={Select}
                        value={value?.ta_id}
                        options={getOptions(dataTa?.data, "nama_tahun_ajaran")}
                        label={{
                          children: "Tahun Pelajaran",
                          htmlFor: `payload[${index}]ta_id`,
                          name: `payload[${index}]ta_id`,
                        }}
                        onChange={(e, data) => {
                          setFieldValue(`payload[${index}]ta_id`, data.value);
                        }}
                        placeholder="Pilih"
                        search
                        error={
                          errors?.payload?.[index]?.ta_id !== undefined &&
                          errors?.payload?.[index]?.ta_id
                        }
                        searchInput={{
                          id: `payload[${index}]ta_id`,
                          name: `payload[${index}]ta_id`,
                        }}
                      />
                    </div>
                  </section>
                  <section className="border shadow-lg p-5 grid grid-cols-2 gap-5">
                    <div>
                      <TableSoal
                        materi={materi}
                        setMateri={setMateri}
                        data={data}
                        value={value}
                        setFieldValue={setFieldValue}
                        isLoading={false}
                        index={index}
                        setPreview={setPreview}
                        setOpen={setOpen}
                        page={page}
                        setPageSize={setPageSize}
                        pageSize={pageSize}
                        setPage={setPage}
                        title={"Daftar Soal Tersedia"}
                      />
                    </div>

                    <div>
                      {" "}
                      <TableSoal
                        data={{
                          data: {
                            rows: values.payload[0].soal,
                          },
                        }}
                        value={value}
                        setFieldValue={setFieldValue}
                        isLoading={isLoading}
                        index={index}
                        setPreview={setPreview}
                        setOpen={setOpen}
                        page={page}
                        setPageSize={setPageSize}
                        pageSize={pageSize}
                        setPage={setPage}
                        isSoal
                        title={"Daftar Soal Dipilih"}
                      />
                    </div>

                    {!!errors?.payload?.[index]?.soal === true && (
                      <div className="col-span-2">
                        <Message negative>
                          <MessageHeader>
                            {errors?.payload?.[index]?.soal}
                          </MessageHeader>
                        </Message>
                      </div>
                    )}
                  </section>
                </div>
              ))}
            </section>

            <div className="mt-5">
              {id ? (
                location?.pathname?.includes("copy") ? (
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
                ) : (
                  <Button
                    content={isSubmitting ? "Memperbaharui" : "Perbaharui"}
                    type="submit"
                    fluid
                    icon={() => <Icon name="save" />}
                    loading={isSubmitting}
                    size="medium"
                    color="teal"
                    disabled={isSubmitting}
                  />
                )
              ) : (
                <>
                  {urutan > 0 && (
                    <section className="mb-5 border rounded-lg shadow-lg p-5">
                      <h4>
                        Mata Pelajaran ini memiliki memiliki {urutan} ujian
                        sebelumnya, apakah anda ingin membuat ujian ini tidak
                        bisa dikerjakan jika {urutan} ujian sebelumnya belum
                        lulus ?
                      </h4>

                      <div>
                        <Form.Dropdown
                          selection
                          search
                          placeholder="Pilih"
                          options={[
                            {
                              key: 1,
                              value: 1,
                              text: "Ya",
                            },
                            {
                              key: 2,
                              value: 2,
                              text: "Tidak",
                            },
                          ]}
                          id={`payload[${0}]before`}
                          name={`payload[${0}]before`}
                          onChange={(e, data) => {
                            setFieldValue(`payload[${0}]before`, data.value);

                            if (data.value === 1) {
                              setFieldValue(`payload[${0}]urutan`, urutan + 1);
                              setFieldValue(`payload[${0}]is_hirarki`, 1);
                            } else {
                              setFieldValue(`payload[${0}]is_hirarki`, 0);
                            }
                          }}
                          error={
                            errors?.payload?.[0]?.before !== undefined &&
                            errors?.payload?.[0]?.before
                          }
                          value={values?.payload[0].before}
                        />
                      </div>
                    </section>
                  )}

                  {(values?.payload[0].before === 2 ||
                    !!values?.payload[0].before === false) &&
                    urutan < 1 && (
                      <section className="mb-5 border rounded-lg shadow-lg p-5">
                        <h4>
                          Apakah anda akan menjadikan ini adalah exam
                          bertingkat?
                        </h4>

                        <div>
                          <Form.Dropdown
                            selection
                            search
                            placeholder="Pilih"
                            options={[
                              {
                                key: 1,
                                value: 1,
                                text: "Ya",
                              },
                              {
                                key: 2,
                                value: 0,
                                text: "Tidak",
                              },
                            ]}
                            id={`payload[${0}]is_hirarki`}
                            name={`payload[${0}]is_hirarki`}
                            onChange={(e, data) => {
                              setFieldValue(
                                `payload[${0}]is_hirarki`,
                                data.value
                              );
                            }}
                            error={
                              errors?.payload?.[0]?.is_hirarki !== undefined &&
                              errors?.payload?.[0]?.is_hirarki
                            }
                            value={values?.payload[0].is_hirarki}
                          />
                        </div>
                      </section>
                    )}
                  <Button
                    content={isSubmitting ? "Menyimpan" : "Simpan"}
                    type="submit"
                    fluid
                    icon={() => <Icon name="save" />}
                    loading={isSubmitting}
                    size="medium"
                    color="teal"
                    disabled={
                      isSubmitting ||
                      (urutan > 1 && !!values?.payload[0].before === false) ||
                      values?.payload[0].is_hirarki === ""
                    }
                  />
                </>
              )}
            </div>
          </Form>
        </FormikProvider>
      </div>
    </LayoutPage>
  );
}

const addSevenHours = (isoString) => {
  const date = new Date(isoString);
  date.setHours(date.getHours() + 7);

  // Format the date to 'YYYY-MM-DDTHH:MM'
  const formattedDate = date.toISOString().slice(0, 16);
  return formattedDate;
};
