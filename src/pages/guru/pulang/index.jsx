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
  Menu,
  Icon,
} from "semantic-ui-react";
import { useQuery, useQueryClient } from "react-query";
import {
  listPulang,
  responsePulang,
  laporanPulang,
} from "../../../api/guru/pulangDanKunjungan";
import { TableLoading, ModalFilter } from "../../../components";
import { handleViewNull, formatDate, statusApproval } from "../../../utils";
import { Formik } from "formik";
import { ToastContainer, toast } from "react-toastify";
import { selisihHari } from "../../../utils/waktu";
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
  let [updated, setUpdated] = React.useState(false)
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
      console.log(approve)
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
            <Segment>
              <div className="overflow-auto h-full">
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
                  {approve || laporan ? (
                    <>
                      <Button
                        type="button"
                        basic
                        color="red"
                        onClick={() => {
                          setApprove(false);
                          setLaporan(false);
                          setUpdated(false)
                          return setValues(data?.data?.rows);
                        }}
                        content="Batal"
                      />

                      <Button
                        content="Simpan"
                        color="teal"
                        basic
                        type="submit"
                        loading={isSubmitting}
                        disabled={isSubmitting || !updated}
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
                        content="Respon Pengajuan"
                      />
                    </>
                  )}

                  {!approve && !laporan && (
                    <Button
                      type="button"
                      color="olive"
                      onClick={() => {
                        setLaporan(!laporan);
                      }}
                      content="Laporan Kedatangan"
                    />
                  )}
                </div>

                <Table celled padded>
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
                                 setUpdated(true)
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
                                  setUpdated(true)
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
                                   setUpdated(true)
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
                                  setUpdated(true)
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
                              formatDate(value?.tanggal_kembali)
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
                  <Table.Footer>
                    <Table.Row>
                      <Table.HeaderCell colSpan="13">
                        <Dropdown
                          value={pageSize}
                          selection
                          compact
                          className="absolute"
                          header
                          labeled
                          onChange={(e, data) => {
                            setPageSize(data.value);
                          }}
                          search
                          options={pageSizeOptions}
                        />
                        <Menu floated="right" pagination>
                          <Menu.Item as="a" icon>
                            <Icon name="chevron left" />
                          </Menu.Item>
                          <Menu.Item as="a">1</Menu.Item>
                          <Menu.Item as="a">2</Menu.Item>
                          <Menu.Item as="a">3</Menu.Item>
                          <Menu.Item as="a">4</Menu.Item>
                          <Menu.Item as="a" icon>
                            <Icon name="chevron right" />
                          </Menu.Item>
                        </Menu>
                      </Table.HeaderCell>
                    </Table.Row>
                  </Table.Footer>
                </Table>
              </div>
            </Segment>
          </Form>
        )}
      </Formik>
    </LayoutPage>
  );
}
