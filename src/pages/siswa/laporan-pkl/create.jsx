import React, { useState, useEffect } from "react";
import LayoutSiswa from "../../../module/layoutSiswa";
import {
  Input,
  Segment,
  Form,
  Button,
  TextArea,
  Loader,
  Dimmer,
  Icon,
  Tab,
  Placeholder,
} from "semantic-ui-react";
import { Formik } from "formik";
import * as yup from "yup";
import DropzoneFile from "../../../components/Dropzone";
import { useCreateLaporanPkl, useLokasiPkl } from "../../../api/siswa/laporan-pkl";
import { useNavigate } from "react-router-dom";

const CreateLaporanPkl = () => {
  const [file, setFile] = useState("");
  const { data, isLoading } = useLokasiPkl();
  const { mutate, isLoading: isLoadingCreate } = useCreateLaporanPkl();
  const [userLocation, setUserLocation] = useState({
    longtitude: null,
    latitude: null,
  });
  const navigate = useNavigate();
  const [statusKehadiran, setStatusKehadiran] = useState("hadir");

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

  const validationSchema = yup.object().shape({
    judul_kegiatan: yup
      .string()
      .when("status", {
        is: "izin",
        then: yup.string().required("Alasan izin harus diisi"),
        otherwise: yup.string().required("Judul kegiatan harus diisi"),
      }),
    isi_laporan: yup
      .string()
      .when("status", {
        is: "izin",
        then: yup.string().required("Keterangan izin harus diisi"),
        otherwise: yup.string().required("Isi laporan wajib diisi"),
      }),
    foto: yup
      .string()
      .when("status", {
        is: "izin",
        then: yup.string().required("Bukti izin harus diunggah"),
        otherwise: yup.string().required("Foto dokumentasi wajib diunggah"),
      }),
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
    status: "hadir",
    longtitude: userLocation.longtitude || "",
    latitude: userLocation.latitude || "",
  };

  const handleSubmit = (values) => {
    console.log(values, "val");
    mutate(values);
  };

  if (isLoading) {
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
        <Dimmer
          style={{
            backgroundColor: "rgba(255, 255, 255, 0.5)",
            backdropFilter: "blur(0.5px)",
          }}
          active
          inverted
        >
          <Loader size="large">Loading data ...</Loader>
        </Dimmer>
      </div>
    );
  }

  const panes = [
    {
      menuItem: "Hadir",
      render: () => (
        <Tab.Pane>
          <Formik
            enableReinitialize
            initialValues={{ ...initialValues, status: "hadir" }}
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
                    <label>Foto Dokumentasi</label>
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
                  <div className="flex flex-col w-max">
                    <Button
                      loading={isLoadingCreate}
                      type="submit"
                      color="green"
                      disabled={
                        userLocation.longtitude !== data.data.longtitude &&
                        userLocation.latitude !== data.data.latitude
                      }
                    >
                      Submit
                    </Button>
                    {userLocation.longtitude !== data.data.longtitude &&
                      userLocation.latitude !== data.data.latitude && (
                        <div className="ui pointing red basic label w-auto">
                          Anda Harus Berada di Dekat Perusahaan anda
                        </div>
                      )}
                  </div>
                </Segment>
              </Form>
            )}
          </Formik>
        </Tab.Pane>
      ),
    },
    {
      menuItem: "Izin",
      render: () => (
        <Tab.Pane>
          <Formik
            enableReinitialize
            initialValues={{ ...initialValues, status: "izin" }}
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
                <Segment>
                  <Form.Field>
                    <label>Alasan Izin</label>
                    <Input
                      name="judul_kegiatan"
                      placeholder="Masukkan alasan izin"
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
                    <label>Tanggal Izin</label>
                    <Input value={new Date().toLocaleDateString()} disabled />
                  </Form.Field>

                  <Form.Field>
                    <label>Bukti Izin</label>
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
                    <label>Keterangan Izin</label>
                    <TextArea
                      name="isi_laporan"
                      placeholder="Masukkan keterangan izin"
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
                      loading={isLoadingCreate}
                      type="submit"
                      color="green"
                      disabled={
                        userLocation.longtitude !== data.data.longtitude &&
                        userLocation.latitude !== data.data.latitude
                      }
                    >
                      Submit
                    </Button>
                    {userLocation.longtitude !== data.data.longtitude &&
                      userLocation.latitude !== data.data.latitude && (
                        <div className="ui pointing red basic label w-auto">
                          Anda Harus Berada di Dekat Perusahaan anda
                        </div>
                      )}
                  </div>
                </Segment>
              </Form>
            )}
          </Formik>
        </Tab.Pane>
      ),
    },
  ];

  return (
    <>
      <LayoutSiswa title="Laporan Harian">
        <Icon
          className="mb-2 cursor-pointer"
          onClick={() => navigate(-1)}
          name="arrow left"
          size="large"
        />
        <Tab panes={panes} className="mt-4"/>
      </LayoutSiswa>
    </>
  );
};

export default CreateLaporanPkl;
