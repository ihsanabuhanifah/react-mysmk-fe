import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { halaqohManualCreate, listAbsensi } from "../../../api/guru/absensi";
import { useQuery, useQueryClient } from "react-query";
import { Formik } from "formik";
import { updateAbsensi } from "../../../api/guru/absensi";
import { listMapel, listKelas } from "../../../api/list";
import { listHalaqoh } from "../../../api/guru/halaqoh";
import { listAlquranOptions } from "../../../api/list";
import * as Yup from "yup";
import {
 
  Button,
  Form,
  Table,
  Input,
  Dropdown,
  TextArea,
} from "semantic-ui-react";
import LayoutPage from "../../../module/layoutPage";
import { izinOptions } from "../../../utils/options";
import {
  ReactSelectAsync,
  ErrorMEssage,
  FormText,
  TableLoading,
} from "../../../components";

import { toast } from "react-toastify";

let personalSchema = Yup.object().shape({
  dari_ayat: Yup.number().typeError("Wajib angka").required("wajib disii"),
  sampai_ayat: Yup.number().typeError("Wajib angka").required("wajib disii"),
  total_halaman: Yup.number().typeError("Wajib angka").required("wajib disii"),
  surat_awal: Yup.object()
    .shape({
      label: Yup.string(),
      value: Yup.string(),
    })
    .nullable()
    .required("wajib dipilih"),
  surat_akhir: Yup.object()
    .shape({
      label: Yup.string(),
      value: Yup.string(),
    })
    .nullable()
    .required("wajib dipilih"),
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
export default function AbsensiHalaqoh() {
  let { kelas_id, mapel_id, tanggal } = useParams();

  let [page, setPage] = React.useState(1);
  let [pageSize, setPageSize] = React.useState(10);
  let [dariTanggal, setDariTanggal] = React.useState(tanggal);
  let [sampaiTanggal, setSampaiTanggal] = React.useState(tanggal);
  let [tanggalActive, setTanggalActive] = React.useState(tanggal);
  let [kelas, setKelas] = React.useState(kelas_id);
  let [mapel, setMapel] = React.useState(mapel_id);
  const [loading, setLoading] = React.useState(false);

  let queryClient = useQueryClient();
  const [initialState, setIniitalState] = React.useState({
    tanggal: "",
    halaqoh_id: "",
    waktu: "",
    absensi_kehadiran: [],
  });
  let navigate = useNavigate();

  let parameter = {
    page,
    pageSize,
    dariTanggal: tanggal,
    sampaiTanggal: tanggal,
  };
  let { isLoading, isError, data, isFetching } = useQuery(
    //query key
    ["absensi", parameter],
    //axios function,triggered when page/pageSize change
    () => listHalaqoh(parameter),
    //configuration
    {
      keepPreviousData: true,
      select: (response) => response.data,
      onSuccess: (data) => {
        setIniitalState({
          ...initialState,
          tanggal: data?.halaqoh?.rows?.[0]?.tanggal,
          halaqoh_id: data?.halaqoh?.rows?.[0]?.halaqoh.id,
          waktu: data?.halaqoh?.rows?.[0]?.waktu,
          absensi_kehadiran: data?.halaqoh?.rows,
        });
      },
    }
  );
  console.log("dddd", data);

  const creeteJadwal = async () => {
    setLoading(true);
    try {
      const response = await halaqohManualCreate();

      setLoading(false);
      queryClient.invalidateQueries("jadwal");
      queryClient.invalidateQueries("notifikasi_absensi_halaqoh");
      queryClient.invalidateQueries("absensi");
      queryClient.invalidateQueries("notifikasi_absensi_kelas");
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
      setLoading(false);
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
  const onSubmit = async (values) => {
    const result = await updateAbsensi(values);
    queryClient.invalidateQueries("absensi");
    queryClient.invalidateQueries("notifikasi");

    return console.log("hasil", result);
  };

  //   console.log(initialState);

  React.useEffect(() => {
    setDariTanggal(tanggal);
    setSampaiTanggal(tanggal);
  }, [tanggal]);

  console.log("datahalaqoh", initialState);

  return (
    <LayoutPage title={"Absensi Halaqoh"}>
      <div className="space-x-5 mt-5">
        <section className="grid grid-cols-1 lg:grid-cols-4 gap-5">
          <div className=" col-span-1 lg:col-span-2">
            <Form.Field
              control={Input}
              label="Tanggal"
              name="email"
              fluid
              onChange={(e) => {
                setTanggalActive(e.target.value);
              }}
              value={tanggalActive}
              type="date"
            />
          </div>

          <div className=" col-span-1 block lg:flex items-center justify-center pt-0 lg:pt-4">
            <Button
              content={"Filter"}
              type="button"
              fluid
              size="medium"
              color="teal"
              onClick={() => {
                return navigate(`/guru/halaqoh/absensi/${tanggalActive}`);
              }}
            />
          </div>
          <div className=" col-span-1 block lg:flex items-center justify-center pt-0 lg:pt-4">
            <Button
              content={"Buat Absensi Halaqoh"}
              type="submit"
              fluid
              loading={loading}
              size="medium"
              color="teal"
              disabled={loading}
              onClick={creeteJadwal}
            />
          </div>
        </section>
      </div>
      <section className="mt-5" style={{ overflow: "auto" }} padded>
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
            <form onSubmit={handleSubmit}>
              <Table padded striped size="smalll">
                <Table.Header>
                  <Table.Row>
                    <Table.HeaderCell>No</Table.HeaderCell>
                    <Table.HeaderCell singleLine>Nama</Table.HeaderCell>
                    <Table.HeaderCell singleLine> Dari surat</Table.HeaderCell>
                    <Table.HeaderCell singleLine>Sampai Surat</Table.HeaderCell>
                    <Table.HeaderCell>Total Halaman</Table.HeaderCell>
                    <Table.HeaderCell>Status Kehadiran</Table.HeaderCell>
                    <Table.HeaderCell>Keterangan</Table.HeaderCell>
                  </Table.Row>
                </Table.Header>
                <Table.Body>
                  <TableLoading
                    count={9}
                    isLoading={isLoading}
                    data={values?.absensi_kehadiran}
                    messageEmpty={"Tidak Ada Jadwal Halaqo"}
                  >
                    {values?.absensi_kehadiran?.map((value, index) => (
                      <Table.Row key={index}>
                        <Table.Cell>{index + 1}</Table.Cell>
                        <Table.Cell singleLine>
                          {value?.siswa?.nama_siswa}
                        </Table.Cell>
                        <Table.Cell singleLine width={"sixteen"}>
                          <div className="space-y-5">
                            <FormText>
                              <ReactSelectAsync
                                debounceTimeout={300}
                                value={value?.surat_awal}
                                loadOptions={listAlquranOptions}
                                onChange={(value) => {
                                  console.log(value);
                                  setFieldValue(
                                    `absensi_kehadiran[${index}]surat_awal`,
                                    value
                                  );
                                }}
                                error={
                                  errors?.absensi_kehadiran?.[index]
                                    ?.surat_awal &&
                                  touched?.absensi_kehadiran?.[index]
                                    ?.surat_awal
                                }
                                placeholder="Pilih Surat"
                                additional={{
                                  page: 1,
                                }}
                              />
                              {errors?.absensi_kehadiran?.[index]?.surat_awal &&
                                touched?.absensi_kehadiran?.[index]
                                  ?.surat_awal && (
                                  <ErrorMEssage>
                                    {
                                      errors?.absensi_kehadiran?.[index]
                                        ?.surat_awal
                                    }
                                  </ErrorMEssage>
                                )}
                            </FormText>
                            <FormText>
                              <Input
                                id={`absensi_kehadiran[${index}]dari_ayat`}
                                name={`absensi_kehadiran[${index}]dari_ayat`}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                type="number"
                                value={value?.dari_ayat}
                                placeholder="Dari Ayat"
                                error={
                                  errors?.absensi_kehadiran?.[index]
                                    ?.dari_ayat &&
                                  touched?.absensi_kehadiran?.[index]?.dari_ayat
                                }
                              />
                              {errors?.absensi_kehadiran?.[index]?.dari_ayat &&
                                touched?.absensi_kehadiran?.[index]
                                  ?.dari_ayat && (
                                  <ErrorMEssage>
                                    {
                                      errors?.absensi_kehadiran?.[index]
                                        ?.dari_ayat
                                    }
                                  </ErrorMEssage>
                                )}
                            </FormText>
                          </div>
                        </Table.Cell>

                        <Table.Cell width={10} singleLine>
                          <div className="space-y-5">
                            <FormText>
                              <ReactSelectAsync
                                debounceTimeout={300}
                                value={value?.surat_akhir}
                                loadOptions={listAlquranOptions}
                                onChange={(value) => {
                                  console.log(value);
                                  setFieldValue(
                                    `absensi_kehadiran[${index}]surat_akhir`,
                                    value
                                  );
                                }}
                                error={
                                  errors?.absensi_kehadiran?.[index]
                                    ?.surat_akhir &&
                                  touched?.absensi_kehadiran?.[index]
                                    ?.surat_akhir
                                }
                                placeholder="Pilih Surat"
                                additional={{
                                  page: 1,
                                }}
                              />
                              {errors?.absensi_kehadiran?.[index]
                                ?.surat_akhir &&
                                touched?.absensi_kehadiran?.[index]
                                  ?.surat_akhir && (
                                  <ErrorMEssage>
                                    {
                                      errors?.absensi_kehadiran?.[index]
                                        ?.surat_akhir
                                    }
                                  </ErrorMEssage>
                                )}
                            </FormText>
                            <FormText>
                              <Input
                                id={`absensi_kehadiran[${index}]sampai_ayat`}
                                name={`absensi_kehadiran[${index}]sampai_ayat`}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                type="number"
                                value={value?.sampai_ayat}
                                placeholder="Sampai Ayat"
                                error={
                                  errors?.absensi_kehadiran?.[index]
                                    ?.sampai_ayat &&
                                  touched?.absensi_kehadiran?.[index]
                                    ?.sampai_ayat
                                }
                              />
                              {errors?.absensi_kehadiran?.[index]
                                ?.sampai_ayat &&
                                touched?.absensi_kehadiran?.[index]
                                  ?.sampai_ayat && (
                                  <ErrorMEssage>
                                    {
                                      errors?.absensi_kehadiran?.[index]
                                        ?.sampai_ayat
                                    }
                                  </ErrorMEssage>
                                )}
                            </FormText>
                          </div>
                        </Table.Cell>

                        <Table.Cell>
                          <FormText>
                            <Input
                              id={`absensi_kehadiran[${index}]total_halaman`}
                              name={`absensi_kehadiran[${index}]total_halaman`}
                              onChange={handleChange}
                              onBlur={handleBlur}
                              value={value?.total_halaman}
                              error={
                                errors?.absensi_kehadiran?.[index]
                                  ?.total_halaman &&
                                touched?.absensi_kehadiran?.[index]
                                  ?.total_halaman
                              }
                            />
                            {errors?.absensi_kehadiran?.[index]
                              ?.total_halaman &&
                              touched?.absensi_kehadiran?.[index]
                                ?.total_halaman && (
                                <ErrorMEssage>
                                  {
                                    errors?.absensi_kehadiran?.[index]
                                      ?.total_halaman
                                  }
                                </ErrorMEssage>
                              )}
                          </FormText>
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
                              }}
                              error={
                                errors?.absensi_kehadiran?.[index]?.kehadiran
                                  ?.alasan !== undefined &&
                                errors?.absensi_kehadiran?.[index]?.kehadiran
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
                            rows={4}
                            id={`absensi_kehadiran[${index}]keterangan`}
                            name={`absensi_kehadiran[${index}]keterangan`}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            type="text"
                            placeholder="Keterangan"
                            value={value?.keterangan}
                          />
                        </Table.Cell>
                      </Table.Row>
                    ))}
                  </TableLoading>
                </Table.Body>
              </Table>
              <div className="mb-10">
                {!isFetching && (
                  <Button
                    content={isSubmitting ? "Menyimpan" : "Simpan"}
                    type="submit"
                    fluid
                    loading={isSubmitting}
                    size="medium"
                    color="teal"
                    disabled={isSubmitting}
                  />
                )}
              </div>
            </form>
          )}
        </Formik>
      </section>
    </LayoutPage>
  );
}
