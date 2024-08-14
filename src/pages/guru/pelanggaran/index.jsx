import React from "react";
import { Formik } from "formik";
import * as Yup from "yup";
import LayoutPage from "../../../module/layoutPage";
import { Table, Dropdown, Input, Menu, Icon, Button } from "semantic-ui-react";
import { useQuery } from "react-query";
import FormPelanggaran from "./FormPelanggaran";
import useDelete from "../../../hook/useDelete";
import {
  listPelanggaran,
  createPelanggaran,
  updatePelanggaran,
  deletePelanggaran,
} from "../../../api/guru/pelanggaran";
import {
  TableLoading,
  EditButton,
  DeleteButton,
  ModalAlert,
} from "../../../components";
import { handleViewNull, showFormattedDate } from "../../../utils";
import { useQueryClient } from "react-query";
import useDebounce from "../../../hook/useDebounce";
import { pageSizeOptions } from "../../../utils/options";
import { Collapse } from "react-collapse";

import { toast } from "react-toastify";

let pelanggaranSchema = Yup.object().shape({
  tanggal: Yup.string().required("wajib diisi"),
  student_id: Yup.string().required("wajib pilih"),
  pelanggaran_id: Yup.string().required("wajib diisi"),
  semester: Yup.string().required("wajib diisi"),
  ta_id: Yup.string().required("wajib diisi"),
});

let pelanggaranArraySchema = Yup.object().shape({
  pelanggaran: Yup.array().of(pelanggaranSchema),
});
export default function Pelanggaran() {
  let [page, setPage] = React.useState(1);
  let [pageSize, setPageSize] = React.useState(10);
  let [nama, setNama] = React.useState("");
  let debouncedName = useDebounce(nama, 600);
  let queryClient = useQueryClient();
  let [mode, setMode] = React.useState("add");
  let [isOpen, setIsOpen] = React.useState(false);
  let {
    showAlertDelete,
    setShowAlertDelete,
    deleteLoading,
    confirmDelete,
    onConfirmDelete,
  } = useDelete({
    afterDeleted: () => queryClient.invalidateQueries("list_pelanggaran"),
    onDelete: (id) => {
      return deletePelanggaran(id);
    },
  });
  const initialValue = {
    pelanggaran: [
      {
        tanggal: "",
        student_id: "",
        pelapor: "",
        pelanggaran_id: "",
        status: "",
        tindakan: "",
        penindak: null,
        semester: "",
        ta_id: "",
        tahun_ajaran: null,
        nama_siswa: null,

        tahun_ajaran: null,
        tipe: "",
        kategori: "",
        point: "",
        nama_pelanggaran: null,
      },
    ],
  };

  let parameter = {
    page: page,
    pageSize: pageSize,
    nama_siswa: debouncedName,
  };

  let { data, isLoading, isFetching } = useQuery(
    //query key
    ["list_pelanggaran", parameter],
    //axios function,triggered when page/pageSize change
    () => listPelanggaran(parameter),
    //configuration
    {
      refetchInterval: 1000 * 60 * 60,
      select: (response) => {
        return response.data;
      },
    }
  );

  const onSubmit = async (values, { resetForm }) => {
    try {
      let response;
      if (mode === "update") {
        response = await updatePelanggaran(values);
      } else {
        response = await createPelanggaran(values);
      }
      console.log(response);
      queryClient.invalidateQueries("list_pelanggaran");
      resetForm();
      setIsOpen(false);
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
      console.log(err);
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
    <LayoutPage title={"Pelanggaran"}>
      <ModalAlert
        open={showAlertDelete}
        setOpen={setShowAlertDelete}
        loading={deleteLoading}
        onConfirm={onConfirmDelete}
        title={"Apakah yakin akan menghapus pelanggaran terpilih ?"}
      />
      <Formik
        initialValues={initialValue}
        enableReinitialize
        validationSchema={pelanggaranArraySchema}
        onSubmit={onSubmit}
      >
        {({
          values,
          setValues,
          errors,
          touched,
          handleChange,
          handleBlur,
          handleSubmit,
          isSubmitting,
          setFieldTouched,
          setFieldValue,
          resetForm,
        }) => (
          <>
            <Collapse
              theme={{ collapse: "foo", content: "bar" }}
              isOpened={isOpen}
            >
              <FormPelanggaran
                data={data?.data?.rows}
                values={values}
                setValues={setValues}
                errors={errors}
                touched={touched}
                handleChange={handleChange}
                handleBlur={handleBlur}
                handleSubmit={handleSubmit}
                isSubmitting={isSubmitting}
                setFieldTouched={setFieldTouched}
                setFieldValue={setFieldValue}
                resetForm={resetForm}
                mode={mode}
                setIsOpen={setIsOpen}
              />
            </Collapse>
            <section className="mt-5">
              <div className="overflow-auto">
                <div className="">
                  <div className="grid grid-cols-1 lg:grid-cols-7 gap-5">
                    <div className=" grid-cols-1 lg:col-span-3">
                      <Input
                        onChange={(e) => {
                          setNama(e.target.value);
                        }}
                        fluid
                        value={nama}
                        icon="search"
                        placeholder="Nama Siswa..."
                      />
                    </div>
                    <div className="col-span-1 lg:col-span-2">
                      <Button
                        type="button"
                        color="teal"
                        icon={() => <Icon name='add' />}
                        onClick={() => {
                          setIsOpen(true);
                          setMode("add");
                          return window.scrollTo(0, 0);
                        }}
                        content="Buat Laporan"
                      />
                    </div>
                  </div>
                  <Table celled selectable>
                    <Table.Header>
                      <Table.Row>
                        <Table.HeaderCell>No</Table.HeaderCell>
                        <Table.HeaderCell>Nama Siswa</Table.HeaderCell>
                        <Table.HeaderCell>Tanggal</Table.HeaderCell>

                        <Table.HeaderCell>Nama Pelanggaran</Table.HeaderCell>
                        <Table.HeaderCell>Tipe Pelanggaran</Table.HeaderCell>
                        <Table.HeaderCell>Jenis Pelanggaran</Table.HeaderCell>
                        <Table.HeaderCell>Status</Table.HeaderCell>
                        <Table.HeaderCell content>
                          Tindakan/Hukuman
                        </Table.HeaderCell>
                        <Table.HeaderCell>Guru Pelapor</Table.HeaderCell>
                        <Table.HeaderCell>Guru Penindak</Table.HeaderCell>
                        <Table.HeaderCell>Semester</Table.HeaderCell>
                        <Table.HeaderCell singleLine>
                          Tahun Ajaran
                        </Table.HeaderCell>
                        <Table.HeaderCell singleLine>Aksi</Table.HeaderCell>
                      </Table.Row>
                    </Table.Header>
                    <Table.Body>
                      <TableLoading
                        count={13}
                        isLoading={isLoading}
                        data={data?.data?.rows}
                        messageEmpty={"Tidak Ada Catatan Pelanggaran"}
                      >
                        {data?.data?.rows?.map((value, index) => (
                          <Table.Row key={index}>
                            <Table.Cell>{index + 1}</Table.Cell>
                            <Table.Cell>
                              <span className="capitalize">
                                {handleViewNull(value?.siswa?.nama_siswa)}
                              </span>
                            </Table.Cell>
                            <Table.Cell>
                              {showFormattedDate(value?.tanggal)}
                            </Table.Cell>

                            <Table.Cell textAlign="left">
                              {handleViewNull(
                                value?.pelanggaran?.nama_pelanggaran
                              )}
                            </Table.Cell>
                            <Table.Cell textAlign="left">
                              <span className="capitalize">
                                {" "}
                                {handleViewNull(value?.pelanggaran?.tipe)}
                              </span>
                            </Table.Cell>
                            <Table.Cell textAlign="left">
                              <span className="capitalize">
                                {" "}
                                {handleViewNull(value?.pelanggaran?.kategori)}
                              </span>
                            </Table.Cell>
                            <Table.Cell textAlign="left">
                              {handleViewNull(value?.status)}
                            </Table.Cell>
                            <Table.Cell textAlign="left">
                              {handleViewNull(value?.tindakan)}
                            </Table.Cell>
                            <Table.Cell textAlign="left">
                              <span className="capitalize">
                                {" "}
                                {handleViewNull(value?.pelaporan?.nama_guru)}
                              </span>
                            </Table.Cell>
                            <Table.Cell textAlign="left">
                              <span className="capitalize">
                                {" "}
                                {handleViewNull(value?.penindakan?.nama_guru)}
                              </span>
                            </Table.Cell>
                            <Table.Cell textAlign="left">
                              {handleViewNull(value?.semester)}
                            </Table.Cell>
                            <Table.Cell textAlign="left">
                              {handleViewNull(
                                value?.tahun_ajaran?.nama_tahun_ajaran
                              )}
                            </Table.Cell>
                            <Table.Cell textAlign="left">
                              <div className="flex items-center">
                                {" "}
                                <EditButton
                                  onClick={() => {
                                    setMode("update");
                                    setIsOpen(true);
                                    window.scrollTo(0, 0);
                                    setValues({
                                      pelanggaran: [
                                        {
                                          id: value?.id,
                                          tanggal: value?.tanggal,
                                          student_id: value?.siswa?.id,
                                          pelapor: value?.pelaporan?.id,
                                          pelanggaran_id:
                                            value?.pelanggaran?.id,
                                          status: value?.status,
                                          tindakan: value?.tindakan,
                                          penindak: value?.penindakan,
                                          semester: value?.semester,
                                          ta_id: value?.tahun_ajaran?.id,
                                          tahun_ajaran: value?.tahun_ajaran?.id,
                                          nama_siswa: {
                                            value: value?.siswa?.id,
                                            label: value?.siswa?.nama_siswa,
                                          },
                                          tahun_ajaran: null,
                                          tipe: value?.pelanggaran?.tipe,
                                          kategori:
                                            value?.pelanggaran?.kategori,
                                          point: value?.pelanggaran?.point,
                                          nama_pelanggaran: {
                                            value: value?.pelanggaran?.id,
                                            label:
                                              value?.pelanggaran
                                                ?.nama_pelanggaran,
                                          },
                                        },
                                      ],
                                    });
                                  }}
                                />
                                <DeleteButton
                                  onClick={() => confirmDelete(value?.id)}
                                />
                              </div>
                            </Table.Cell>
                          </Table.Row>
                        ))}
                      </TableLoading>
                    </Table.Body>

                  </Table>
                </div>
              </div>
            </section>
          </>
        )}
      </Formik>
    </LayoutPage>
    
  );
}

