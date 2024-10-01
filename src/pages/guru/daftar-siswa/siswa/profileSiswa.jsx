/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import {
  Button,
  Form as SemanticForm,
  Icon,
  Loader,
  TextArea,
} from "semantic-ui-react";
import { useQuery, useQueryClient } from "react-query";
import { getSiswaById } from "../../../../api/guru/siswa";
import { useParams } from "react-router-dom";
import useToast from "../../../../hook/useToast"; // Import useToast
import { useTa, useUpdateProfile } from "./profile";
import { LoadingPage } from "../../../../components";
import ImageWithFallback from "../../../../components/ImageWithFallBack";

const formatDate = (date) => {
  const d = new Date(date);
  return d.toISOString().split("T")[0]; // Format: YYYY-MM-DD
};

const ProfileComponent = ({ onSuccess, onError }) => {
  const { id } = useParams(); // Deklarasikan id dari useParams
  const queryClient = useQueryClient();
  const { successToast, warningToast } = useToast(); // Destructure custom toasts

  const [initialValues, setInitialValues] = useState({
    nama_siswa: "",
    nik: "",
    nis: "",
    nisn: "",
    tempat_lahir: "",
    tanggal_lahir: "",
    alamat: "",
    sekolah_asal: "",
    jenis_kelamin: "",
    anak_ke: "",
    tanggal_diterima: "",
    angkatan: "",
    tahun_ajaran: "",
    status: "",
    keterangan: "",
    email: "",
  });

  const validationSchema = Yup.object().shape({
    nama_siswa: Yup.string().required("Nama siswa wajib diisi"),
    nik: Yup.string().required("NIK wajib diisi"),
    nis: Yup.string().required("NIS wajib diisi"),
    nisn: Yup.string().required("NISN wajib diisi"),
    tempat_lahir: Yup.string().required("Tempat lahir wajib diisi"),
    tanggal_lahir: Yup.date().required("Tanggal lahir wajib diisi").nullable(),
    alamat: Yup.string().required("Alamat wajib diisi"),
    email: Yup.string()
      .email("Email tidak valid")
      .required("Email wajib diisi"),
    sekolah_asal: Yup.string().required("Sekolah asal wajib diisi"),
    tanggal_diterima: Yup.date()
      .required("Tanggal diterima wajib diisi")
      .nullable(),
    angkatan: Yup.string().required("Angkatan wajib diisi"),
    tahun_ajaran: Yup.string().required("Tahun ajaran wajib diisi"),
    status: Yup.string().required("Status wajib diisi"),
    keterangan: Yup.string().optional(),
    anak_ke: Yup.string().optional(),
  });

  const {
    isFetching,
    data: siswaData,
    isLoading,
    error,
    handleBlur,
  } = useQuery([`/guru/siswa/detail/${id}`, id], () => getSiswaById(id), {
    enabled: !!id,
    staleTime: 1000 * 60 * 60 * 24, // 24 jam
    select: (response) => {
      if (response && response.data && response.data.siswa) {
        return response.data.siswa;
      } else {
        warningToast("Data siswa tidak ditemukan.");
        return null;
      }
    },
    onError: () => {
      warningToast("Gagal mengambil data siswa");
    },
  });

  useEffect(() => {
    if (siswaData) {
      // console.log(siswaData);
      setInitialValues({
        user_id: siswaData.user_id || "",
        nama_siswa: siswaData.nama_siswa || "",
        nik: siswaData.nik || "",
        nis: siswaData.nis || "",
        nisn: siswaData.nisn || "",
        tempat_lahir: siswaData.tempat_lahir || "",
        tanggal_lahir: siswaData.tanggal_lahir
          ? formatDate(siswaData.tanggal_lahir)
          : "",
        alamat: siswaData.alamat || "",
        sekolah_asal: siswaData.sekolah_asal || "",
        jenis_kelamin: siswaData.jenis_kelamin || "",
        anak_ke: siswaData.anak_ke || "",
        tanggal_diterima: siswaData.tanggal_diterima
          ? formatDate(siswaData.tanggal_diterima)
          : "",
        angkatan: siswaData.angkatan || "",
        tahun_ajaran: siswaData.tahun_ajaran || "",
        status: siswaData.status || "",
        keterangan: siswaData.keterangan || "",
        email: siswaData.user?.email || "",
        avatar: siswaData.user?.image || "",
      });
    }
  }, [siswaData, warningToast]);
  // console.log(siswaData);
  const { mutate, isLoading: isLoadingUpdate } = useUpdateProfile(id);

  const onSubmit = async (values, { resetForm }) => {
    mutate(values);
    // console.log(values)
  };

  // if (isLoading) {
  //   return <LoadingPage />;
  // }

  return (
    <Formik
      initialValues={initialValues}
      enableReinitialize
      onSubmit={onSubmit}
      validationSchema={validationSchema}
    >
      {({
        values,
        handleChange,
        handleSubmit,
        setFieldValue,
        isSubmitting,
        errors,
        touched,
      }) => (
        <Form onSubmit={handleSubmit}>
          <div>
            {isFetching ? (
              <div className="ml-5 mt-[30px]">
                <Loader active inline="left" />
              </div>
            ) : (
              <div className="flex flex-col gap-y-2 shadow-md p-5">
                {/* Centering the profile picture */}
                <div className="flex justify-center items-center mb-4">
                  <div className="w-32 h-32 border-2 border-gray-300 rounded-full bg-gray-50 flex justify-center items-center">
                    <ImageWithFallback
                      src={siswaData.user?.image}
                      alt={values.nama_siswa}
                      fallbackSrc="/blankprofile.jpg"
                      // className="w-full h-full rounded-full object-cover"
                    />
                  </div>
                </div>

                <div className="flex">
                  <div className="flex flex-col gap-y-4 w-full pr-4">
                    <div>
                      <h3 className="text-lg font-semibold mb-2">
                        Data Pribadi
                      </h3>
                      <div className="border-b-2 border-gray-300"></div>
                    </div>

                    <section>
                      <label htmlFor="nama_siswa">Nama Siswa</label>
                      <SemanticForm.Input
                        value={values.nama_siswa}
                        id="nama_siswa"
                        name="nama_siswa"
                        onChange={handleChange}
                        style={{ width: "100%" }}
                        error={touched.nama_siswa && errors.nama_siswa}
                        disabled
                      />
                    </section>
                    <section>
                      <label htmlFor="nik">NIK</label>
                      <SemanticForm.Input
                        value={values.nik}
                        id="nik"
                        name="nik"
                        onChange={(data) => {
                          const { value } = data.target;
                          if (/^[0-9]*$/.test(value) && value.length <= 16) {
                            setFieldValue("nik", value);
                          }
                        }}
                        style={{ width: "100%" }}
                        error={touched.nik && errors.nik}
                        disabled
                      />
                    </section>
                    <section>
                      <label htmlFor="nis">NIS</label>
                      <SemanticForm.Input
                        value={values.nis}
                        id="nis"
                        name="nis"
                        onChange={handleChange}
                        style={{ width: "100%" }}
                        error={touched.nis && errors.nis}
                        disabled
                      />
                    </section>
                    <section>
                      <label htmlFor="nisn">NISN</label>
                      <SemanticForm.Input
                        value={values.nisn}
                        id="nisn"
                        name="nisn"
                        onChange={handleChange}
                        style={{ width: "100%" }}
                        error={touched.nisn && errors.nisn}
                        disabled
                      />
                    </section>
                    <section>
                      <label htmlFor="tempat_lahir">Tempat Lahir</label>
                      <SemanticForm.Input
                        value={values.tempat_lahir}
                        id="tempat_lahir"
                        name="tempat_lahir"
                        onChange={handleChange}
                        style={{ width: "100%" }}
                        error={touched.tempat_lahir && errors.tempat_lahir}
                        disabled
                      />
                    </section>
                    <section>
                      <label htmlFor="tanggal_lahir">Tanggal Lahir</label>
                      <SemanticForm.Input
                        type="date"
                        value={values.tanggal_lahir}
                        id="tanggal_lahir"
                        name="tanggal_lahir"
                        onChange={(e) =>
                          setFieldValue("tanggal_lahir", e.target.value)
                        }
                        style={{ width: "100%" }}
                        error={touched.tanggal_lahir && errors.tanggal_lahir}
                        disabled
                      />
                    </section>
                    <section>
                      <label htmlFor="jenis_kelamin">Jenis Kelamin</label>
                      <SemanticForm.Input
                        value={values.jenis_kelamin}
                        id="jenis_kelamin"
                        name="jenis_kelamin"
                        onChange={handleChange}
                        style={{ width: "100%" }}
                        error={touched.jenis_kelamin && errors.jenis_kelamin}
                        disabled
                      />
                    </section>
                    <section>
                      <label htmlFor="anak_ke">Anak ke</label>
                      <SemanticForm.Dropdown
                        fluid
                        search
                        selection
                        options={[
                          ...Array.from({ length: 10 }, (_, i) => ({
                            key: i + 1,
                            text: i + 1,
                            value: i + 1,
                          })),
                        ]}
                        value={values.anak_ke}
                        id="anak_ke"
                        name="anak_ke"
                        onChange={(e, { value }) =>
                          setFieldValue("anak_ke", value)
                        }
                        placeholder="Pilih atau ketik angka"
                        onSearchChange={(e, { searchQuery }) => {
                          setFieldValue("anak_ke", searchQuery);
                        }}
                        style={{ width: "100%" }}
                        error={touched.anak_ke && errors.anak_ke}
                        disabled
                      />
                    </section>
                    <section>
                      <label htmlFor="alamat">Alamat</label>
                      <SemanticForm.Input
                        value={values.alamat}
                        id="alamat"
                        name="alamat"
                        onChange={handleChange}
                        style={{ width: "100%" }}
                        error={touched.alamat && errors.alamat}
                        disabled
                      />
                    </section>
                  </div>
                  <div className="border-l-2 border-gray-300 mx-4"></div>

                  <div className="flex flex-col gap-y-4 w-full pl-4">
                    <div>
                      <h3 className="text-lg font-semibold mb-2">
                        Data Pelengkap
                      </h3>
                      <div className="border-b-2 border-gray-300"></div>
                    </div>

                    <section>
                      <label htmlFor="sekolah_asal">Sekolah Asal</label>
                      <SemanticForm.Input
                        value={values.sekolah_asal}
                        id="sekolah_asal"
                        name="sekolah_asal"
                        onChange={handleChange}
                        style={{ width: "100%" }}
                        error={touched.sekolah_asal && errors.sekolah_asal}
                        disabled
                      />
                    </section>
                    <section>
                      <label htmlFor="tanggal_diterima">Tanggal Diterima</label>
                      <SemanticForm.Input
                        type="date"
                        value={values.tanggal_diterima}
                        id="tanggal_diterima"
                        name="tanggal_diterima"
                        onChange={(e) =>
                          setFieldValue("tanggal_diterima", e.target.value)
                        }
                        style={{ width: "100%" }}
                        error={
                          touched.tanggal_diterima && errors.tanggal_diterima
                        }
                        disabled
                      />
                    </section>
                    <section>
                      <label htmlFor="angkatan">Angkatan ke</label>
                      <SemanticForm.Input
                        value={values.angkatan}
                        id="angkatan"
                        name="angkatan"
                        onChange={handleChange}
                        style={{ width: "100%" }}
                        error={touched.angkatan && errors.angkatan}
                        disabled
                      />
                    </section>
                    <section>
                      <label htmlFor="tahun_ajaran">Tahun Ajaran</label>
                      <SemanticForm.Select
                        fluid
                        search
                        options={[
                          {
                            key: "2021",
                            text: "2021/2022",
                            value: "2021/2022",
                          },
                          {
                            key: "2022",
                            text: "2022/2023",
                            value: "2022/2023",
                          },
                          {
                            key: "2023",
                            text: "2023/2024",
                            value: "2023/2024",
                          },
                          {
                            key: "2024",
                            text: "2024/2025",
                            value: "2024/2025",
                          },
                          {
                            key: "2025",
                            text: "2025/2026",
                            value: "2025/2026",
                          },
                          {
                            key: "2026",
                            text: "2026/2027",
                            value: "2026/2027",
                          },
                          {
                            key: "2027",
                            text: "2027/2028",
                            value: "2027/2028",
                          },
                        ]}
                        value={values.tahun_ajaran}
                        id="tahun_ajaran"
                        name="tahun_ajaran"
                        onChange={(e, { value }) =>
                          setFieldValue("tahun_ajaran", value)
                        }
                        placeholder="Pilih atau ketik"
                        style={{ width: "100%" }}
                        error={touched.tahun_ajaran && errors.tahun_ajaran}
                        disabled
                      />
                    </section>
                    <section>
                      <label htmlFor="status">Status</label>
                      <SemanticForm.Select
                        fluid
                        search
                        options={[
                          { key: "active", text: "Active", value: "active" },
                          { key: "alumni", text: "Alumni", value: "alumni" },
                        ]}
                        value={values.status}
                        id="status"
                        name="status"
                        onChange={(e, { value }) =>
                          setFieldValue("status", value)
                        }
                        placeholder="Pilih atau ketik"
                        style={{ width: "100%" }}
                        error={touched.status && errors.status}
                        disabled
                      />
                    </section>
                    <section>
                      <label htmlFor="keterangan">Keterangan</label>
                      <SemanticForm.Select
                        fluid
                        search
                        options={[
                          { key: "active", text: "Active", value: "active" },
                          { key: "gatau", text: "Gatau", value: "gatau" },
                        ]}
                        value={values.keterangan}
                        id="keterangan"
                        name="keterangan"
                        onChange={(e, { value }) =>
                          setFieldValue("keterangan", value)
                        }
                        placeholder="Pilih atau ketik"
                        style={{ width: "100%" }}
                        error={touched.keterangan && errors.keterangan}
                        disabled
                      />
                    </section>
                    <section>
                      <label htmlFor="email">Email</label>
                      <SemanticForm.Input
                        value={values.email}
                        id="email"
                        name="email"
                        onChange={handleChange}
                        style={{ width: "100%" }}
                        error={touched.email && errors.email}
                        disabled
                      />
                    </section>
                  </div>
                </div>
                {/* <div className="mt-5">
              <Button
                content={"Update Siswa"}
                type="submit"
                fluid
                icon={() => <Icon name="save" />}
                loading={isLoadingUpdate}
                disabled={isLoadingUpdate}
                size="medium"
                color="teal"
              />
            </div> */}
              </div>
            )}
          </div>
        </Form>
      )}
    </Formik>
  );
};

export default ProfileComponent;
