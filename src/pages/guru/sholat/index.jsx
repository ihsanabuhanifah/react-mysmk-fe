import React from "react";
import { Formik } from "formik";
import * as Yup from "yup";
import LayoutPage from "../../../module/layoutPage";
import {
  Table,
  Dropdown,
  Input,
  Segment,
  Menu,
  Icon,
  Button,
} from "semantic-ui-react";
import { useQuery } from "react-query";
import FormPelanggaran from "./FormSholat";
import useDelete from "../../../hook/useDelete";

import {
  listSholat,
  createSholat,
  updateAbensiSholat,
  deleteAbsensiSholat,
} from "../../../api/guru/shiolat";
import {
  TableLoading,
  ModalFilter,
  EditButton,
  DeleteButton,
  ViewButton,
  ModalAlert,
} from "../../../components";
import {
  formatAlasanTidakShoalt,
  formatWaktuSholat,
} from "../../../utils/format";
import FormSholat from "./FormSholat";
import { handleViewNull, formatDate } from "../../../utils";
import { useQueryClient } from "react-query";
import useDebounce from "../../../hook/useDebounce";
import { pageSizeOptions } from "../../../utils/options";
import { Collapse } from "react-collapse";

import { toast } from "react-toastify";

let sholatSchema = Yup.object().shape({
  tanggal: Yup.string().required("wajib diisi"),
  student_id: Yup.string().required("wajib pilih"),
  waktu: Yup.string().required("wajib diisi"),
  keterangan: Yup.string().required("wajib diisi"),
  // alasan: Yup.string().required("wajib diisi"),
});

let sholatArraySchema = Yup.object().shape({
  sholat: Yup.array().of(sholatSchema),
});
export default function Sholat() {
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
    afterDeleted: () => queryClient.invalidateQueries("list_sholat"),
    onDelete: (id) => {
      return deleteAbsensiSholat(id);
    },
  });
  const initialValue = {
    sholat: [
      {
        tanggal: "",
        student_id: "",
        waktu: "",
        keterangan: "",
        alasan: "",
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
    ["list_sholat", parameter],
    //axios function,triggered when page/pageSize change
    () => listSholat(parameter),
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
        response = await updateAbensiSholat(values);
      } else {
        response = await createSholat(values);
      }
      console.log(response);
      queryClient.invalidateQueries("list_sholat");
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
    <LayoutPage title={"Catatan Pelanggaran Sholat"}>
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
        validationSchema={sholatArraySchema}
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
              <FormSholat
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
                        icon={()=> <Icon name='add'/>}
                        onClick={() => {
                          setIsOpen(true);
                          setMode("add");
                          return window.scrollTo(0, 0);
                        }}
                        content="Buat Catatan Sholat"
                      />
                    </div>
                  </div>
                  <Table celled selectable>
                    <Table.Header>
                      <Table.Row>
                        <Table.HeaderCell>
                          No
                        </Table.HeaderCell>
                        <Table.HeaderCell>Nama Siswa</Table.HeaderCell>
                        <Table.HeaderCell>Tanggal</Table.HeaderCell>

                        <Table.HeaderCell>Waktu</Table.HeaderCell>
                        <Table.HeaderCell>Jenis Pelanggaran</Table.HeaderCell>
                        <Table.HeaderCell>Alasan</Table.HeaderCell>
                        <Table.HeaderCell>Nama Guru</Table.HeaderCell>

                        <Table.HeaderCell singleLine>Aksi</Table.HeaderCell>
                      </Table.Row>
                    </Table.Header>
                    <Table.Body>
                      <TableLoading
                        count={10}
                        isLoading={isLoading}
                        data={data?.data?.rows}
                        messageEmpty={"Tidak Ada Catatan Pelanggaran Sholat"}
                      >
                        {data?.data?.rows?.map((value, index) => (
                          <Table.Row key={index}>
                            <Table.Cell>
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
                              {formatWaktuSholat(value?.waktu)}
                            </Table.Cell>
                            <Table.Cell textAlign="left">
                              <span className="capitalize">
                                {" "}
                                {formatAlasanTidakShoalt(value?.keterangan)}
                              </span>
                            </Table.Cell>
                            <Table.Cell textAlign="left">
                              {handleViewNull(value?.alasan)}
                            </Table.Cell>
                            <Table.Cell textAlign="left">
                              <span className="capitalize">
                                {" "}
                                {handleViewNull(value?.guru?.nama_guru)}
                              </span>
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
                                      sholat: [
                                        {
                                          id: value?.id,
                                          tanggal: value?.tanggal,
                                          student_id: value?.student_id,
                                          waktu: value?.waktu,
                                          keterangan: value?.keterangan,
                                          alasan: value?.alasan,
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
