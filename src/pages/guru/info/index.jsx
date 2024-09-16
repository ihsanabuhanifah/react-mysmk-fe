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
// import FormPelanggaran from "./FormSholat";
import useDelete from "../../../hook/useDelete";
import htmr from "htmr";
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
import FormNotice from "./FormNotice";
import { handleViewNull, formatDate } from "../../../utils";
import { useQueryClient } from "react-query";
import useDebounce from "../../../hook/useDebounce";
import { pageSizeOptions } from "../../../utils/options";
import { Collapse } from "react-collapse";

import { toast } from "react-toastify";
import { DownloadButton } from "../../../components/buttonAksi/editButton";
import { deleteNotice, listNotice } from "../../../api/guru/notice";
import { useNavigate } from "react-router-dom";

let noticeSchema = Yup.object().shape({
  pengumuman: Yup.string().required("wajib diisi"),
  judul_notice: Yup.string().required("wajib pilih"),
  isi_notice: Yup.string().required("wajib diisi"),
});

export default function Info() {
  let [page, setPage] = React.useState(1);
  let [pageSize, setPageSize] = React.useState(10);
  let [nama, setNama] = React.useState("");
  let debouncedName = useDebounce(nama, 600);
  let queryClient = useQueryClient();
  let [mode, setMode] = React.useState("add");
  let [isOpen, setIsOpen] = React.useState(false);
  const navigate = useNavigate()
  let {
    showAlertDelete,
    setShowAlertDelete,
    deleteLoading,
    confirmDelete,
    onConfirmDelete,
  } = useDelete({
    afterDeleted: () => queryClient.invalidateQueries("list_notice"),
    onDelete: (id) => {
      return deleteNotice(id);
    },
  });
  const initialValue = {
    tanggal_pengumuman : new Date(),
    judul_notice : "testing",
    isi_notice : null,
  };

  let parameter = {
    page: page,
    pageSize: pageSize,
    nama_siswa: debouncedName,
  };

  let { data, isLoading, isFetching } = useQuery(
    //query key
    ["list_notice", parameter],
    //axios function,triggered when page/pageSize change
    () => listNotice(parameter),
    //configuration
    {
      refetchInterval: 1000 * 60 * 60,
      select: (response) => {
        return response.data;
      },
    }
  );

  console.log(data);

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
    <LayoutPage title={"Notice"}>
      <ModalAlert
        open={showAlertDelete}
        setOpen={setShowAlertDelete}
        loading={deleteLoading}
        onConfirm={onConfirmDelete}
        title={"Apakah yakin akan menghapus pengumunan terpilih ?"}
      />
      <Formik
        initialValues={initialValue}
        enableReinitialize
        validationSchema={noticeSchema}
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
              <FormNotice
                data={data?.data}
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
                          // setIsOpen(true);
                          // setMode("add");
                          // return window.scrollTo(0, 0);
                          navigate("/guru/notice/tambah")
                        }}
                        content="Buat Notice"
                      />
                    </div>
                  </div>
                  <Table celled selectable>
                    <Table.Header>
                      <Table.Row>
                        <Table.HeaderCell>
                          No
                        </Table.HeaderCell>
                        <Table.HeaderCell>Tanggal</Table.HeaderCell>

                        <Table.HeaderCell w={4}>Gambar</Table.HeaderCell>
                        <Table.HeaderCell>Judul</Table.HeaderCell>
                        <Table.HeaderCell w={8}>Status</Table.HeaderCell>
                        <Table.HeaderCell w={8}>Published By</Table.HeaderCell>
                        <Table.HeaderCell w={8}>Published At</Table.HeaderCell>
                        

                        <Table.HeaderCell singleLine>Aksi</Table.HeaderCell>
                      </Table.Row>
                    </Table.Header>
                    <Table.Body>
                      <TableLoading
                        count={10}
                        isLoading={isLoading}
                        // isLoading={false}
                        // data={data?.data?.rows}
                        messageEmpty={"Tidak Ada Catatan Pelanggaran Sholat"}
                      >
                        {
                            data?.data.map((value,index) => (
                                <Table.Row key={index}>
                            <Table.Cell>
                              {index + 1}
                            </Table.Cell>
                            <Table.Cell>
                              {formatDate(value?.tanggal_pengumuman)}
                            </Table.Cell>
                            <Table.Cell textAlign="left">
                              {/* {formatWaktuSholat(value?.waktu)} */}
                              <div className="h-10 w-full max-w-[10rem] bg-green-400">
                                <img src={value?.gambar_notice} alt="" className="w-full h-full object-cover"/>
                              </div>
                            </Table.Cell>
                            <Table.Cell>
                              <span className="capitalize">
                                {value?.judul_notice}
                              </span>
                            </Table.Cell>

                            <Table.Cell textAlign="left" colSpan={value?.status === 'draft' ? 3 : 1}>
                              {value?.status === 'draft' ? (
                                <div className="bg-blue-500 p-2 text-white font-bold rounded-lg">Draft</div>
                              ) : (
                                <div className="bg-green-600 p-2 text-white font-bold rounded-lg">published</div>
                              )}
                            </Table.Cell>
                            {/* <Table.Cell textAlign="left">
                              {handleViewNull(value?.alasan)}
                              tidur
                            </Table.Cell>
                            <Table.Cell textAlign="left">
                              <span className="capitalize">
                                {" "}
                                {handleViewNull(value?.guru?.nama_guru)}
                                paihsan
                              </span>
                            </Table.Cell> */}
                            {
                              value?.status === 'publish' && (
                                <Table.Cell>
                                  <span className="">{value?.publisher?.name}</span>
                                </Table.Cell>
                              )
                            }
                            {
                              value?.status === 'publish' && (
                                <Table.Cell>
                                  {formatDate(value?.published_at)}
                                </Table.Cell>
                              )
                            }

                            <Table.Cell textAlign="left">
                              <div className="flex items-center">
                                {" "}
                                <EditButton
                                onClick={() => navigate(`/guru/notice/edit/${value?.id}`)}
                                />
                                <DeleteButton
                                  onClick={() => confirmDelete(value?.id)}
                                />
                                <DownloadButton disabled={value?.file_notice == null}/>
                              </div>
                            </Table.Cell>
                          </Table.Row>
                            ))
                        }
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
