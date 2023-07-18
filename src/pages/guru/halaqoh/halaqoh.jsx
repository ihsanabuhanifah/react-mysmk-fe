import React from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { halaqohManualCreate } from "../../../api/guru/absensi";
import { useQuery, useQueryClient } from "react-query";
import { Formik } from "formik";
import { updateAbsensi } from "../../../api/guru/absensi";
import { sho, showFormattedDate } from "../../../utils";

import {
  listBelumAbsensi,
  listHalaqoh,
  updateAbsensiHalaqoh,
} from "../../../api/guru/halaqoh";

import * as Yup from "yup";
import {
  Button,
  Form,
  Table,
  Input,
  Dropdown,
  TextArea,
  Icon,
  Radio,
  Select,
} from "semantic-ui-react";
import LayoutPage from "../../../module/layoutPage";
import {
  halaqohOptions,
  izinOptions,
  tipeHalaqohOptions,
  waktuOptions,
} from "../../../utils/options";
import { formatValue, getOptions } from "../../../utils/format";
import { ErrorMEssage, FormText, TableLoading } from "../../../components";

import { toast } from "react-toastify";
import usePage from "../../../hook/usePage";
import useList from "../../../hook/useList";

let personalSchema = Yup.object().shape({
  tipe: Yup.string()
    .nullable()
    .when("status_kehadiran", {
      is: (id) => {
        if (id === 1) {
          return true;
        }
      },
      then: (id) => Yup.string().nullable().required("wajib disii"),
    }),
  dari_ayat: Yup.string()
    .nullable()
    .when("status_kehadiran", {
      is: (id) => {
        if (id === 1) {
          return true;
        }
      },
      then: (id) => Yup.string().nullable().required("wajib disii"),
    }),
  sampai_ayat: Yup.string()
    .nullable()
    .when("status_kehadiran", {
      is: (id) => {
        if (id === 1) {
          return true;
        }
      },
      then: (id) => Yup.string().nullable().required("wajib disii"),
    }),
  total_halaman: Yup.string()
    .nullable()
    .when("status_kehadiran", {
      is: (id) => {
        if (id === 1) {
          return true;
        }
      },
      then: (id) => Yup.string().nullable().required("wajib disii"),
    }),
  dari_surat: Yup.string()
    .nullable()
    .when("status_kehadiran", {
      is: (id) => {
        if (id === 1) {
          return true;
        }
      },
      then: (id) => Yup.string().nullable().required("wajib disii"),
    }),
  sampai_surat: Yup.string()
    .nullable()
    .when("status_kehadiran", {
      is: (id) => {
        if (id === 1) {
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
  let { tanggal } = useParams();
  let { dataAlquran } = useList();
  let { page, pageSize } = usePage();

  let [tanggalActive, setTanggalActive] = React.useState(tanggal);
  let [halaqoh] = useSearchParams();
  let waktu_halaqoh = halaqoh.get("halaqoh");
  console.log(waktu_halaqoh);
  let [waktu, setWaktu] = React.useState(waktu_halaqoh);

  React.useEffect(() => {
    if (waktu_halaqoh === null) {
      setWaktu("pagi");
    } else {
      setWaktu(waktu_halaqoh);
    }
    setTanggalActive(tanggal);
  }, [waktu_halaqoh]);
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
    pageSize : 20,
    waktu: waktu,
    dariTanggal: tanggal,
    sampaiTanggal: tanggal,
  };
  let { isLoading } = useQuery(
    //query key
    ["absensi_halaqoh", parameter],
    //axios function,triggered when page/pageSize change
    () => listHalaqoh(parameter),
    //configuration
    {
      keepPreviousData: true,
      select: (response) => response.data,
      onSuccess: (data) => {

        let session = sessionStorage.getItem(`halaqoh_${tanggal}`)

        if(session === undefined || session === null){
          setIniitalState({
            ...initialState,
            tanggal: data?.halaqoh?.rows?.[0]?.tanggal,
            halaqoh_id: data?.halaqoh?.rows?.[0]?.halaqoh.id,
            waktu: data?.halaqoh?.rows?.[0]?.waktu,
            absensi_kehadiran: data?.halaqoh?.rows,
          });
        }else{
          session = JSON.parse(session);
          setIniitalState({
            ...initialState,
            tanggal: session?.tanggal,
            halaqoh_id: session?.halaqoh_id,
            waktu: session?.waktu,
            absensi_kehadiran: session?.absensi_kehadiran,
          });
        }
      
      },
    }
  );

  let { data: dataBelumAbsen, isLoading: isLoadingBelumAbsen } = useQuery(
    //query key
    ["belum_absensi_halaqoh", parameter],
    //axios function,triggered when page/pageSize change
    () => listBelumAbsensi(),
    //configuration
    {
      refetchInterval: 1000 * 60 * 60,
      select: (response) => {
        return response.data;
      },
    }
  );

  const creeteJadwal = async () => {
    setLoading(true);
    try {
      const response = await halaqohManualCreate();

      setLoading(false);

      queryClient.invalidateQueries("notifikasi_absensi_halaqoh");
      queryClient.invalidateQueries("absensi_halaqoh");
      queryClient.invalidateQueries("belum_absensi_halaqoh");
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
    try {
      const response = await updateAbsensiHalaqoh(values);
      queryClient.invalidateQueries("absensi");
      
      queryClient.invalidateQueries("notifikasi_absensi_halaqoh");
      sessionStorage.removeItem(`halaqoh_${tanggal}`)
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

  let sessionTes = sessionStorage.getItem(
    `halaqoh_${tanggal}`
  );

  return (
    <LayoutPage title={"Absensi Halaqoh"}>
       {sessionTes !== null ? (<p className="text-red-500 text-lg font-bold">Belum Di Simpen ke Database</p>) : null} 
      <div className="space-x-5 mt-5  ov">
        <section className="grid grid-cols-1 lg:grid-cols-5 2xl:grid-cols-6 gap-5">
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
          <div className="col-span-1 block lg:flex items-center justify-center pt-0 lg:pt-4">
            <Dropdown
              selection
              search
              fluid
              placeholder="Semua"
              options={waktuOptions}
              id="waktu"
              name="waktu"
              onChange={(e, data) => {
                setWaktu(data.value);
              }}
              value={waktu}
            />
          </div>

          <div className=" col-span-1 block lg:flex items-center justify-center pt-0 lg:pt-4">
            <Button
              content={"Filter"}
              type="button"
              fluid
              icon={() => <Icon name="filter" />}
              size="medium"
              color="teal"
              onClick={() => {
                return navigate(`/guru/halaqoh/absensi/${tanggalActive}`);
              }}
            />
          </div>
          <div className=" col-span-1 block lg:flex items-center justify-center pt-0 lg:pt-4">
            <Button
              content={"Buat Absensi"}
              type="submit"
              fluid
              icon={() => <Icon name="add" />}
              loading={loading}
              size="medium"
              color="linkedin"
              disabled={loading}
              onClick={creeteJadwal}
            />
          </div>
          <div className=" col-span-1 block lg:flex items-center justify-center pt-0 lg:pt-4">
            <Button
              content={"Rekap Halaqoh"}
              type="button"
              fluid
              icon={() => <Icon name="newspaper outline" />}
              size="medium"
              color="teal"
              onClick={() => {
                return navigate("/guru/halaqoh/absensi/rekap");
              }}
            />
          </div>
        </section>
      </div>
      <section className="mt-5 h-full " padded>
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
              <h4 className="text-lg font-poopins">
                Absensi untuk Halaqoh :{" "}
                <span className="uppercase">{waktu}</span>
              </h4>
              <div>
                <Table padded striped size="smalll">
                  <Table.Header>
                    <Table.Row>
                      <Table.HeaderCell>No</Table.HeaderCell>
                      <Table.HeaderCell singleLine>Nama</Table.HeaderCell>
                      <Table.HeaderCell>Status Kehadiran</Table.HeaderCell>

                      <Table.HeaderCell singleLine>
                        {" "}
                        Dari surat
                      </Table.HeaderCell>
                      <Table.HeaderCell singleLine>
                        Sampai Surat
                      </Table.HeaderCell>
                      <Table.HeaderCell>Total Halaman</Table.HeaderCell>

                      <Table.HeaderCell>Keterangan</Table.HeaderCell>
                    </Table.Row>
                  </Table.Header>
                  <Table.Body>
                    <TableLoading
                      count={9}
                      isLoading={isLoading}
                      data={values?.absensi_kehadiran}
                      messageEmpty={"Tidak Ada Jadwal Halaqoh"}
                    >
                      {values?.absensi_kehadiran?.map((value, index) => (
                        <Table.Row key={index}>
                          <Table.Cell>{index + 1}</Table.Cell>
                          <Table.Cell singleLine>
                            {value?.siswa?.nama_siswa}
                          </Table.Cell>
                          <Table.Cell>
                            <div className="space-y-5">
                              <div className="flex flex-col">
                                <Dropdown
                                  selection
                                  search
                                  options={halaqohOptions}
                                  id={`absensi_kehadiran[${index}]status_kehadiran`}
                                  name={`absensi_kehadiran[${index}]status_kehadiran`}
                                  onChange={(e, data) => {
                                    setFieldValue(
                                      `absensi_kehadiran[${index}]status_kehadiran`,
                                      data.value
                                    );
                                    setFieldValue(
                                      `absensi_kehadiran[${index}]kehadiran`,
                                      data
                                    );
                                    setFieldValue(
                                      `absensi_kehadiran[${index}]tipe`,
                                      ""
                                    );
                                    setFieldValue(
                                      `absensi_kehadiran[${index}]dari_surat`,
                                      ""
                                    );
                                    setFieldValue(
                                      `absensi_kehadiran[${index}]dari_ayat`,
                                      ""
                                    );
                                    setFieldValue(
                                      `absensi_kehadiran[${index}]sampai_surat`,
                                      ""
                                    );
                                    setFieldValue(
                                      `absensi_kehadiran[${index}]sampai_ayat`,
                                      ""
                                    );
                                    setFieldValue(
                                      `absensi_kehadiran[${index}]total_halaman`,
                                      ""
                                    );
                                    setFieldValue(
                                      `absensi_kehadiran[${index}]keterangan`,
                                      ""
                                    );

                                    sessionStorageSet(tanggal, values);
                                  }}
                                  error={
                                    errors?.absensi_kehadiran?.[index]
                                      ?.kehadiran?.alasan !== undefined &&
                                    errors?.absensi_kehadiran?.[index]
                                      ?.kehadiran?.alasan
                                  }
                                  value={formatValue(value?.status_kehadiran)}
                                />

                                

                                {errors?.absensi_kehadiran?.[index]?.kehadiran
                                  ?.alasan !== undefined && (
                                  <ErrorMEssage>
                                    {
                                      errors?.absensi_kehadiran?.[index]
                                        ?.kehadiran?.alasan
                                    }
                                  </ErrorMEssage>
                                )}
                              </div>
                              <div className="flex flex-col">
                                <Dropdown
                                  selection
                                  search
                                  placeholder="Tipe Setoran"
                                  options={tipeHalaqohOptions}
                                  id={`absensi_kehadiran[${index}]tipe`}
                                  name={`absensi_kehadiran[${index}]tipe`}
                                  onChange={(e, data) => {
                                    setFieldValue(
                                      `absensi_kehadiran[${index}]tipe`,
                                      data.value
                                    );
                                    sessionStorageSet(tanggal, values);
                                  }}
                                  error={
                                    errors?.absensi_kehadiran?.[index]?.tipe &&
                                    touched?.absensi_kehadiran?.[index]?.tipe
                                  }
                                  value={formatValue(value?.tipe)}
                                />

                                {errors?.absensi_kehadiran?.[index]?.tipe &&
                                  touched?.absensi_kehadiran?.[index]?.tipe && (
                                    <ErrorMEssage>
                                      {errors?.absensi_kehadiran?.[index]?.tipe}
                                    </ErrorMEssage>
                                  )}
                              </div>
                            </div>
                          </Table.Cell>

                          <Table.Cell singleLine width={"sixteen"}>
                            <div className="space-y-5">
                              <div className="text-left">
                                <Form.Field
                                  control={Select}
                                  disabled={value?.status_kehadiran !== 1}
                                  // value={absen?.nama_guru}
                                  options={getOptions(
                                    dataAlquran?.data,
                                    "nama_surat"
                                  )}
                                  onChange={(event, data) => {
                                    console.log(data);
                                    setFieldValue(
                                      `absensi_kehadiran[${index}]dari_surat`,
                                      data.value
                                    );
                                    sessionStorageSet(tanggal, values);
                                  }}
                                  placeholder="Dari Surat"
                                  search
                                  value={formatValue(value?.dari_surat)}
                                  clearable
                                  fluid
                                  error={
                                    errors?.absensi_kehadiran?.[index]
                                      ?.dari_surat &&
                                    touched?.absensi_kehadiran?.[index]
                                      ?.dari_surat
                                  }
                                />
                                {errors?.absensi_kehadiran?.[index]
                                  ?.dari_surat &&
                                  touched?.absensi_kehadiran?.[index]
                                    ?.dari_surat && (
                                    <ErrorMEssage>
                                      {
                                        errors?.absensi_kehadiran?.[index]
                                          ?.dari_surat
                                      }
                                    </ErrorMEssage>
                                  )}
                              </div>
                              <FormText>
                                <Input
                                  disabled={value?.status_kehadiran !== 1}
                                  id={`absensi_kehadiran[${index}]dari_ayat`}
                                  name={`absensi_kehadiran[${index}]dari_ayat`}
                                  onChange={(e, data) => {
                                    setFieldValue(
                                      `absensi_kehadiran[${index}]dari_ayat`,
                                      data.value
                                    );
                                    sessionStorageSet(tanggal, values);
                                  }}
                                  onBlur={handleBlur}
                                  type="number"
                                  value={formatValue(value?.dari_ayat)}
                                  placeholder="Dari Ayat"
                                  error={
                                    errors?.absensi_kehadiran?.[index]
                                      ?.dari_ayat &&
                                    touched?.absensi_kehadiran?.[index]
                                      ?.dari_ayat
                                  }
                                />
                                {errors?.absensi_kehadiran?.[index]
                                  ?.dari_ayat &&
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
                              <div className="text-left">
                                <Form.Field
                                  disabled={value?.status_kehadiran !== 1}
                                  control={Select}
                                  // value={absen?.nama_guru}
                                  options={getOptions(
                                    dataAlquran?.data,
                                    "nama_surat"
                                  )}
                                  onChange={(event, data) => {
                                    setFieldValue(
                                      `absensi_kehadiran[${index}]sampai_surat`,
                                      data?.value
                                    );
                                    sessionStorageSet(tanggal, values)
                                  }}
                                  placeholder="Sampai Surat"
                                  search
                                  value={formatValue(value?.sampai_surat)}
                                  clearable
                                  fluid
                                  error={
                                    errors?.absensi_kehadiran?.[index]
                                      ?.sampai_surat &&
                                    touched?.absensi_kehadiran?.[index]
                                      ?.sampai_surat
                                  }
                                />
                                {errors?.absensi_kehadiran?.[index]
                                  ?.sampai_surat &&
                                  touched?.absensi_kehadiran?.[index]
                                    ?.sampai_surat && (
                                    <ErrorMEssage>
                                      {
                                        errors?.absensi_kehadiran?.[index]
                                          ?.sampai_surat
                                      }
                                    </ErrorMEssage>
                                  )}
                              </div>
                              <FormText>
                                <Input
                                  disabled={value?.status_kehadiran !== 1}
                                  id={`absensi_kehadiran[${index}]sampai_ayat`}
                                  name={`absensi_kehadiran[${index}]sampai_ayat`}
                                  onChange={(e, data) => {
                                    setFieldValue(
                                      `absensi_kehadiran[${index}]sampai_ayat`,
                                      data.value
                                    );
                                    sessionStorageSet(tanggal, values);
                                  }}
                                  onBlur={handleBlur}
                                  type="number"
                                  value={formatValue(value?.sampai_ayat)}
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
                                disabled={value?.status_kehadiran !== 1}
                                id={`absensi_kehadiran[${index}]total_halaman`}
                                name={`absensi_kehadiran[${index}]total_halaman`}
                                onChange={(e, data) => {
                                  setFieldValue(
                                    `absensi_kehadiran[${index}]total_halaman`,
                                    data.value
                                  );
                                  sessionStorageSet(tanggal, values);
                                }}
                                onBlur={handleBlur}
                                placeholder="Total Halaman"
                                value={formatValue(value?.total_halaman)}
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
                            <TextArea
                              disabled={value?.status_kehadiran !== 1}
                              rows={4}
                              id={`absensi_kehadiran[${index}]keterangan`}
                              name={`absensi_kehadiran[${index}]keterangan`}
                              onChange={(e, data) => {
                                setFieldValue(
                                  `absensi_kehadiran[${index}]keterangan`,
                                  data.value
                                );
                                sessionStorageSet(tanggal, values);
                              }}
                              onBlur={handleBlur}
                              type="text"
                              placeholder="Keterangan"
                              value={formatValue(value?.keterangan)}
                            />
                          </Table.Cell>
                        </Table.Row>
                      ))}
                    </TableLoading>
                  </Table.Body>
                </Table>
              </div>
              <div className="mb-10 mt-5 w-full">
                {values?.absensi_kehadiran.length > 0 && (
                  <Button
                    content={isSubmitting ? "Menyimpan" : "Simpan"}
                    type="submit"
                    fluid
                    loading={isSubmitting}
                    size="medium"
                    color="teal"
                    icon={() => <Icon name="save" />}
                    disabled={isSubmitting}
                  />
                )}
              </div>
              <section className="">
                <h3 className="text-2xl font-poppins">
                  List Musyrif Belum Absensi
                </h3>
                <Table celled selectable>
                  <Table.Header>
                    <Table.Row>
                      <Table.HeaderCell>No</Table.HeaderCell>
                      <Table.HeaderCell>Tanggal</Table.HeaderCell>
                      <Table.HeaderCell>Nama Musyrif</Table.HeaderCell>

                      <Table.HeaderCell>Waktu</Table.HeaderCell>
                      <Table.HeaderCell>Tahun Ajaran</Table.HeaderCell>
                    </Table.Row>
                  </Table.Header>
                  <Table.Body>
                    <TableLoading
                      count={8}
                      isLoading={isLoadingBelumAbsen}
                      data={dataBelumAbsen?.data}
                      messageEmpty={"Tidak Ada Guru Belum Absen"}
                    >
                      {dataBelumAbsen?.halaqoh?.map((value, index) => (
                        <Table.Row key={index}>
                          <Table.Cell>{index + 1}</Table.Cell>
                          <Table.Cell>
                            {showFormattedDate(value?.tanggal)}
                          </Table.Cell>
                          <Table.Cell>
                            {value?.halaqoh?.teacher?.nama_guru}
                          </Table.Cell>
                          <Table.Cell>{value?.waktu}</Table.Cell>
                          <Table.Cell>
                            {value?.halaqoh?.tahun_ajaran?.nama_tahun_ajaran}
                          </Table.Cell>
                        </Table.Row>
                      ))}
                    </TableLoading>
                  </Table.Body>
                </Table>
              </section>
            </form>
          )}
        </Formik>
      </section>
    </LayoutPage>
  );
}

function sessionStorageSet(tanggal, values) {
  sessionStorage.setItem(`halaqoh_${tanggal}`, JSON.stringify(values));
}
