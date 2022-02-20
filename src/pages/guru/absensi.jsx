import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { listAbsensi } from "../../api/guru/absensi";
import { useQuery, useQueryClient } from "react-query";
import { Formik } from "formik";
import { updateAbsensi } from "../../api/guru/absensi";
import { listMapel, listKelas } from "../../api/list";
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
  console.log(tanggal);
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

    return console.log("hasil", result);
  };

  //   console.log(initialState);

  React.useEffect(() => {
    console.log("jalan");
    setDariTanggal(tanggal);
    setSampaiTanggal(tanggal);
  }, [tanggal]);

  console.log(dataKelas);
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
          <div>
            <input
              type="date"
              value={tanggalActive}
              placeholder="tanggal"
              onChange={(e) => {
                setTanggalActive(e.target.value);
              }}
            />
            <select
              name="mapel_id"
              id="mapel_id"
              value={mapel_id}
              onChange={(e) => {
                setMapel(e.target.value);
              }}
            >
              {dataMapel?.data?.map((value) => (
                <option value={value.id}>{value.nama_mapel}</option>
              ))}
            </select>
            <select
              name="kelas_id"
              id="kelas _id"
              value={kelas_id}
              onChange={(e) => {
                setKelas(e.target.value);
              }}
            >
              {dataKelas?.data?.map((value) => (
                <option value={value.id}>{value.nama_kelas}</option>
              ))}
            </select>
            <button
              type="button"
              onClick={() => {
                return navigate(
                  `/guru/jadwal/absensi/${kelas}/${mapel}/${tanggalActive}`
                );
              }}
            >
              Filter
            </button>
          </div>
          <div>
            <h2>Agenda Mengajar</h2>
            <div>
              {values?.agenda_kelas === 0 ? (
                <div>
                  <p>Tidak ditemukan jadwal </p>
                </div>
              ) : (
                values?.agenda_kelas?.map((value, index) => (
                  <React.Fragment key={index}>
                    <div className="grid grid-cols-9 gap-2">
                      <input
                        className="col-span-1"
                        type="text"
                        disabled
                        defaultValue={`Jam ke-${value?.jam_ke}`}
                      />

                      <input
                        className="col-span-7"
                        type="text"
                        placeholder="Materi"
                        id={`agenda_kelas[${index}]materi`}
                        name={`agenda_kelas[${index}]materi`}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        value={value?.materi}
                      />
                    </div>
                  </React.Fragment>
                ))
              )}
            </div>
          </div>
          <table className="table-fixed">
            <thead>
              <tr>
                <th>No</th>
                <th>Nama</th>
                <th>Kelas</th>
                <th>Mata Pelajaran</th>
                <th>
                  <span className="mr-2">Kehadiran</span>
                  <input
                    onChange={(e) => {
                      console.log(e.target.checked);
                      if (e.target.checked) {
                        let kehadiran = [];
                        values?.absensi_kehadiran?.map((value) => {
                          console.log(value.kehadiran.id);
                          value.kehadiran.id = 1;
                          console.log(value.kehadiran.id);
                          kehadiran.push(value);
                        });

                        setFieldValue("absensi_kehadiran", kehadiran);
                      }
                    }}
                    type="checkbox"
                  />
                </th>
                <th>Keterangan</th>
                <th>Semester</th>
                <th>Tahun Ajaran</th>
              </tr>
            </thead>
            <tbody>
              {values?.absensi_kehadiran.length === 0 ? (
                <tr>
                  <td colSpan={8}>Tidak ditemukan jadwal </td>
                </tr>
              ) : (
                values?.absensi_kehadiran?.map((value, index) => (
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
