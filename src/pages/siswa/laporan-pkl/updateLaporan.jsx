import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  useLaporanPklDetail,
  useUpdateLaporanPkl,
} from "../../../api/siswa/laporan-pkl";
import {
  Button,
  Dimmer,
  Form,
  Icon,
  Input,
  Loader,
  Segment,
  TextArea,
} from "semantic-ui-react";
import { useFormik } from "formik";
import * as yup from "yup";
import DropzoneFile from "../../../components/Dropzone";
import LayoutSiswa from "../../../module/layoutSiswa";
import { formatTanggalIndo } from "../../../utils/formatTanggal";

const validationSchema = yup.object().shape({
  judul_kegiatan: yup.string().when("status", {
    is: "izin",
    then: yup.string().required("Alasan izin harus diisi"),
    otherwise: yup.string().required("Judul kegiatan harus diisi"),
  }),
  isi_laporan: yup.string().when("status", {
    is: "izin",
    then: yup.string().required("Keterangan izin harus diisi"),
    otherwise: yup.string().required("Isi laporan wajib diisi"),
  }),
  foto: yup.string().when("status", {
    is: "izin",
    then: yup.string().required("Bukti izin harus diunggah"),
    otherwise: yup.string().required("Foto dokumentasi wajib diunggah"),
  }),
  status: yup.string().oneOf(["hadir", "izin"]).required("Status wajib diisi"),
  longtitude: yup
    .number()
    .required("Longtitude wajib diisi")
    .typeError("Longtitude harus berupa angka"),
  latitude: yup
    .number()
    .required("Latitude wajib diisi")
    .typeError("Latitude harus berupa angka"),
});

const UpdateLaporan = () => {
  const { id } = useParams();
  const { data, isFetching, isLoading } = useLaporanPklDetail(id);
  const { isLoading: isLoadingUpdate, mutate } = useUpdateLaporanPkl(id);
  const [file, setFile] = useState("");
  const navigate = useNavigate();

  const onSubmit = async (values) => {
    console.log(values);
    console.log(id);

    mutate(values);
  };
  const formik = useFormik({
    initialValues: {
      judul_kegiatan: data?.judul_kegiatan || "",
      isi_laporan: data?.isi_laporan || "",
      foto: data?.foto || "",
      status: data?.status,
      longtitude: data?.longtitude,
      latitude: data?.latitude,
    },
    validationSchema: validationSchema,
    enableReinitialize: true,
    onSubmit: onSubmit,
  });
  const {
    handleChange,
    handleSubmit,
    setFieldValue,
    handleBlur,
    values,
    errors,
    touched,
  } = formik;

  if (isFetching) {
    return (
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: 50,
        }}
        className="fixed flex items-center justify-center"
      >
        <div>
          <Dimmer
            style={{
              backgroundColor: "rgba(255, 255, 255, 0.5)", // semi-transparent white
              backdropFilter: "blur(0.5px)", // applies blur effect
            }}
            active
            inverted
          >
            <Loader size="large">Loading data ... </Loader>
          </Dimmer>
        </div>
      </div>
    );
  }

  return (
    <>
      <LayoutSiswa
        title={`Edit Laporan tanggal ${formatTanggalIndo(data?.tanggal)}`}
      >
        <div className="flex flex-col gap-y-4 overflow-y-auto pb-10 w-full h-full pl-2 pr-5">
          {" "}
          <div className="mb-10">
            <Icon
              name="arrow left"
              size="large"
              onClick={() => navigate(-1)}
              className="cursor-pointer pb-4"
            />
          </div>
          <Form
            onSubmit={formik.handleSubmit}
            className="flex flex-col gap-y-4 overflow-y-auto pb-10 w-full h-full pl-2 pr-5"
          >
            <Segment>
              <Form.Field>
                <label>
                  {data?.status === "hadir"
                    ? "Judul Jurnal Harian"
                    : "Alasan Izin"}
                </label>
                <Input
                  name="judul_kegiatan"
                  placeholder="Masukkan judul jurnal"
                  value={values.judul_kegiatan}
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
                {touched.judul_kegiatan && errors.judul_kegiatan && (
                  <div className="ui pointing red basic label">
                    {errors.judul_kegiatan}
                  </div>
                )}
              </Form.Field>

              <Form.Field>
                <label> Tanggal Jurnal</label>
                <Input value={data?.tanggal} disabled />
              </Form.Field>

              <Form.Field>
                <label>
                  {data?.status === "hadir" ? "Foto Dokumentasi" : "Bukti Izin"}{" "}
                </label>
                {/* Gambar yang diunggah oleh pengguna atau yang sudah ada */}
                <img
                  className="w-full h-auto max-h-52 object-cover mb-4 rounded-lg"
                  src={values.foto || data?.foto}
                  alt={`Foto Laporan Harian ${data.siswa.nama_siswa} tanggal ${data.tanggal}`}
                />
                {!file ? (
                  <DropzoneFile
                    handleDrop={(content) => {
                      setFile(content);
                      setFieldValue("foto", content);
                    }}
                  />
                ) : (
                  <div className="flex items-center space-x-2">
                    <Button
                      icon="delete"
                      color="red"
                      onClick={() => {
                        setFile("");
                        setFieldValue("foto", "");
                      }}
                    />
                    <a target="_blank" rel="noreferrer" href={file}>
                      {file.split("/").pop()}
                    </a>
                  </div>
                )}
                {touched.foto && errors.foto && (
                  <div className="ui pointing red basic label">
                    {errors.foto}
                  </div>
                )}
              </Form.Field>

              <Form.Field>
                <label>
                  {data?.status === "hadir"
                    ? "Deskripsi Jurnal Harian"
                    : "Keterangan Izin"}
                </label>
                <TextArea
                  name="isi_laporan"
                  placeholder="Apa yang antum kerjakan hari ini?"
                  value={values.isi_laporan}
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
                {touched.isi_laporan && errors.isi_laporan && (
                  <div className="ui pointing red basic label">
                    {errors.isi_laporan}
                  </div>
                )}
              </Form.Field>
              <div className="flex flex-col w-max">
                <Button
                  type="submit"
                  color="green"
                  loading={isLoadingUpdate}
                  disabled={!formik.dirty || isLoadingUpdate}
                >
                  Submit
                </Button>
              </div>
            </Segment>
          </Form>
        </div>
      </LayoutSiswa>
    </>
  );
};

export default UpdateLaporan;
