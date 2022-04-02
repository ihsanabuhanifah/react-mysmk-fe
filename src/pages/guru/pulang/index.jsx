import React from "react";
import LayoutPage from "../../../module/layoutPage";
import {
  Table,
  Dropdown,
  Button,
  Input,
  Segment,
  Form,
  TextArea,
} from "semantic-ui-react";
import { useQuery, useQueryClient } from "react-query";
import { listPulang, updatePulang } from "../../../api/guru/pulangDanKunjungan";
import { TableLoading, ModalFilter } from "../../../components";
import { handleViewNull, formatDate, statusApproval } from "../../../utils";
import { Formik } from "formik";
import { ToastContainer, toast } from "react-toastify";
import * as Yup from "yup";
import FilterPerizinanPulang from "./filterPulang";

import useDebounce from "../../../hook/useDebounce";
import { approveOptions } from "../../../utils/options";

export default function Pulang() {
  let queryClient = useQueryClient();
  let [page, setPage] = React.useState(1);
  let [pageSize, setPageSize] = React.useState(10);
  let [nama, setNama] = React.useState("");
  let debouncedName = useDebounce(nama, 600);
  let [approve, setApprove] = React.useState(false);
  let parameter = {
    page: page,
    pageSize: pageSize,
    nama_siswa: debouncedName,
  };
  const [initialValue, setInitialValue] = React.useState({ data: [] });
  let { data, isLoading, isFetching } = useQuery(
    //query key
    ["perizinan_pulang", parameter],
    //axios function,triggered when page/pageSize change
    () => listPulang(parameter),
    //configuration
    {
      refetchInterval: 1000 * 60 * 60,
      select: (response) => {
        return response.data;
      },
    }
  );

  const onSubmit = async (values) => {
    try {
      const response = await updatePulang(values);
      queryClient.invalidateQueries("perizinan_pulang");
      setApprove(false);
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
    }
  };

  return (
    <LayoutPage title={"Perizinan Pulang"}>
      <Formik
        initialValues={data?.data}
        enableReinitialize
        // validationSchema={profileSchema}
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
        }) => (
          <Form onSubmit={handleSubmit}>
            <Segment>
              <div className="overflow-auto">
                <div className="space-x-2">
                  <Input
                    onChange={(e) => {
                      setNama(e.target.value);
                    }}
                    value={nama}
                    icon="search"
                    placeholder="Nama Siswa..."
                  />
                  {/* <ModalFilter header={'Filter'} open={open} setOpen={setOpen}>
            <FilterPerizinanPulang/>
        </ModalFilter> */}
                  {approve ? (
                    <>
                      <Button
                        type="button"
                        color="red"
                        onClick={() => {
                          setApprove(false);
                          return setValues(data?.data);
                        }}
                        content="Batal"
                      />

                      <Button
                        content="Simpan"
                        color="blue"
                        type="submit"
                        loading={isSubmitting}
                        disabled={isSubmitting}
                      />
                    </>
                  ) : (
                    <>
                      <Button
                        type="button"
                        color="teal"
                        onClick={() => {
                          setApprove(true);
                        }}
                        content="Perbaharui"
                      />
                    </>
                  )}

                  <Button
                    type="button"
                    color="olive"
                    onClick={() => {
                      setApprove(true);
                    }}
                    content="Laporan Kedatangan"
                  />
                </div>

                <Table celled selectable>
                  <Table.Header>
                    <Table.Row>
                      <Table.HeaderCell textAlign="center">No</Table.HeaderCell>
                      <Table.HeaderCell>Nama Siswa</Table.HeaderCell>
                      <Table.HeaderCell>Pulang Dari</Table.HeaderCell>
                      <Table.HeaderCell>Pulang Sampai</Table.HeaderCell>
                      <Table.HeaderCell>Kepentingan</Table.HeaderCell>
                      <Table.HeaderCell textAlign="center">
                        Status Approval
                      </Table.HeaderCell>
                      <Table.HeaderCell>Alasan Ditolak</Table.HeaderCell>
                      <Table.HeaderCell>Approve By</Table.HeaderCell>
                      <Table.HeaderCell>Tanggal Kembali</Table.HeaderCell>
                      <Table.HeaderCell>Jam Kembali</Table.HeaderCell>
                      <Table.HeaderCell>Terlambat</Table.HeaderCell>
                      <Table.HeaderCell>Denda</Table.HeaderCell>
                      <Table.HeaderCell>DiLaporkan By</Table.HeaderCell>
                      <Table.HeaderCell textAlign="center">
                        Aksi
                      </Table.HeaderCell>
                    </Table.Row>
                  </Table.Header>
                  <Table.Body>
                    <TableLoading
                      count={14}
                      isLoading={isLoading}
                      data={data?.data}
                      messageEmpty={"Tidak Ada Pengajuan Izin"}
                    >
                      {values?.map((value, index) => (
                        <Table.Row key={index}>
                          <Table.Cell textAlign="center">
                            {index + 1}
                          </Table.Cell>
                          <Table.Cell>
                            <span className="capitalize">
                              {handleViewNull(value?.siswa?.nama_siswa)}
                            </span>
                          </Table.Cell>
                          <Table.Cell>
                            {formatDate(value?.izin_dari)}
                          </Table.Cell>
                          <Table.Cell>
                            {formatDate(value?.izin_sampai)}
                          </Table.Cell>
                          <Table.Cell textAlign="left">
                            {handleViewNull(value?.kepentingan)}
                          </Table.Cell>

                          <Table.Cell>
                            {approve ? (
                              <Dropdown
                                placeholder="Status Approval"
                                fluid
                                selection
                                search
                                onChange={(event, data) => {
                                  console.log("jalan sini");
                                  setFieldValue(
                                    `[${index}]status_approval`,
                                    data.value
                                  );
                                  setFieldValue(`[${index}]updated`, true);
                                  if (data.value === "menunggu") {
                                    return setFieldValue(
                                      `[${index}]alasan_ditolak`,
                                      ""
                                    );
                                  }
                                }}
                                name={`[${index}]status_approval`}
                                value={value.status_approval}
                                options={approveOptions}
                              />
                            ) : (
                              <button
                                onClick={() => {
                                  setApprove(true);
                                }}
                                type="button"
                              >
                                {" "}
                                {statusApproval(value?.status_approval)}
                              </button>
                            )}
                          </Table.Cell>
                          <Table.Cell>
                            {approve ? (
                              <TextArea
                                selection
                                style={{
                                  padding: 10,
                                }}
                                search
                                onChange={(e) => {
                                  setFieldValue(`[${index}]updated`, true);
                                  setFieldValue(
                                    `[${index}]alasan_ditolak`,
                                    e.target.value
                                  );
                                }}
                                name={`[${index}]alasan_ditolak`}
                                value={value.alasan_ditolak}
                              />
                            ) : (
                              handleViewNull(value?.alasan_ditolak)
                            )}
                          </Table.Cell>
                          <Table.Cell>
                            {handleViewNull(value?.pulang_approv_by?.nama_guru)}
                          </Table.Cell>
                          <Table.Cell>
                            {approve === index ? (
                              <Input
                                type="date"
                                placeholder="Select Friend"
                                fluid
                                selection
                                search
                                value={value.tanggal_kembali}
                              />
                            ) : (
                              formatDate(value?.tanggal_kembali)
                            )}
                          </Table.Cell>
                          <Table.Cell>
                            {handleViewNull(value?.jam_kembali_ke_sekolah)}
                          </Table.Cell>
                          <Table.Cell>
                            {handleViewNull(value?.jumlah_hari_terlambat)}
                          </Table.Cell>
                          <Table.Cell>
                            {handleViewNull(value?.denda)}
                          </Table.Cell>
                          <Table.Cell>
                            {handleViewNull(value?.denda)}
                          </Table.Cell>
                          <Table.Cell>
                            <div className="space-y-2">
                              <Button
                                content={"Approve"}
                                type="button"
                                fluid
                                size="medium"
                                color="green"
                              />
                              <Button
                                content={"Report"}
                                type="button"
                                fluid
                                size="medium"
                                color="teal"
                              />
                            </div>
                          </Table.Cell>
                        </Table.Row>
                      ))}
                    </TableLoading>
                  </Table.Body>
                </Table>
              </div>
            </Segment>
          </Form>
        )}
      </Formik>
    </LayoutPage>
  );
}
