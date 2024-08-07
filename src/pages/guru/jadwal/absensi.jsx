/* eslint-disable eqeqeq */
import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { listAbsensi } from "../../../api/guru/absensi";
import { useQuery, useQueryClient } from "react-query";
import { Formik } from "formik";
import { updateAbsensi } from "../../../api/guru/absensi";
import { TableLoading } from "../../../components";
import { compareValues } from "../../../utils/sort";
import {
  Input,
  Table,
  Select,
  Form,
  Button,
  Header,
  TextArea,
  Dropdown,
  Icon,
  Message,
} from "semantic-ui-react";
import { getOptions } from "../../../utils/format";
import { izinOptions } from "../../../utils/options";
import LayoutPage from "../../../module/layoutPage";
import { toast } from "react-toastify";
import * as Yup from "yup";
import useList from "../../../hook/useList";

let personalSchema = Yup.object().shape({
  kehadiran: Yup.object().shape({
    id: Yup.string().nullable().required("wajib diisi"),
    alasan: Yup.mixed()
      .nullable()
      .when("id", {
        is: (id) => {
          if (id == 6) {
            return true;
          }
        },
        then: (id) => Yup.mixed().required(`Wajib Absensi`),
      }),
  }),
});

let agendaSchema = Yup.object().shape({
  materi: Yup.string().nullable().required("wajib diisi"),
});

let AbsensiSchema = Yup.object().shape({
  absensi_kehadiran: Yup.array().of(personalSchema),
  agenda_kelas: Yup.array().of(agendaSchema),
});

export default function Absensi() {
  let { kelas_id, mapel_id, tanggal } = useParams();

  let [page, setPage] = React.useState(1);
  let [pageSize, setPageSize] = React.useState(10);
  let [dariTanggal, setDariTanggal] = React.useState(tanggal);
  let [sampaiTanggal, setSampaiTanggal] = React.useState(tanggal);
  let [tanggalActive, setTanggalActive] = React.useState(tanggal);
  let [kelas, setKelas] = React.useState(kelas_id);
  let [mapel, setMapel] = React.useState(mapel_id);

  let queryClient = useQueryClient();
  const [initialState, setIniitalState] = React.useState({
    tanggal: "",
    semester: "",
    ta_id: "",
    kelas_id: "",
    mapel_id: "",
    absensi_kehadiran: [],
    agenda_kelas: [],
  });
  let navigate = useNavigate();

  let parameter = {
    page,
    pageSize,
    dariTanggal,
    sampaiTanggal,
    mapel_id,
    kelas_id,
  };
  let { isLoading, isError, data, isFetching } = useQuery(
    //query key
    ["absensi", parameter],
    //axios function,triggered when page/pageSize change
    () => listAbsensi(parameter),
    //configuration
    {
      keepPreviousData: true,
      staleTime : 1000 * 60 *5,
      select: (response) => response.data,
      onSuccess: (data) => {
        let session = sessionStorage.getItem(
          `${kelas_id}_${mapel_id}_${tanggal}`
        );

        if (session === undefined || session == null) {
          setIniitalState({
            ...initialState,
            tanggal: data?.absensi?.[0]?.tanggal,
            semester: data?.absensi?.[0]?.semester,
            ta_id: data?.absensi?.[0]?.tahun_ajaran?.id,
            kelas_id: data?.absensi?.[0]?.kelas?.id,
            mapel_id: data?.absensi?.[0]?.mapel?.id,
            absensi_kehadiran: data?.absensi,
            agenda_kelas: data?.agenda,
          });
        } else {
          session = JSON.parse(session);
          setIniitalState({
            ...initialState,
            tanggal: session.tanggal,
            semester: session.semester,
            ta_id: session.tahun_ajaran?.id,
            kelas_id: session.kelas?.id,
            mapel_id: session.mapel?.id,
            absensi_kehadiran: session?.absensi_kehadiran,
            agenda_kelas: session?.agenda_kelas,
          });
        }
      },
    }
  );
  const { dataKelas, dataMapel } = useList();

  const onSubmit = async (values) => {
    try {
      const response = await updateAbsensi(values);
      queryClient.invalidateQueries("absensi");
      queryClient.invalidateQueries("notifikasi_absensi_halaqoh");
      queryClient.invalidateQueries("notifikasi_absensi_kelas");
      sessionStorage.removeItem(`${kelas_id}_${mapel_id}_${tanggal}`);
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

  React.useEffect(() => {
    setDariTanggal(tanggal);
    setSampaiTanggal(tanggal);
    setTanggalActive(tanggal);
  }, [tanggal]);

  let sessionTes = sessionStorage.getItem(`${kelas_id}_${mapel_id}_${tanggal}`);

  console.log("se", sessionTes);

  return (
    <LayoutPage title={"Agenda Mengajar"}>
      {sessionTes !== null ? (
        <p className="text-red-500 text-lg font-bold">
          Belum Di Simpen ke Database
        </p>
      ) : null}
      <div className="space-x-5">
        <Formik
          initialValues={initialState}
          validationSchema={AbsensiSchema}
          enableReinitialize
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
              <div className="  mb-5 overflow-x-visible w-full ">
                <section className="grid sm:grid-cols-1 lg:grid-cols-7 gap-5 ">
                  <div className="col-span-2 ">
                    <Form.Field
                      control={Input}
                      label="Tanggal"
                      name="email"
                      onChange={(e) => {
                        setTanggalActive(e.target.value);
                      }}
                      value={tanggalActive}
                      disabled={isSubmitting}
                      type="date"
                    />
                  </div>
                  <div className="col-span-2">
                    <Form.Field
                      control={Select}
                      options={getOptions(dataMapel?.data, "nama_mapel")}
                      label={{
                        children: "Mata Pelajaran",
                        htmlFor: "mapel",
                        name: "mapel",
                      }}
                      onChange={(event, data) => {
                        setMapel(data.value);
                      }}
                      value={parseFloat(mapel)}
                      placeholder="Mata Pelajaran"
                      search
                      searchInput={{ id: "mapel", name: "mapel" }}
                    />
                  </div>

                  <div className="col-span-2">
                    <Form.Field
                      control={Select}
                      options={getOptions(dataKelas?.data, "nama_kelas")}
                      label={{
                        children: "Kelas",
                        htmlFor: "kelas",
                        name: "kelas",
                      }}
                      onChange={(event, data) => {
                        setKelas(data.value);
                      }}
                      value={parseFloat(kelas)}
                      placeholder="Kelas"
                      search
                      searchInput={{ id: "kelas", name: "kelas" }}
                    />
                  </div>

                  <div className=" col-span-1 flex items-center justify-center pt-4">
                    <Button
                      content={"Remidial"}
                      type="button"
                      fluid
                      icon={() => <Icon name="filter" />}
                      size="medium"
                      color="teal"
                      onClick={() => {
                        return navigate(
                          `/guru/absensi/${kelas}/${mapel}/${tanggalActive}`
                        );
                      }}
                    />
                  </div>
                </section>
              </div>

              <section style={{ overflow: "auto", maxWidth: "100%" }} padded>
                <Header as={"h3"}>Materi</Header>
                <div className="space-y-5">
                  {values?.agenda_kelas?.map((value, index) => (
                    <React.Fragment key={index}>
                      <div>
                        <Form.Field
                          control={TextArea}
                          label={`Jam ke-${value?.jam_ke}`}
                          placeholder="Materi"
                          name={`agenda_kelas[${index}]materi`}
                          onChange={(e, data) => {
                            console.log("e", e);
                            sessionStorageSet(
                              kelas_id,
                              mapel_id,
                              tanggal,
                              values
                            );
                            setFieldValue(
                              `agenda_kelas[${index}]materi`,
                              data.value
                            );
                          }}
                          onBlur={handleBlur}
                          value={value?.materi === null ? "" : value?.materi}
                          disabled={isSubmitting}
                          fluid
                          type="text"
                          error={
                            errors?.agenda_kelas?.[index]?.materi !==
                              undefined && errors?.agenda_kelas?.[index]?.materi
                          }
                        />
                      </div>
                    </React.Fragment>
                  ))}
                </div>
              </section>

              <section
                className="mt-5"
                style={{ overflow: "auto", maxWidth: "100%" }}
                padded
              >
                <Header as={"h3"}>
                  Absensi - {values?.absensi_kehadiran[0]?.kelas?.nama_kelas} -{" "}
                  {values?.absensi_kehadiran[0]?.mapel?.nama_mapel}{" "}
                </Header>

                <section className="border shadow-md rounded-lg p-5 flex items-center justify-between">
                  <span className="font-bold">Hadir Semua</span>
                  <div>
                    <input
                      type="checkbox"
                      onChange={(e) => {
                        console.log("e", e.target.checked);
                        if (e.target.checked) {
                          let kehadiran = [];
                          // eslint-disable-next-line array-callback-return
                          values?.absensi_kehadiran?.map((value) => {
                            value.kehadiran.id = 1;

                            kehadiran.push(value);
                          });

                          setFieldValue("absensi_kehadiran", kehadiran);
                          sessionStorageSet(
                            kelas_id,
                            mapel_id,
                            tanggal,
                            values
                          );
                        }
                      }}
                    />
                  </div>
                </section>
                <Table>
                  <Table.Header>
                    <Table.Row>
                      <Table.HeaderCell>No</Table.HeaderCell>
                      <Table.HeaderCell>Nama</Table.HeaderCell>

                      <Table.HeaderCell>
                        <div className="flex items-center justify-between">
                          {" "}
                          <span className="mr-2">Kehadiran</span>
                        </div>
                      </Table.HeaderCell>
                      <Table.HeaderCell>Keterangan</Table.HeaderCell>
                      <Table.HeaderCell>Semester</Table.HeaderCell>
                      <Table.HeaderCell>Tahun Ajaran</Table.HeaderCell>
                    </Table.Row>
                  </Table.Header>
                  <Table.Body>
                    <TableLoading
                      count={8}
                      isLoading={isLoading}
                      data={values?.absensi_kehadiran}
                      messageEmpty={
                        "Tidak Terdapat Riwayat Absensi pada tanggal yang dipilih"
                      }
                    >
                      {values?.absensi_kehadiran
                        ?.sort(compareValues("value.siswa.nama_siswa", "asc"))
                        .map((value, index) => (
                          <Table.Row key={index}>
                            <Table.Cell>{index + 1}</Table.Cell>
                            <Table.Cell>
                              <p className="uppercase">
                                {value?.siswa?.nama_siswa}
                              </p>
                            </Table.Cell>

                            <Table.Cell>
                              <div className="flex flex-col">
                                <Dropdown
                                  selection
                                  search
                                  options={izinOptions}
                                  id={`absensi_kehadiran[${index}]kehadiran.id`}
                                  name={`absensi_kehadiran[${index}]kehadiran.id`}
                                  onChange={(e, data) => {
                                    setFieldValue(
                                      `absensi_kehadiran[${index}]kehadiran.id`,
                                      data.value
                                    );
                                    sessionStorageSet(
                                      kelas_id,
                                      mapel_id,
                                      tanggal,
                                      values
                                    );
                                  }}
                                  error={
                                    errors?.absensi_kehadiran?.[index]
                                      ?.kehadiran?.alasan !== undefined &&
                                    errors?.absensi_kehadiran?.[index]
                                      ?.kehadiran?.alasan
                                  }
                                  value={value?.kehadiran?.id}
                                />

                                {errors?.absensi_kehadiran?.[index]?.kehadiran
                                  ?.alasan !== undefined && (
                                  <span className="text-xs font-bold text-red-500 italic">
                                    {
                                      errors?.absensi_kehadiran?.[index]
                                        ?.kehadiran?.alasan
                                    }
                                  </span>
                                )}
                              </div>
                            </Table.Cell>
                            <Table.Cell>
                              <TextArea
                                rows={2}
                                id={`absensi_kehadiran[${index}]keterangan`}
                                name={`absensi_kehadiran[${index}]keterangan`}
                                onChange={(e, data) => {
                                  setFieldValue(
                                    `absensi_kehadiran[${index}]keterangan`,
                                    data.value
                                  );
                                  sessionStorageSet(
                                    kelas_id,
                                    mapel_id,
                                    tanggal,
                                    values
                                  );
                                }}
                                onBlur={handleBlur}
                                type="text"
                                placeholder="Keterangan"
                                value={
                                  value?.keterangan === null
                                    ? ""
                                    : value?.keterangan
                                }
                              />
                            </Table.Cell>
                            <Table.Cell>Semester {value?.semester}</Table.Cell>
                            <Table.Cell>
                              {value?.tahun_ajaran?.nama_tahun_ajaran}
                            </Table.Cell>
                          </Table.Row>
                        ))}
                    </TableLoading>
                  </Table.Body>
                </Table>
                {errors.agenda_kelas !== undefined && (
                  <Message color="red">
                    Lengkapi Semua Form untuk menyimpan
                  </Message>
                )}
                <div className="mb-10">
                  {!isFetching &&
                    (values?.absensi_kehadiran.length === 0 ? (
                      ""
                    ) : (
                      <Button
                        icon={() => <Icon name="save" />}
                        content={isSubmitting ? "Menyimpan" : "Simpan"}
                        type="submit"
                        fluid
                        loading={isSubmitting}
                        size="medium"
                        color="teal"
                        disabled={isSubmitting}
                      />
                    ))}
                </div>
              </section>
            </Form>
          )}
        </Formik>
      </div>
    </LayoutPage>
  );
}

function sessionStorageSet(kelas_id, mapel_id, tanggal, values) {
  sessionStorage.setItem(
    `${kelas_id}_${mapel_id}_${tanggal}`,
    JSON.stringify(values)
  );
}
