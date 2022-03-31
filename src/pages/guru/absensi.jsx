import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { listAbsensi } from "../../api/guru/absensi";
import { useQuery, useQueryClient } from "react-query";
import { Formik } from "formik";
import { updateAbsensi } from "../../api/guru/absensi";
import { listMapel, listKelas } from "../../api/list";
import { TableLoading } from "../../components";
import {
  Input,
  Table,
  Select,
  Form,
  Button,
  Segment,
  Header,
  TextArea,
  Dropdown,
} from "semantic-ui-react";
import { getOptions } from "../../utils/format";
import { izinOptions } from "../../utils/options";
import LayoutPage from "../../module/layoutPage";
import * as Yup from "yup";

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

let AbsensiSchema = Yup.object().shape({
  absensi_kehadiran: Yup.array().of(personalSchema),
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
      select: (response) => response.data,
      onSuccess: (data) => {
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
      },
    }
  );
  let { data: dataMapel } = useQuery(
    //query key
    ["list_mapel"],
    //axios function,triggered when page/pageSize change
    () => listMapel(),
    //configuration
    {
      keepPreviousData: true,
      staleTime: 60 * 1000 * 60 * 12, // 12 jam,
      select: (response) => response.data,
    }
  );
  let { data: dataKelas } = useQuery(
    //query key
    ["list_kelas"],
    //axios function,triggered when page/pageSize change
    () => listKelas(),
    //configuration
    {
      keepPreviousData: true,
      staleTime: 60 * 1000 * 60 * 12, // 12 jam,
      select: (response) => response.data,
    }
  );

  const onSubmit = async (values) => {
    const result = await updateAbsensi(values);
    queryClient.invalidateQueries("absensi");
    queryClient.invalidateQueries("notifikasi");
  };

  //   console.log(initialState);

  React.useEffect(() => {
    setDariTanggal(tanggal);
    setSampaiTanggal(tanggal);
    setTanggalActive(tanggal);
  }, [tanggal]);

  return (
    <LayoutPage title={"Agenda Mengajar"}>
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
            <Segment>
              <section className="grid grid-cols-7 gap-5">
                {/* <Input
                type="date"
                value={tanggalActive}
                placeholder="tanggal"
                onChange={(e) => {
                  setTanggalActive(e.target.value);
                }}
              /> */}

                <div className="col-span-2">
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

                <div className=" flex items-center justify-center pt-4">
                  <Button
                    content={"Filter"}
                    type="button"
                    fluid
                    size="medium"
                    color="green"
                    onClick={() => {
                      return navigate(
                        `/guru/jadwal/absensi/${kelas}/${mapel}/${tanggalActive}`
                      );
                    }}
                  />
                </div>
              </section>
            </Segment>
            {!isFetching && (
              <div>
                <Segment raised>
                  <Header as={"h3"}>Materi</Header>
                  {values?.agenda_kelas?.map((value, index) => (
                    <React.Fragment key={index}>
                      <div>
                        <Form.Field
                          control={Input}
                          label={`Jam ke-${value?.jam_ke}`}
                          placeholder="Materi"
                          name={`agenda_kelas[${index}]materi`}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          value={value?.materi}
                          disabled={isSubmitting}
                          fluid
                          type="email"
                        />
                      </div>
                    </React.Fragment>
                  ))}
                </Segment>
              </div>
            )}
            <Segment raised content>
              <Header as={"h3"}>Absensi Kelas</Header>
              <Table>
                <Table.Header>
                  <Table.Row>
                    <Table.HeaderCell>No</Table.HeaderCell>
                    <Table.HeaderCell>Nama</Table.HeaderCell>
                    <Table.HeaderCell>Kelas</Table.HeaderCell>
                    <Table.HeaderCell>Mata Pelajaran</Table.HeaderCell>
                    <Table.HeaderCell>
                      <div className="flex items-center">
                        {" "}
                        <span className="mr-2">Kehadiran</span>
                        <input
                          onChange={(e) => {
                            if (e.target.checked) {
                              let kehadiran = [];
                              values?.absensi_kehadiran?.map((value) => {
                                value.kehadiran.id = 1;

                                kehadiran.push(value);
                              });

                              setFieldValue("absensi_kehadiran", kehadiran);
                            }
                          }}
                          type="checkbox"
                        />
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
                    isLoading={isFetching}
                    data={values?.absensi_kehadiran}
                    messageEmpty={"Tidak Ada Jadwal Pelajaran"}
                  >
                    {values?.absensi_kehadiran?.map((value, index) => (
                      <Table.Row key={index}>
                        <Table.Cell>{index + 1}</Table.Cell>
                        <Table.Cell>{value?.siswa?.nama_siswa}</Table.Cell>
                        <Table.Cell>{value?.kelas?.nama_kelas}</Table.Cell>
                        <Table.Cell>{value?.mapel?.nama_mapel}</Table.Cell>
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
                              }}
                              errors={
                                errors?.absensi_kehadiran?.[index]?.kehadiran
                                  ?.alasan &&
                                touched?.absensi_kehadiran?.[index]?.kehadiran
                                  ?.alasan
                              }
                              value={value?.kehadiran?.id}
                            />

                            {errors?.absensi_kehadiran?.[index]?.kehadiran
                              ?.alasan !== undefined && (
                              <span className="text-xs font-bold text-red-500 italic">
                                {
                                  errors?.absensi_kehadiran?.[index]?.kehadiran
                                    ?.alasan
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
                            onChange={handleChange}
                            onBlur={handleBlur}
                            type="text"
                            placeholder="Keterangan"
                            value={value?.keterangan}
                          />
                        </Table.Cell>
                        <Table.Cell>semester {value?.semester}</Table.Cell>
                        <Table.Cell>
                          {value?.tahun_ajaran?.nama_tahun_ajaran}
                        </Table.Cell>
                      </Table.Row>
                    ))}
                  </TableLoading>
                </Table.Body>
              </Table>
            </Segment>
            <div>
              {!isFetching && (
                <Button
                  content={isSubmitting ? "Menyimpan" : "Simpan"}
                  type="submit"
                  fluid
                  size="medium"
                  color="green"
                  disabled={isSubmitting}
                />
              )}
            </div>
          </Form>
        )}
      </Formik>
    </LayoutPage>
  );
}
