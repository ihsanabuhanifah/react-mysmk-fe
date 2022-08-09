import React from "react";
import { useNavigate } from "react-router-dom";

import LayoutPage from "../../../module/layoutPage";
import {
  Table,
  Button,
  Form,
  Select,
  Icon,
  Dropdown,
  TextArea,
  Sidebar,
  Menu,
} from "semantic-ui-react";
import { useQuery, useQueryClient } from "react-query";
import { PaginationTable, TableLoading } from "../../../components";
import { Formik } from "formik";
import * as Yup from "yup";
import { izinOptions } from "../../../utils/options";
import { formatValue } from "../../../utils";

import { ErrorMEssage } from "../../../components";
import { formatHari, formatTahun } from "../../../utils";

import { toast } from "react-toastify";
import FilterRekap from "./filter";

import { formatDay } from "../../../utils/waktu";
import { listAbsenPengampu } from "../../../api/guru/halaqoh";
import usePage from "../../../hook/usePage";

let personalSchema = Yup.object().shape({
  keterangan: Yup.string()
    .nullable()
    .when("status_kehadiran", {
      is: (id) => {
        if (id !== 1) {
          return true;
        }
      },
      then: (id) => Yup.string().nullable().required("wajib disii"),
    }),
  kehadiran: Yup.object().shape({
    id: Yup.string().nullable().required("wajib diisi"),
    alasan: Yup.mixed()
      .nullable()
      .when("id", {
        is: (id) => {
          if (parseFloat(id) === 6) {
            return true;
          }
        },
        then: (id) => Yup.mixed().required(`Wajib Absensi`),
      }),
  }),
});
let AbsensiSchema = Yup.object().shape({
  rows: Yup.array().of(personalSchema),
});
export default function PengampuHalaqoh() {
  let date = new Date();

  let queryClient = useQueryClient();
  let [hari, setHari] = React.useState(formatHari(new Date()));

  let { page, pageSize, setPageSize, setPage } = usePage();

  const dayOptions = [
    { key: "1", value: "semua", text: "Semua" },
    { key: "2", value: "senin", text: "Senin" },
    { key: "3", value: "selasa", text: "Selasa" },
    { key: "4", value: "rabu", text: "Rabu" },
    { key: "5", value: "kamis", text: "Kamis" },
    { key: "6", value: "jumat", text: "Jumat" },
    { key: "7", value: "sabtu", text: "Sabtu" },
    { key: "8", value: "minggu", text: "Minggu" },
  ];

  let [visible, setVisible] = React.useState(false);
  const [filter, setFilter] = React.useState({});

  let [absen, setAbsen] = React.useState(false);
  let params = {
    page,
    pageSize,
    ...filter,
  };
  let { data, isLoading } = useQuery(
    //query key
    ["absensi_pengampu", params],
    //axios function,triggered when page/pageSize change
    () => listAbsenPengampu(params),
    //configuration
    {
      keepPreviousData: true,
      select: (response) => response.data,
    }
  );

  const onSubmit = () => {
    console.log("berjalan");
  };

  return (
    <LayoutPage title="Absensi Pengampu Halaqoh">
      <Sidebar
        as={Menu}
        animation="overlay"
        icon="labeled"
        inverted
        direction="right"
        onHide={() => setVisible(false)}
        vertical
        visible={visible}
        width="wide"
      >
        <FilterRekap
          filter={filter}
          setFilter={setFilter}
          setVisible={setVisible}
        />
      </Sidebar>
      <Formik
        initialValues={data?.data}
        enableReinitialize
        validationSchema={AbsensiSchema}
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
          <div className="space-y-5 mt-5">
            <Form onSubmit={handleSubmit}>
              <section className="" style={{ maxWidth: "100%" }} padded>
                <section className="grid grid-cols-1 lg:grid-cols-5 2xl:grid-cols-6 gap-5">
                  <div className="col-span-2">
                    <Form.Field
                      control={Select}
                      options={dayOptions}
                      // label={{
                      //   children: "Hari",
                      //   htmlFor: "hari",
                      //   name: "hari",
                      // }}
                      name="hari"
                      id="hari"
                      onChange={(event, data) => {
                        setHari(data.value);
                      }}
                      value={hari}
                      placeholder="Pilih Hari"
                      search
                      searchInput={{ id: "hari", name: "hari" }}
                    />
                  </div>
                  <div className="col-span-6 lg:col-span-1 2xl:col-span-1">
                    <Button
                      content={"Filter"}
                      type="button"
                      fluid
                      icon={() => <Icon name="filter" />}
                      size="medium"
                      color="teal"
                      onClick={() => {
                        setVisible(!visible);
                      }}
                    />
                  </div>
                  <div className="col-span-6 lg:col-span-1 2xl:col-span-1">
                    {!absen ? (
                      <Button
                        content={"Absen"}
                        type="button"
                        fluid
                        icon={() => <Icon name="edit" />}
                        size="medium"
                        color="teal"
                        onClick={() => {
                          setAbsen(true);
                        }}
                      />
                    ) : (
                      <div className="grid grid-cols-2 gap-5">
                        <Button
                          content="Simpan"
                          color="teal"
                          basic
                          fluid
                          type="submit"
                          loading={isSubmitting}
                          //   disabled={isSubmitting || !updated}
                        />
                        <Button
                          content="Batal"
                          color="red"
                          basic
                          fluid
                          type="button"
                          onClick={() => {
                            setAbsen(false);
                          }}
                        />
                      </div>
                    )}
                  </div>
                </section>
                <Table celled selectable>
                  <Table.Header>
                    <Table.Row>
                      <Table.HeaderCell>No</Table.HeaderCell>
                      <Table.HeaderCell>Tanggal</Table.HeaderCell>
                      <Table.HeaderCell>Nama Musyrif</Table.HeaderCell>
                      <Table.HeaderCell>Status Kehadiran</Table.HeaderCell>
                      <Table.HeaderCell>Keterangan</Table.HeaderCell>
                      <Table.HeaderCell>Tahun Ajaran</Table.HeaderCell>
                    </Table.Row>
                  </Table.Header>
                  <Table.Body>
                    <TableLoading
                      count={9}
                      isLoading={isLoading}
                      data={data?.data?.rows}
                      messageEmpty={"Data tidak ditemukan"}
                    >
                      {values?.rows?.map((value, index) => (
                        <Table.Row key={index}>
                          <Table.Cell>{index + 1}</Table.Cell>
                          <Table.Cell>{formatDay(value?.tanggal)}</Table.Cell>

                          <Table.Cell>{value?.teacher?.nama_guru}</Table.Cell>
                          <Table.Cell>
                            {!absen ? (
                              value?.kehadiran?.nama_status_kehadiran
                            ) : (
                              <div className="flex flex-col">
                                <Dropdown
                                  selection
                                  search
                                  options={izinOptions}
                                  id={`rows[${index}]status_kehadiran`}
                                  name={`rows[${index}]status_kehadiran`}
                                  onChange={(e, data) => {
                                    setFieldValue(
                                      `rows[${index}]status_kehadiran`,
                                      data.value
                                    );

                                    console.log(e.target.value);
                                    setFieldValue(
                                      `rows[${index}]kehadiran.id`,
                                      data.value
                                    );
                                  }}
                                  error={
                                    errors?.rows?.[index]?.kehadiran?.alasan !==
                                      undefined &&
                                    errors?.rows?.[index]?.kehadiran?.alasan
                                  }
                                  value={value?.status_kehadiran}
                                />

                                {console.log("ee", errors)}

                                {errors?.rows?.[index]?.kehadiran?.alasan !==
                                  undefined && (
                                  <ErrorMEssage>
                                    {errors?.rows?.[index]?.kehadiran?.alasan}
                                  </ErrorMEssage>
                                )}
                              </div>
                            )}
                          </Table.Cell>
                          <Table.Cell>
                            {!absen ? (
                              value?.keterangan
                            ) : (
                              <>
                                <TextArea
                                  id={`rows[${index}]kehadiran`}
                                  name={`rows[${index}]kehadiran`}
                                  onChange={(e) => {
                                    setFieldValue(
                                      `rows[${index}]keterangan`,
                                      e.target.value
                                    );
                                  }}
                                />
                                {errors?.rows?.[index]?.keterangan && (
                                  <ErrorMEssage>
                                    {errors?.rows?.[index]?.keterangan}
                                  </ErrorMEssage>
                                )}
                              </>
                            )}
                          </Table.Cell>
                          <Table.Cell>
                            {value?.tahun_ajaran?.nama_tahun_ajaran}
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
              </section>
            </Form>
          </div>
        )}
      </Formik>
    </LayoutPage>
  );
}
