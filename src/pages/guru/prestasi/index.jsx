import React from "react";
import { Formik } from "formik";
import * as Yup from "yup";
import LayoutPage from "../../../module/layoutPage";
import {
  Table,
  Dropdown,
  Input,
  
  Menu,
  Icon,
  Button,
} from "semantic-ui-react";
import { useQuery } from "react-query";
import useDelete from "../../../hook/useDelete";
import {
  createPrestasi,
  updatePrestasi,
  deletePelanggaran,
  listPrestasi,
} from "../../../api/guru/pelanggaran";
import {
  TableLoading,
  // eslint-disable-next-line no-unused-vars
  ModalFilter,
  EditButton,
  DeleteButton,
  // eslint-disable-next-line no-unused-vars
  ViewButton,
  ModalAlert,
} from "../../../components";
import FormPrestasi from "./FormPrestasi";
import { handleViewNull, formatDate } from "../../../utils";
import { useQueryClient } from "react-query";
import useDebounce from "../../../hook/useDebounce";
import { pageSizeOptions } from "../../../utils/options";
import { Collapse } from "react-collapse";

import { toast } from "react-toastify";

let prestasiSchema = Yup.object().shape({
  tanggal: Yup.string().required("wajib diisi"),
  student_id: Yup.string().required("wajib pilih"),
  semester: Yup.string().required("wajib diisi"),
  kategori: Yup.string().required("wajib diisi"),
  prestasi: Yup.string().required("wajib diisi"),
  ta_id: Yup.string().required("wajib diisi"),
});

let prestasiArraySchema = Yup.object().shape({
  prestasi: Yup.array().of(prestasiSchema),
});
export default function Prestasi() {
  let [page] = React.useState(1);
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
    prestasi: [
      {
        tanggal: "",
        student_id: "",
        kategori: "",
        prestasi: "",
        semester: "",
        ta_id: "",
        nama_siswa: null,
      },
    ],
  };

  let parameter = {
    page: page,
    pageSize: pageSize,
    nama_siswa: debouncedName,
  };

  let { data, isLoading } = useQuery(
    //query key
    ["list_prestasi", parameter],
    //axios function,triggered when page/pageSize change
    () => listPrestasi(parameter),
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
        response = await updatePrestasi(values);
      } else {
        response = await createPrestasi(values);
      }
      console.log(response);
      queryClient.invalidateQueries("list_prestasi");
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
      console.log(err.response.status);

      if (err.response.status === 422) {
        return toast.warning(err.response.data.msg, {
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
    <LayoutPage title={"Prestasi"}>
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
        validationSchema={prestasiArraySchema}
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
              {console.log('errr',errors,)}
              {console.log('errr touch',touched,)}
              <FormPrestasi
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
            <section>
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
                        icon={()=> <Icon name='add'/>}
                        onClick={() => {
                          setIsOpen(true);
                          setMode("add");
                          return window.scrollTo(0, 0);
                        }}
                        content="Buat Catatan Prestasi"
                      />
                    </div>
                  </div>
                  <Table celled selectable>
                    <Table.Header>
                      <Table.Row>
                        <Table.HeaderCell >
                          No
                        </Table.HeaderCell>
                        <Table.HeaderCell>Nama Siswa</Table.HeaderCell>
                        <Table.HeaderCell>Tanggal</Table.HeaderCell>

                        <Table.HeaderCell>Kategori</Table.HeaderCell>
                        <Table.HeaderCell>Prestasi</Table.HeaderCell>
                        <Table.HeaderCell>Nama Guru</Table.HeaderCell>
                        <Table.HeaderCell>Semester</Table.HeaderCell>
                        <Table.HeaderCell>Tahun Ajaran</Table.HeaderCell>

                        <Table.HeaderCell singleLine>Aksi</Table.HeaderCell>
                      </Table.Row>
                    </Table.Header>
                    <Table.Body>
                      <TableLoading
                        count={10}
                        isLoading={isLoading}
                        data={data?.data?.rows}
                        messageEmpty={"Tidak Ada Catatan Prestasi"}
                      >
                        {data?.data?.rows?.map((value, index) => (
                          <Table.Row key={index}>
                            <Table.Cell >
                              {index + 1}
                            </Table.Cell>
                            <Table.Cell>
                              <span className="capitalize">
                                {handleViewNull(value?.siswa?.nama_siswa)}
                              </span>
                            </Table.Cell>
                            <Table.Cell>
                              {formatDate(value?.tanggal)}
                            </Table.Cell>

                            <Table.Cell textAlign="left">
                              {handleViewNull(value?.kategori)}
                            </Table.Cell>
                            <Table.Cell textAlign="left">
                              <span className="capitalize">
                                {" "}
                                {handleViewNull(value?.prestasi)}
                              </span>
                            </Table.Cell>
                            <Table.Cell textAlign="left">
                              <span className="capitalize">
                                {" "}
                                {handleViewNull(value?.guru?.nama_guru)}
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
                                      prestasi: [
                                        {
                                          id: value?.id,
                                          tanggal: value?.tanggal,
                                          student_id: value?.student_id,
                                          kategori: value?.kategori,
                                          prestasi: value?.prestasi,
                                          semester: value?.semester,
                                          ta_id: value?.ta_id,
                                          teacher_id: value?.teacher_id,
                                          nama_siswa: {
                                            label: value?.siswa?.nama_siswa,
                                            value: value?.siswa?.id,
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
