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
import { Input, ReactSelectAsync } from "../../components";

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
    const result = await updateAbsensi(values);
    queryClient.invalidateQueries("absensi");
    queryClient.invalidateQueries("notifikasi");

    return console.log("hasil", result);
  };

  //   console.log(initialState);

  React.useEffect(() => {
    console.log("jalan");
    setDariTanggal(tanggal);
    setSampaiTanggal(tanggal);
  }, [tanggal]);

  console.log("datahalaqoh", data);
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
                <th>Juz Ke</th>
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
                      <div className="w-1/3">
                        <ReactSelectAsync
                          debounceTimeout={300}
                          value={{
                            value: value?.surat_awal?.id,
                            label: value?.surat_awal?.nama_surat,
                          }}
                          loadOptions={listAlquranOptions}
                          onChange={() => {
                            console.log("tes");
                          }}
                          additional={{
                            page: 1,
                          }}
                        />
                      </div>
                    </td>
                    <td>
                      <Input
                        disabled
                        type="text"
                        defaultValue={value?.dari_ayat}
                      />
                    </td>
                    <td>
                      <ReactSelectAsync
                        debounceTimeout={300}
                        value={{
                          value: value?.surat_akhir?.id,
                          label: value?.surat_akhir?.nama_surat,
                        }}
                        loadOptions={listAlquranOptions}
                        onChange={() => {
                          console.log("tes");
                        }}
                        additional={{
                          page: 1,
                        }}
                      />
                    </td>
                    <td>
                      <Input type="text" defaultValue={value?.sampai_ayat} />
                    </td>
                    <td>
                      <Input type="text" defaultValue={value?.total_halaman} />
                    </td>
                    <td>
                      <select
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
                      </select>

                      {errors?.absensi_kehadiran?.[index]?.kehadiran?.alasan !==
                        undefined && (
                        <span className="text-xs font-bold text-red-500 italic">
                          {
                            errors?.absensi_kehadiran?.[index]?.kehadiran
                              ?.alasan
                          }
                        </span>
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
                      />
                    </td>

                    <td>
                      <Input
                        placeholder="keterangan"
                        type="text"
                        defaultValue={value?.tahun_ajaran?.nama_tahun_ajaran}
                      />
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
          <button type="submit">{isSubmitting ? "Meyimpan" : "Simpan"}</button>
        </form>
      )}
    </Formik>
  );
}
