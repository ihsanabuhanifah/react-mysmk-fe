import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { listAbsensi } from "../../api/guru/absensi";
import { useQuery, useQueryClient } from "react-query";
import { Formik } from "formik";
import { updateAbsensi } from "../../api/guru/absensi";
import * as Yup from "yup";
export default function Absensi() {
  let [page, setPage] = React.useState(1);
  let [pageSize, setPageSize] = React.useState(10);
  let [dariTanggal, setDariTanggal] = React.useState("2022-02-17");
  let [sampaiTanggal, setSampaiTanggal] = React.useState("2022-02-17");
  let { kelas_id, mapel_id } = useParams();
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
          tanggal: data?.absensi?.[0].tanggal,
          semester: data?.absensi?.[0].semester,
          ta_id: data?.absensi?.[0]?.tahun_ajaran?.id,
          kelas_id: data?.absensi?.[0]?.kelas?.id,
          mapel_id: data?.absensi?.[0]?.mapel?.id,
          absensi_kehadiran: data?.absensi,
          agenda_kelas: data?.agenda,
        });
      },
    }
  );

  const onSubmit = async (values) => {
    const result = await updateAbsensi(values);
    queryClient.invalidateQueries("absensi");

    return console.log("hasil", result);
  };

  //   console.log(initialState);
  return (
    <Formik
      initialValues={initialState}
      //   validationSchema={LoginSchema}
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
                <th>Kelas</th>
                <th>Mata Pelajaran</th>
                <th>Kehadiran</th>
                <th>Keterangan</th>
                <th>Semester</th>
                <th>Tahun Ajaran</th>
              </tr>
            </thead>
            <tbody>
              {values?.absensi_kehadiran?.map((value, index) => (
                <tr key={index}>
                  <td>{index + 1}</td>
                  <td>
                    <input
                      disabled
                      type="text"
                      defaultValue={value?.siswa?.nama_siswa}
                    />
                  </td>
                  <td>
                    <input
                      disabled
                      type="text"
                      defaultValue={value?.kelas?.nama_kelas}
                    />
                  </td>
                  <td>
                    <input
                      type="text"
                      defaultValue={value?.mapel?.nama_mapel}
                    />
                  </td>
                  <td>
                    <select
                      id={`absensi_kehadiran[${index}]kehadiran.id`}
                      name={`absensi_kehadiran[${index}]kehadiran.id`}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      value={value?.kehadiran?.id}
                    >
                      <option value={1}>Hadir</option>
                      <option value={2}>Sakit</option>
                      <option value={3}>Izin Pulang</option>
                      <option value={4}>Dispensasi</option>
                      <option value={5}>Tanpa Keterangan</option>
                      <option value={6}>Belum Absensi</option>
                    </select>
                  </td>
                  <td>
                    <input
                      id={`absensi_kehadiran[${index}]keterangan`}
                      name={`absensi_kehadiran[${index}]keterangan`}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      type="text"
                      value={value?.keterangan}
                    />
                  </td>
                  <td>
                    <input
                      type="text"
                      disabled
                      defaultValue={`Semester ${value?.semester}`}
                    />
                  </td>
                  <td>
                    <input
                      placeholder="keterangan"
                      type="text"
                      defaultValue={value?.tahun_ajaran?.nama_tahun_ajaran}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <button type="submit">{isSubmitting ? "Meyimpan" : "Simpan"}</button>
        </form>
      )}
    </Formik>
  );
}
