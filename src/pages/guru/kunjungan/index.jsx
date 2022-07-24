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
  listKunjungan,
  responseKunjungan,
} from "../../../api/guru/pulangDanKunjungan";
import { TableLoading, ModalFilter } from "../../../components";
import { handleViewNull, formatDate, statusApproval } from "../../../utils";
import { Formik } from "formik";
import { toast } from "react-toastify";

import * as Yup from "yup";

import useDebounce from "../../../hook/useDebounce";
import { approveOptions, pageSizeOptions } from "../../../utils/options";

export default function Kunjungan() {
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

  let { data, isLoading, isFetching } = useQuery(
    //query key
    ["perizinan_kunjungan", parameter],
    //axios function,triggered when page/pageSize change
    () => listKunjungan(parameter),
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
      response = await responseKunjungan(values);
      queryClient.invalidateQueries("perizinan_kunjungan");
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
    <LayoutPage title={"Perizinan Kunjungan"}>
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
                <div className="grid grid-cols-8 gap-5">
                  <div className=" col-span-8 lg:col-span-4">
                    <Input
                      onChange={(e) => {
                        setNama(e.target.value);
                      }}
                      value={nama}
                      fluid
                      icon="search"
                      placeholder="Nama Siswa..."
                    />
                  </div>

                  {approve ? (
                    <>
                      <div className="col-span-4 lg:col-span-1">
                        <Button
                          type="button"
                          color="red"
                          basic
                          fluid
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
                </div>

                <Table celled padded>
                  <Table.Header>
                    <Table.Row>
                      <Table.HeaderCell>No</Table.HeaderCell>
                      <Table.HeaderCell>Nama Siswa</Table.HeaderCell>
                      <Table.HeaderCell>Tanggal</Table.HeaderCell>

                      <Table.HeaderCell>Kepentingan</Table.HeaderCell>
                      <Table.HeaderCell>
                        Status Approval
                      </Table.HeaderCell>
                      <Table.HeaderCell content singleLine={approve}>
                        Alasan Ditolak
                      </Table.HeaderCell>
                      <Table.HeaderCell>Approve By</Table.HeaderCell>
                    </Table.Row>
                  </Table.Header>
                  <Table.Body>
                    <TableLoading
                      count={13}
                      isLoading={isLoading}
                      data={data?.data?.rows}
                      messageEmpty={"Tidak Ada Pengajuan Izin Kunjungan"}
                    >
                      {values?.map((value, index) => (
                        <Table.Row key={index}>
                          <Table.Cell>
                            {index + 1}
                          </Table.Cell>
                          <Table.Cell>
                            <span className="capitalize">
                              {handleViewNull(value?.siswa?.nama_siswa)}
                            </span>
                          </Table.Cell>
                          <Table.Cell>{formatDate(value?.tanggal)}</Table.Cell>

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
                            {handleViewNull(
                              value?.kunjungan_approv_by?.nama_guru
                            )}
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
