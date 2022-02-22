import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { listAbsensi } from "../../api/guru/absensi";
import { useQuery, useQueryClient } from "react-query";
import { Formik } from "formik";
import { updateAbsensi } from "../../api/guru/absensi";
import { listMapel, listKelas } from "../../api/list";
import { listHalaqoh } from "../../api/guru/halaqoh";
import { listAlquranOptions } from "../../api/list";
import * as Yup from "yup";
import {
  Input,
  ReactSelectAsync,
  Select,
  Button,
  ErrorMEssage,
  FormText,
} from "../../components";

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

  const onSubmit = async (values) => {
    return console.log(values);
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
          <table className="table-fixed">
            <thead>
              <tr>
                <th>No</th>
                <th>Nama</th>
                <th>Dari surat</th>
                <th>Dari Ayat</th>
                <th>Sampai Surat</th>
                <th>Sampai Ayat</th>
                <th>Total Halaman</th>
                <th>Status Kehadiran</th>
                <th>Keterangan</th>
              </tr>
            </thead>
            <tbody>
              {values?.absensi_kehadiran?.length === 0 ? (
                <tr>
                  <td colSpan={8}>Tidak ditemukan jadwal </td>
                </tr>
              ) : (
                values?.absensi_kehadiran?.map((value, index) => (
                  <tr key={index}>
                    <td>{index + 1}</td>
                    <td>
                      <Input
                        disabled
                        type="text"
                        defaultValue={value?.siswa?.nama_siswa}
                      />
                    </td>
                    <td>
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
                            errors?.absensi_kehadiran?.[index]?.surat_awal &&
                            touched?.absensi_kehadiran?.[index]?.surat_awal
                          }
                          placeholder="Pilih Surat"
                          additional={{
                            page: 1,
                          }}
                        />
                        {errors?.absensi_kehadiran?.[index]?.surat_awal &&
                          touched?.absensi_kehadiran?.[index]?.surat_awal && (
                            <ErrorMEssage>
                              {errors?.absensi_kehadiran?.[index]?.surat_awal}
                            </ErrorMEssage>
                          )}
                      </FormText>
                    </td>
                    <td>
                      <FormText>
                        <Input
                          id={`absensi_kehadiran[${index}]dari_ayat`}
                          name={`absensi_kehadiran[${index}]dari_ayat`}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          type="number"
                          value={value?.dari_ayat}
                          placeholder="Dari Ayat"
                          onBlur={handleBlur}
                          error={
                            errors?.absensi_kehadiran?.[index]?.dari_ayat &&
                            touched?.absensi_kehadiran?.[index]?.dari_ayat
                          }
                        />
                        {errors?.absensi_kehadiran?.[index]?.dari_ayat &&
                          touched?.absensi_kehadiran?.[index]?.dari_ayat && (
                            <ErrorMEssage>
                              {errors?.absensi_kehadiran?.[index]?.dari_ayat}
                            </ErrorMEssage>
                          )}
                      </FormText>
                    </td>

                    <td>
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
                            errors?.absensi_kehadiran?.[index]?.surat_akhir &&
                            touched?.absensi_kehadiran?.[index]?.surat_akhir
                          }
                          placeholder="Pilih Surat"
                          additional={{
                            page: 1,
                          }}
                        />
                        {errors?.absensi_kehadiran?.[index]?.surat_awal &&
                          touched?.absensi_kehadiran?.[index]?.surat_awal && (
                            <ErrorMEssage>
                              {errors?.absensi_kehadiran?.[index]?.surat_awal}
                            </ErrorMEssage>
                          )}
                      </FormText>
                    </td>
                    <td>
                      <FormText>
                        <Input
                          id={`absensi_kehadiran[${index}]sampai_ayat`}
                          name={`absensi_kehadiran[${index}]sampai_ayat`}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          type="number"
                          value={value?.sampai_ayat}
                          placeholder="Sampai Ayat"
                          onBlur={handleBlur}
                          error={
                            errors?.absensi_kehadiran?.[index]?.sampai_ayat &&
                            touched?.absensi_kehadiran?.[index]?.sampai_ayat
                          }
                        />
                        {errors?.absensi_kehadiran?.[index]?.sampai_ayat &&
                          touched?.absensi_kehadiran?.[index]?.sampai_ayat && (
                            <ErrorMEssage>
                              {errors?.absensi_kehadiran?.[index]?.sampai_ayat}
                            </ErrorMEssage>
                          )}
                      </FormText>
                    </td>

                    <td>
                      <FormText>
                        <Input
                          id={`absensi_kehadiran[${index}]total_halaman`}
                          name={`absensi_kehadiran[${index}]total_halaman`}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          type="number"
                          value={value?.total_halaman}
                          placeholder="Total Halaman"
                          onBlur={handleBlur}
                          error={
                            errors?.absensi_kehadiran?.[index]?.total_halaman &&
                            touched?.absensi_kehadiran?.[index]?.total_halaman
                          }
                        />
                        {errors?.absensi_kehadiran?.[index]?.total_halaman &&
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
                    </td>

                    <td>
                      <Select
                        id={`absensi_kehadiran[${index}]kehadiran.id`}
                        name={`absensi_kehadiran[${index}]kehadiran.id`}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        error={
                          errors?.absensi_kehadiran?.[index]?.kehadiran
                            ?.alasan &&
                          touched?.absensi_kehadiran?.[index]?.kehadiran?.alasan
                        }
                        value={value?.kehadiran?.id}
                      >
                        <option value={1}>Hadir</option>
                        <option value={2}>Sakit</option>
                        <option value={3}>Izin Pulang</option>
                        <option value={4}>Dispensasi</option>
                        <option value={5}>Tanpa Keterangan</option>
                        <option value={6}>Belum Absensi</option>
                      </Select>

                      {errors?.absensi_kehadiran?.[index]?.kehadiran?.alasan !==
                        undefined && (
                        <ErrorMEssage>
                          {
                            errors?.absensi_kehadiran?.[index]?.kehadiran
                              ?.alasan
                          }
                        </ErrorMEssage>
                      )}
                    </td>
                    <td>
                      <Input
                        id={`absensi_kehadiran[${index}]keterangan`}
                        name={`absensi_kehadiran[${index}]keterangan`}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        type="text"
                        value={value?.keterangan}
                        placeholder="Keterangan"
                      />
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
          <Button type="submit">{isSubmitting ? "Meyimpan" : "Simpan"}</Button>
        </form>
      )}
    </Formik>
  );
}
