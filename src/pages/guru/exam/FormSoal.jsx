import { listSiswaOptions } from "../../../api/list";
import React, { useState } from "react";
import { useQuery } from "react-query";
import { useParams } from "react-router-dom";

import { DndProvider } from "react-dnd";
import Backend from "react-dnd-html5-backend";
import {
  jenisOptions,
 
  statusUjianOptions,
  
} from "../../../utils/options";
import {

  Segment,
  Form,
  Select,
  Button,
  Header,
  Divider,
 
  Icon,
  Table,
  Checkbox,
} from "semantic-ui-react";
import { DeleteButton, AddButton } from "../../../components";

import { toast } from "react-toastify";
import { getOptions } from "../../../utils/format";

import usePage from "../../../hook/usePage";
import useList from "../../../hook/useList";
import { Formik } from "formik";
import * as Yup from "yup";
import {
  createBankSoal,
  updateBankSoal,
  detailBankSoal,
  listBankSoal,
} from "../../../api/guru/bank_soal";

import { useNavigate } from "react-router-dom";
import LayoutPage from "../../../module/layoutPage";

import { TableLoading } from "../../../components";
import useDelete from "../../../hook/useDelete";
import {
  // eslint-disable-next-line no-unused-vars
  ModalFilter,
  EditButton,

  // eslint-disable-next-line no-unused-vars
  ViewButton,
  ModalAlert,
} from "../../../components";

import { PaginationTable } from "../../../components";
import { deleteBankSoal } from "../../../api/guru/bank_soal";
import { useQueryClient } from "react-query";

export default function FormExam() {
  const { dataMapel, dataKelas } = useList();
  const { id } = useParams();
  let { isLoading: isLoadingUpdate } = useQuery(
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
  let { page, pageSize, setPage, setPageSize } = usePage();

  let params = {
    page,
    pageSize,

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
        status: "open",
        student_access: [],
        soal: [],
      },
    ],
  });

  const onSubmit = async (values, { resetForm }) => {

    console.log('pay', values)
    try {
      let response;
      if (id === undefined) {
        response = await createBankSoal(values);
        resetForm();
        setInitialState({
          payload: [
            {
              jenis_ujian: "",
              mapel_id: null,
              kelas_id: null,
              waktu_mulai: null,
              waktu_selesai: null,
              status: "open",
              student_access: [],
              soal: [],
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
          {id === undefined ? "Form Tambah Ujian" : "Form Update Ujian"}
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
              {JSON.stringify(values)}
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
                  <section className=" grid grid-cols-4 gap-5">
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
                      <Form.Dropdown
                        selection
                        search
                        label={{
                          children: "Status",
                          htmlFor: `payload[${index}]status`,
                          name: `payload[${index}]status`,
                        }}
                        placeholder="Status"
                        options={statusUjianOptions}
                        id={`payload[${index}]status`}
                        name={`payload[${index}]status`}
                        onChange={(e, data) => {
                          setFieldValue(`payload[${index}]status`, data.value);
                        }}
                        error={
                          errors?.payload?.[index]?.status !== undefined &&
                          errors?.payload?.[index]?.status
                        }
                        value={value?.status}
                      />
                    </div>
                  </section>
                  <section className="grid grid-cols-1 gap-5">
                    <div>
                      <h1>List Soal</h1>
                      <Table celled selectable>
                        <Table.Header>
                          <Table.Row>
                            <Table.HeaderCell>
                              <Checkbox />
                            </Table.HeaderCell>
                            <Table.HeaderCell>No</Table.HeaderCell>

                            <Table.HeaderCell>Mata Pelajaran</Table.HeaderCell>
                            <Table.HeaderCell>Bab</Table.HeaderCell>
                            <Table.HeaderCell>Tipe</Table.HeaderCell>
                            <Table.HeaderCell>Point</Table.HeaderCell>
                            <Table.HeaderCell>View</Table.HeaderCell>
                          </Table.Row>
                        </Table.Header>
                        <Table.Body>
                          <TableLoading
                            count={8}
                            isLoading={isLoading}
                            data={data?.data}
                            messageEmpty={"Data Tidak Ditemukan"}
                          >
                            {data?.data?.rows?.map((item, index2) => (
                              <Table.Row key={index2}>
                                <Table.Cell>
                                  <Checkbox onChange={()=> {
                                    let soal = [...value?.soal]
                                    soal.push(item?.id)
                                    
                                    setFieldValue(`payload[${index}]soal`, soal);
                                  }} />
                                </Table.Cell>
                                <Table.Cell>{index2 + 1}</Table.Cell>

                                <Table.Cell>
                                  {item?.mapel?.nama_mapel}
                                </Table.Cell>
                                <Table.Cell>{item?.materi}</Table.Cell>
                                <Table.Cell>{item?.tipe}</Table.Cell>
                                <Table.Cell>{item?.point}</Table.Cell>

                                <Table.Cell>
                                  <ViewButton
                                    onClick={() => {
                                      console.log("jalan");
                                    }}
                                  />
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
