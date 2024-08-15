import React, { useState, useEffect } from "react";
import LayoutSiswa from "../../../module/layoutSiswa";
import {
  Input,
  Segment,
  Form,
  Button,
  Header,
  Divider,
  TextArea,
  Icon,
} from "semantic-ui-react";
import { Formik, Field } from "formik";
import * as yup from "yup";
import DropzoneFile from "../../../components/Dropzone";
import {
  useCreateLaporanPkl,
  useLokasiPkl,
} from "../../../api/siswa/laporan-pkl";

const CreateLaporanPkl = () => {
  const [file, setFile] = useState("");
  const { data } = useLokasiPkl();
  const mutate = useCreateLaporanPkl();
  const [userLocation, setUserLocation] = useState({
    longtitude: null,
    latitude: null,
  });

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            longtitude: position.coords.longitude,
            latitude: position.coords.latitude,
          });
        },
        (error) => {
          console.error("Error obtaining location:", error);
        }
      );
    } else {
      console.error("Geolocation is not supported by this browser.");
    }
    
  }, []);
console.log(data, "lokasi")
  const validationSchema = yup.object().shape({
    judul_kegiatan: yup.string().required("Judul kegiatan wajib diisi"),
    isi_laporan: yup.string().required("Isi laporan wajib diisi"),
    foto: yup.string().required("Foto dokumentasi wajib diisi"),
    status: yup
      .string()
      .oneOf(["hadir", "izin"])
      .required("Status wajib diisi"),
    longtitude: yup
      .number()
      .required("Longtitude wajib diisi")
      .typeError("Longtitude harus berupa angka"),
    latitude: yup
      .number()
      .required("Latitude wajib diisi")
      .typeError("Latitude harus berupa angka"),
  });

  const initialValues = {
    judul_kegiatan: "",
    isi_laporan: "",
    foto: "",
    status: "",
    longtitude: userLocation.longtitude || "",
    latitude: userLocation.latitude || "",
  };

  const handleSubmit = (values) => {
    console.log(values, "val");
    mutate.mutate(values);
  };

  return (
    <>
      <LayoutSiswa title="Laporan Harian">
        <Formik
          enableReinitialize
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({
            values,
            errors,
            touched,
            handleChange,
            handleBlur,
            handleSubmit,
            setFieldValue,
          }) => (
            <Form onSubmit={handleSubmit}>
              {JSON.stringify(values)}
              {console.log(values)}
              {console.log(errors, "err")}
              <Form.Field>
                <label>Status Kehadiran</label>
                <div>
                  <Button
                    type="button"
                    positive={values.status === "hadir"}
                    onClick={() => setFieldValue("status", "hadir")}
                  >
                    Hadir
                  </Button>
                  <Button
                    type="button"
                    positive={values.status === "izin"}
                    onClick={() => setFieldValue("status", "izin")}
                  >
                    Izin
                  </Button>
                </div>
                {touched.status && errors.status && (
                  <div className="ui pointing red basic label">
                    {errors.status}
                  </div>
                )}
              </Form.Field>
              <Segment>
                <Form.Field>
                  <label>Judul Jurnal Harian</label>
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
                  <label>Tanggal Jurnal</label>
                  <Input value={new Date().toLocaleDateString()} disabled />
                </Form.Field>

                <Form.Field>
                  <label htmlFor="">Foto Dokumentasi</label>
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
                        {/* {file.split("/").pop()} */}
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
                  <label>Deskripsi Jurnal Harian</label>
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

                <Button type="submit" color="green">
                  Submit
                </Button>
              </Segment>
            </Form>
          )}
        </Formik>
      </LayoutSiswa>
    </>
  );
};

export default CreateLaporanPkl;
