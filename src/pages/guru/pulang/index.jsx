import React from "react";
import LayoutPage from "../../../module/layoutPage";
import {
  Table,
  Dropdown,
  Button,
  Input,
  Form,
  TextArea,
} from "semantic-ui-react";
import { useQuery, useQueryClient } from "react-query";
import {
  listPulang,
  responsePulang,
  laporanPulang,
} from "../../../api/guru/pulangDanKunjungan";
import { TableLoading } from "../../../components";
import {
  handleViewNull,
  showFormattedDate,
  statusApproval,
  selisihHari,
} from "../../../utils";
import { Formik } from "formik";
import { toast } from "react-toastify";

import * as Yup from "yup";
import FilterPerizinanPulang from "./filterPulang";

import useDebounce from "../../../hook/useDebounce";
import { approveOptions, pageSizeOptions } from "../../../utils/options";

export default function Pulang() {
  let queryClient = useQueryClient();
  let [page, setPage] = React.useState(1);
  let [pageSize, setPageSize] = React.useState(10);
  let [nama, setNama] = React.useState("");
  let debouncedName = useDebounce(nama, 600);
  let [approve, setApprove] = React.useState(false);
  let [laporan, setLaporan] = React.useState(false);
  let [updated, setUpdated] = React.useState(false);
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
      let response;
      console.log(approve);
      if (approve) {
        response = await responsePulang(values);
      } else {
        response = await laporanPulang(values);
      }
      queryClient.invalidateQueries("perizinan_pulang");
      setApprove(false);
      setLaporan(false);
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
        initialValues={data?.data?.rows}
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
            <section className="mt-5">
              <div className=" h-full">
                <div className=" grid grid-cols-8 gap-5">
                  <div className="col-span-8 lg:col-span-4">
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
                  {/* <ModalFilter header={'Filter'} open={open} setOpen={setOpen}>
            <FilterPerizinanPulang/>
        </ModalFilter> */}
                  {approve || laporan ? (
                    <>
                      <div className="col-span-4 lg:col-span-1">
                        <Button
                          type="button"
                          basic
                          fluid
                          color="red"
                          onClick={() => {
                            setApprove(false);
                            setLaporan(false);
                            setUpdated(false);
                            return setValues(data?.data?.rows);
                          }}
                          content="Batal"
                        />
                      </div>

                      <div className="col-span-4 lg:col-span-1">
                        <Button
                          content="Simpan"
                          color="teal"
                          basic
                          fluid
                          type="submit"
                          loading={isSubmitting}
                          disabled={isSubmitting || !updated}
                        />
                      </div>
                    </>
                  ) : (
                    <div className="col-span-8 lg:col-span-2">
                      <Button
                        type="button"
                        color="teal"
                        fluid
                        onClick={() => {
                          setApprove(true);
                        }}
                        content="Respon Pengajuan"
                      />
                    </div>
                  )}

                  {!approve && !laporan && (
                    <div className="col-span-8 lg:col-span-2">
                      <Button
                        type="button"
                        color="linkedin"
                        fluid
                        onClick={() => {
                          setLaporan(!laporan);
                        }}
                        content="Laporan Kedatangan"
                      />
                    </div>
                  )}
                </div>

                <section className="mt-5" style={{
                  zoom: '80%'
                }}>
                  <Table celled padded>
                    <Table.Header>
                      <Table.Row>
                        <Table.HeaderCell>No</Table.HeaderCell>
                        <Table.HeaderCell>Nama Siswa</Table.HeaderCell>
                        <Table.HeaderCell>Pulang Dari</Table.HeaderCell>
                        <Table.HeaderCell>Pulang Sampai</Table.HeaderCell>
                        <Table.HeaderCell>Kepentingan</Table.HeaderCell>
                        <Table.HeaderCell>Status Approval</Table.HeaderCell>
                        <Table.HeaderCell width={16} content singleLine={approve}>
                          Alasan Ditolak
                        </Table.HeaderCell>
                        <Table.HeaderCell>Approve By</Table.HeaderCell>

                        <Table.HeaderCell width={16} content singleLine={laporan}>
                          Jam Kembali
                        </Table.HeaderCell>
                        <Table.HeaderCell width={16} content singleLine={laporan}>
                          Tanggal Kembali
                        </Table.HeaderCell>
                        <Table.HeaderCell>Terlambat</Table.HeaderCell>
                        <Table.HeaderCell>Denda</Table.HeaderCell>
                        <Table.HeaderCell>Laporan</Table.HeaderCell>
                      </Table.Row>
                    </Table.Header>
                    <Table.Body>
                      <TableLoading
                        count={13}
                        isLoading={isLoading}
                        data={data?.data?.rows}
                        messageEmpty={"Tidak Ada Pengajuan Izin"}
                      >
                        {values?.map((value, index) => (
                          <Table.Row key={index}>
                            <Table.Cell>{index + 1}</Table.Cell>
                            <Table.Cell>
                              <span className="capitalize">
                                {handleViewNull(value?.siswa?.nama_siswa)}
                              </span>
                            </Table.Cell>
                            <Table.Cell>
                              {showFormattedDate(value?.izin_dari)}
                            </Table.Cell>
                            <Table.Cell>
                              {showFormattedDate(value?.izin_sampai)}
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
                                    setUpdated(true);
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
                                    setUpdated(true);
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
                              {laporan ? (
                                <Input
                                  type="time"
                                  fluid
                                  selection
                                  search
                                  value={value.jam_kembali_ke_sekolah}
                                  onChange={(e) => {
                                    setUpdated(true);
                                    setFieldValue(`[${index}]updated`, true);

                                    return setFieldValue(
                                      `[${index}]jam_kembali_ke_sekolah`,
                                      e.target.value
                                    );
                                  }}
                                />
                              ) : (
                                handleViewNull(value?.jam_kembali_ke_sekolah)
                              )}
                            </Table.Cell>
                            <Table.Cell collapsing>
                              {laporan ? (
                                <Input
                                  type="date"
                                  fluid
                                  name={`[${index}]tanggal_kembali`}
                                  selection
                                  search
                                  value={value.tanggal_kembali}
                                  onChange={(e) => {
                                    setUpdated(true);
                                    let selisih = selisihHari(
                                      value.izin_sampai,
                                      value.tanggal_kembali
                                    );
                                    setFieldValue(`[${index}]updated`, true);
                                    console.log(selisih);
                                    if (selisih > 0) {
                                      setFieldValue(
                                        `[${index}]jumlah_hari_terlambat`,
                                        selisih
                                      );
                                    }
                                    return setFieldValue(
                                      `[${index}]tanggal_kembali`,
                                      e.target.value
                                    );
                                  }}
                                />
                              ) : (
                                showFormattedDate(value?.tanggal_kembali)
                              )}
                            </Table.Cell>
                            <Table.Cell>
                              {laporan ? (
                                <Input
                                  type="number"
                                  placeholder="Terlambat"
                                  fluid
                                  disabled
                                  selection
                                  search
                                  value={value.jumlah_hari_terlambat}
                                />
                              ) : (
                                handleViewNull(value?.jumlah_hari_terlambat)
                              )}
                            </Table.Cell>
                            <Table.Cell>
                              {laporan ? (
                                <Input
                                  type="text"
                                  placeholder="Denda"
                                  fluid
                                  disabled
                                  selection
                                  search
                                  value={value.denda}
                                />
                              ) : (
                                handleViewNull(value?.denda)
                              )}
                            </Table.Cell>
                            <Table.Cell>
                              {handleViewNull(value?.laporan_oleh?.nama_guru)}
                            </Table.Cell>
                          </Table.Row>
                        ))}
                      </TableLoading>
                    </Table.Body>
                  </Table>
                </section>
              </div>
            </section>
          </Form>
        )}
      </Formik>
    </LayoutPage>
  );
}
