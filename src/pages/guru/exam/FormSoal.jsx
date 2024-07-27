import React, { useState } from "react";
import { useQuery } from "react-query";
import { useParams } from "react-router-dom";

import {
  durasiOptions,
  jenisOptions,
  tipeUjianOptions,
} from "../../../utils/options";
import { Form, Select, Button, Icon, Table, Checkbox } from "semantic-ui-react";

import { toast } from "react-toastify";
import { getOptions } from "../../../utils/format";

import usePage from "../../../hook/usePage";
import useList from "../../../hook/useList";
import { Formik } from "formik";
import * as Yup from "yup";
import {
  listBankSoal,
  createExam,
  updateExam,
} from "../../../api/guru/bank_soal";

import LayoutPage from "../../../module/layoutPage";

import { Input, TableLoading, ViewButton } from "../../../components";

import { PaginationTable } from "../../../components";
import { detailUjian, updateUjian } from "../../../api/guru/ujian";
import ModalView from "./ModalView";

export default function FormExam() {
  let [open, setOpen] = useState(false);
  let [preview, setPreview] = useState({});
  const { dataMapel, dataKelas } = useList();
  const { id } = useParams();
  let { isLoading: isLoadingUpdate } = useQuery(
    //query key
    ["/bank-soal/update"],
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
              mapel_id: data.mapel_id,
              kelas_id: data.kelas_id,
              waktu_mulai: addSevenHours(data.waktu_mulai),
              waktu_selesai: addSevenHours(data.waktu_selesai),
              status: data.status,
              student_access: JSON.parse(data.student_access),
              soal: JSON.parse(data.soal),
              tipe_ujian: data.tipe_ujian,
              durasi: data.durasi,
            },
          ],
        });
      },
    }
  );
  let { page, pageSize, setPage, setPageSize } = usePage();
  let [mapel_id, setMapel_id] = useState("");
  let params = {
    page,
    pageSize,
    mapel_id,

    is_all: 1,
  };
  let { data, isLoading } = useQuery(
    //query key
    ["/bank-soal/list", params],
    //axios function,triggered when page/pageSize change
    () => listBankSoal(params),
    //configuration
    {
      // refetchInterval: 1000 * 60 * 60,
      select: (response) => {
        return response.data;
      },
    }
  );

  const [initialState, setInitialState] = useState({
    payload: [
      {
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
      },
    ],
  });

  const onSubmit = async (values, { resetForm }) => {
    console.log("pay", values);

    try {
      let response;
      if (id === undefined) {
        response = await createExam(values);
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
            },
          ],
        });
      } else {
        response = await updateExam(id, values);
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
      title={id === undefined ? "Form Tambah Ujian" : "Form Update Ujian"}
    >
      {open && <ModalView open={open} setOpen={setOpen} preview={preview} />}
      <div className="p-0 lg:p-5  ">
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
                  <section className=" grid grid-cols-3 gap-5">
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
                  </section>
                  <section className="grid grid-cols-1 gap-5">
                    <div>
                      <h1>Daftar Soal</h1>
                      <Table celled selectable>
                        <Table.Header>
                          <Table.Row>
                            <Table.HeaderCell></Table.HeaderCell>
                            <Table.HeaderCell>No</Table.HeaderCell>
                            <Table.HeaderCell>Mata Pelajaran</Table.HeaderCell>
                            <Table.HeaderCell>Guru Pembuat</Table.HeaderCell>
                            <Table.HeaderCell>Materi</Table.HeaderCell>
                            <Table.HeaderCell>Tipe Soal</Table.HeaderCell>
                            <Table.HeaderCell>Point</Table.HeaderCell>
                            <Table.HeaderCell>View</Table.HeaderCell>
                          </Table.Row>
                        </Table.Header>
                        <Table.Body>
                          <TableLoading
                            count={8}
                            isLoading={isLoading}
                            data={data?.data?.rows}
                            messageEmpty={"Daftar Soal Tidak Ditemukan"}
                          >
                            {data?.data?.rows?.map((item, index2) => (
                              <Table.Row key={index2}>
                                <Table.Cell>
                                  <Checkbox
                                    checked={value.soal.some(
                                      (item2) => item2.id === item.id
                                    )}
                                    onChange={(e) => {
                                      console.log(
                                        "e",
                                        value.soal.some(
                                          (item2) => item2.id === item.id
                                        )
                                      );

                                      if (
                                        value.soal.some(
                                          (item2) => item2.id === item.id
                                        )
                                      ) {
                                        let filtered = value.soal.filter(
                                          (item3) => item3.id !== item.id
                                        );

                                        return setFieldValue(
                                          `payload[${index}]soal`,
                                          filtered
                                        );
                                      }

                                      let soal = [...value?.soal];
                                      soal.push({
                                        id: item.id,
                                        jawaban: item.jawaban,
                                        materi: item.materi,
                                        point: item.point,
                                        soal: item.soal,
                                        tipe: item.tipe,
                                      });

                                      setFieldValue(
                                        `payload[${index}]soal`,
                                        soal
                                      );
                                    }}
                                  />
                                </Table.Cell>
                                <Table.Cell>{index2 + 1}</Table.Cell>
                                <Table.Cell>
                                  {item?.mapel?.nama_mapel}
                                </Table.Cell>
                                <Table.Cell>
                                  {item?.teacher?.nama_guru}
                                </Table.Cell>
                                <Table.Cell>{item?.materi}</Table.Cell>
                                <Table.Cell>{item?.tipe}</Table.Cell>
                                <Table.Cell>{item?.point}</Table.Cell>

                                <Table.Cell>
                                  <span className="flex items-center justify-center">
                                    {" "}
                                    <ViewButton
                                      type="button"
                                      color="teal"
                                      size="md"
                                      icon={() => <Icon name="laptop" />}
                                      onClick={() => {
                                        setPreview(item);
                                        setOpen(true);
                                      }}
                                    />
                                  </span>
                                </Table.Cell>
                              </Table.Row>
                            ))}
                          </TableLoading>
                        </Table.Body>
                      </Table>
                      <PaginationTable
                        page={page}
                        pageSize={pageSize}
                        setPageSize={setPageSize}
                        setPage={setPage}
                        totalPages={data?.data?.count}
                      />
                    </div>
                  </section>
                </div>
              ))}

              <div className="mt-5">
                {id ? (
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
                ) : (
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
                )}
              </div>
            </Form>
          )}
        </Formik>
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
