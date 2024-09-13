import { Link, useNavigate } from "react-router-dom";
import LayoutPpdb from "../../../module/layoutPpdb";
import { useProfileCalonSantri } from "../../../api/ppdb/profile";
import { useEffect, useState } from "react";
import * as yup from "yup";
import { toast } from "react-toastify";
import {
  CreateLampiranBuktiTransfer,
  getDetailPembayaranById,
  ListPembayaran,
  useDetailPembayaran,
  useGetHasilPembayaran,
} from "../../../api/ppdb/pembayaran";
import { Formik } from "formik";
import { Button, Form, Input, Label } from "semantic-ui-react";
import DropzoneFile from "../../../components/Dropzone";
import { useQuery } from "react-query";

const LampiranBuktiTransferSchema = yup.object().shape({
  bukti_tf: yup.string().nullable().required("File harus diunggah!"),
  keterangan: yup.string().nullable().required("Silahkan isi keterangan !"),
  teacher_id: yup.number().nullable(),
});

const formatRupiah = (value) => {
  if (!value) return "";
  const numberString = value.replace(/[^,\d]/g, "").toString();
  const split = numberString.split(",");
  let rest = split[0].length % 3;
  let rupiah = split[0].substr(0, rest);
  const thousand = split[0].substr(rest).match(/\d{3}/g);

  if (thousand) {
    const separator = rest ? "." : "";
    rupiah += separator + thousand.join(".");
  }

  rupiah = split[1] != undefined ? rupiah + "," + split[1] : rupiah;
  return rupiah;
};

const Transfer = ({ item }) => {
  const navigate = useNavigate();
  const { profileData } = useProfileCalonSantri();
  const [pembayaranData, setPembayaranData] = useState([]);
  const [pembayaranDataDetail, setPembayaranDataDetail] = useState(
    getDetailPembayaranById
  );
  const [loadingPembayaran, setLoadingPembayaran] = useState(true);
  const [statusPembayaran, setStatusPembayaran] = useState("Belum Bayar"); // Tambahkan state untuk status pembayaran

  const {
    data, // Data hasil pembayaran dengan parameter
    isFetching, // Status fetching data pembayaran dengan parameter
    setParams, // Fungsi untuk mengubah parameter
    dataPb, // Data list pembayaran
    isFetchingList, // Status fetching list pembayaran
  } = useGetHasilPembayaran();

  // useEffect(() => {
  //   const fetchPembayaran = async () => {
  //     try {
  //       const response = await ListPembayaran();
  //       setPembayaranData(response.data.data.rows);
  //       setLoadingPembayaran(false);
  //     } catch (error) {
  //       console.error("Error fetching pembayaran data:", error);
  //       setLoadingPembayaran(false);
  //     }
  //   };

  //   fetchPembayaran();
  // }, []);

  useEffect(() => {
    const fetchDetailPembayaran = async () => {
      try {
        if (profileData.id) {
          const response = await getDetailPembayaranById(profileData.id);
          const pembayaran = response.data.data;
          console.log("Data Pembayaran:", pembayaran);

          if (pembayaran.user_id === profileData.id) {
            setPembayaranDataDetail(pembayaran);
            setStatusPembayaran("Sudah Bayar");
          } else {
            setStatusPembayaran("Belum Bayar");
          }
        }
      } catch (error) {
        console.error("Error fetching payment details:", error);
      }
    };

    fetchDetailPembayaran();
  }, [profileData.id]);

  const [initialValues, setInitialValues] = useState({
    bukti_tf: "",
    keterangan: "Registrasi",
    teacher_id: "",
  });

  const onSubmit = async (values, { setSubmitting, resetForm }) => {
    try {
      const response = await CreateLampiranBuktiTransfer(values);

      console.log(response); // Lihat seluruh respons dari API

      const paymentId = response.data?.data?.id; // Pastikan jalur ini sesuai
      console.log("Payment ID:", paymentId); // Cek apakah ID benar terambil

      toast.success(response?.data?.msg || "Data berhasil disimpan!", {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
      });

      resetForm();
      setTimeout(() => {
        navigate(`/ppdb/detail-pembayaran/${paymentId}`);
      }, 2000);
    } catch (error) {
      // Error handling
      if (error?.response?.status === 422) {
        toast.warn(error?.response?.data?.msg || "Validasi gagal!", {
          position: "top-right",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "colored",
        });
      } else {
        toast.error("Terjadi kesalahan pada server!", {
          position: "top-right",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "colored",
        });
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <LayoutPpdb title="Transfer">
      <Formik
        initialValues={initialValues}
        validationSchema={LampiranBuktiTransferSchema}
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
          <>
            <Form onSubmit={handleSubmit}>
              {/* Card Section */}
              <div className="bg-white shadow-lg rounded-lg p-6 w-full mx-auto mt-8">
                <h2 className="text-2xl font-bold mb-4">
                  Panduan Pembayaran Pendaftaran
                </h2>

                <div className="mb-4">
                  <p className="text-gray-700">
                    Kepada ananda <span>{profileData.nama_siswa}</span> harap
                    melunasi biaya pendaftaran sebagai syarat untuk bisa
                    mengikuti rangkaian proses penerimaan santri baru SMK
                    Madinatul Quran.
                  </p>
                  <p className="text-gray-700 flex flex-col">
                    Nominal yang harus dibayarkan sebesar:
                    <span className="font-semibold text-green-600 text-xl">
                      450.000
                    </span>
                  </p>
                </div>

                <div className="flex flex-col items-start mt-4">
                  <p className="text-lg font-semibold">
                    Untuk pembayarannya dapat dibayarkan ke rekening berikut:
                  </p>
                  <p className="text-lg font-bold text-gray-500">
                    Bank Muamalat
                    <br />
                    Nomor Rekening: 3310006100
                    <br />
                    Kode Bank: (147)
                    <br />
                    Atas Nama: Yayasan Wisata Al Islam
                  </p>
                </div>

                <div className="mt-6">
                  <p>
                    Setelah melakukan pembayaran, mohon untuk melampirkan Bukti
                    Transfer melalui menu di bawah ini:
                  </p>
                </div>
              </div>

              {/* Lampiran Bukti Transfer Section */}
              <div className="bg-white shadow-lg rounded-lg p-6 w-full mx-auto mt-8">
                <h2 className="text-2xl font-bold mb-4">
                  Lampiran Bukti Transfer
                </h2>

                <div className="mb-4">
                  <p className="text-gray-700">
                    Kepada ananda <span>{profileData.nama_siswa}</span> harap
                    melunasi biaya pendaftaran sebagai syarat untuk bisa
                    mengikuti rangkaian proses penerimaan santri baru SMK
                    Madinatul Quran.
                  </p>

                  <p className="mt-4">Teacher_id</p>
                  <Input
                    placeholder="Masukan id guru"
                    name="teacher_id"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.teacher_id} // Value otomatis diisi dengan "registrasi"
                    disabled={isSubmitting}
                    error={!!errors.teacher_id && touched.teacher_id}
                  />
                  {/* Tampilkan pesan error di bawah input */}
                  {errors.teacher_id && touched.teacher_id && (
                    <div className="mt-2">
                      {" "}
                      {/* Margin atas agar error tidak terlalu dekat */}
                      <Label basic color="red" pointing="above">
                        {errors.teacher_id}
                      </Label>
                    </div>
                  )}

                  <div className="py-8">
                    <p>keterangan</p>
                    <Input
                      placeholder="Masukan keterangan"
                      name="keterangan"
                      onChange={handleChange}
                      onBlur={handleBlur}
                      value={values.keterangan} // Value otomatis diisi dengan "registrasi"
                      disabled={isSubmitting}
                      error={!!errors.keterangan && touched.keterangan}
                    />
                    {/* Tampilkan pesan error di bawah input */}
                    {errors.keterangan && touched.keterangan && (
                      <div className="mt-2">
                        {" "}
                        {/* Margin atas agar error tidak terlalu dekat */}
                        <Label basic color="red" pointing="above">
                          {errors.keterangan}
                        </Label>
                      </div>
                    )}

                    {JSON.stringify(values)}
                    <Form.Field className="mb-4 w-[450px] pt-8">
                      <label>Upload Bukti Transfer</label>
                      {!values.bukti_tf ? (
                        <DropzoneFile
                          handleDrop={(cont) => {
                            setFieldValue("bukti_tf", cont);
                            console.log("url", cont);
                          }}
                        />
                      ) : (
                        <div className="flex items-center space-x-2">
                          <Button
                            icon="delete"
                            color="red"
                            onClick={(file) => {
                              setFieldValue("bukti_tf", file[0]?.name || "");
                            }}
                          />
                          {values.bukti_tf instanceof File && (
                            <a
                              target="_blank"
                              rel="noreferrer"
                              href={URL.createObjectURL(values.bukti_tf)}
                            >
                              {values.bukti_tf.name}
                            </a>
                          )}
                        </div>
                      )}
                      {touched.bukti_tf && errors.bukti_tf && (
                        <div className="text-red-500 text-sm mt-1">
                          {errors.bukti_tf}
                        </div>
                      )}
                    </Form.Field>
                  </div>

                  <p className="text-gray-700 flex flex-col">
                    Dalam hadits Abu Hurairah disebutkan bahwa Rasulullah
                    shallallahu ‘alaihi wa sallam bersabda:
                    <span className="font-semibold text-green-600 text-3xl pt-4">
                      الْمُسْلِمُونَ عَلَى شُرُوطِهِمْ
                    </span>
                  </p>
                </div>

                <div className="my-6">
                  <p>
                    <span className="text-gray-700 font-semibold">
                      “Kaum muslimin wajib mematuhi perjanjian yang telah mereka
                      sepakati.”
                    </span>
                    <br />
                    (HR. Abu Daud no 3594. Al Hafizh Abu Thohir mengatakan bahwa
                    sanad hadits ini hasan).
                  </p>
                </div>

                <Button
                  type="submit"
                  color="blue"
                  disabled={isSubmitting}
                  loading={isSubmitting}
                >
                  {isSubmitting ? "Menyimpan..." : "Upload Bukti Transfer"}
                </Button>
              </div>
              {/* 
              <div className="mt-4">
                <div className="mt-4">
                  <p className="text-2xl">Bagian Luar Card</p>

                  {loadingPembayaran ? (
                    <p>Loading...</p>
                  ) : (
                    <ul>
                      {pembayaranData.length > 0 ? (
                        pembayaranData.map((pembayaran) => (
                          <li key={pembayaran.id} className="mb-4">
                            <div className="border p-4 rounded">
                              <p>
                                <strong>ID:</strong> {pembayaran.id}
                              </p>
                              <p>
                                <strong>ID Pengguna:</strong>{" "}
                                {pembayaran.user_id}
                              </p>
                              <p>
                                <strong>ID Guru:</strong>{" "}
                                {pembayaran.teacher_id}
                              </p>
                              <p>
                                <strong>Nominal:</strong> {pembayaran.nominal}
                              </p>
                              <p>
                                <strong>Keterangan:</strong>{" "}
                                {pembayaran.keterangan || "N/A"}
                              </p>
                              <p>
                                <strong>Bukti Transfer:</strong>
                                <a
                                  href={pembayaran.bukti_tf}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                >
                                  {pembayaran.bukti_tf}
                                </a>
                              </p>
                              <p>
                                <strong>Dibuat pada:</strong>{" "}
                                {new Date(
                                  pembayaran.createdAt
                                ).toLocaleDateString()}
                              </p>
                            </div>
                          </li>
                        ))
                      ) : (
                        <p>No pembayaran data found.</p>
                      )}
                    </ul>
                  )}
                </div>
              </div> */}
            </Form>
          </>
        )}
      </Formik>
    </LayoutPpdb>
  );
};

export default Transfer;
