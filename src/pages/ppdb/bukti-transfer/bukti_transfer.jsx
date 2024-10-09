/* eslint-disable no-unused-vars */
/* eslint-disable jsx-a11y/anchor-is-valid */
import { Link, useNavigate, useParams } from "react-router-dom";
import LayoutPpdb from "../../../module/layoutPpdb";
import { useProfileCalonSantri } from "../../../api/ppdb/profile";
import { useEffect, useState } from "react";
import * as yup from "yup";
import { toast } from "react-toastify";
import {
  CreateLampiranBuktiTransfer,
  fetchPaymentDetails,
  ListPembayaran,
  useDetailPembayaran,
  useGetHasilPembayaranDetail,
} from "../../../api/ppdb/pembayaran";
import { Formik } from "formik";
import { Button, Form, Input, Label, Modal } from "semantic-ui-react";
import DropzoneFile from "../../../components/Dropzone";

const LampiranBuktiTransferSchema = yup.object().shape({
  bukti_tf: yup.string().nullable().required("File harus diunggah!"),
  // keterangan: yup.string().nullable().required("Silahkan isi keterangan!"),
  // teacher_id: yup.number().nullable().required("Teacher ID harus diisi!"),
});

// Simulasi user login (sesuaikan dengan logika login dari backend-mu)
const getUser = () => {
  return localStorage.getItem("currentUser") || "UserA"; // UserA or UserB
};

const BuktiTransfer = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { profileData } = useProfileCalonSantri();
  const { dataPembayaran, error, isError } = useDetailPembayaran();
  // const { dataDetail, isLoading, isError } = useGetHasilPembayaranDetail(id);
  const [paymentId, setPaymentId] = useState(null); // State untuk menyimpan paymentId
  const [openModal, setOpenModal] = useState(false);
  const [paymentDetails, setPaymentDetails] = useState(null); // Menyimpan data pembayaran
  const [showPopup, setShowPopup] = useState(false);
  const [payments, setPayments] = useState([]);
  const [isUploaded, setIsUploaded] = useState(false); // Status upload
  const [currentUser, setCurrentUser] = useState(getUser()); // User login
  const handlePopupToggle = () => {
    setShowPopup(!showPopup);
  };

  // useEffect(() => {
  //   if (isError && error?.response?.status === 404) {
  //     navigate("/ppdb/transfer");
  //   }
  // }, [isError, error, navigate]);

  const [initialValues, setInitialValues] = useState({
    bukti_tf: "",
    // keterangan: "Registrasi",
    // teacher_id: "",
  });

  // Fetch data setelah paymentId tersimpan
  useEffect(() => {
    if (paymentId) {
      const getPaymentDetails = async () => {
        try {
          const response = await fetchPaymentDetails(paymentId); // Panggil API untuk data berdasarkan paymentId
          setPaymentDetails(response.data); // Simpan data pembayaran di state
        } catch (error) {
          console.error("Error fetching payment details:", error);
        }
      };
      getPaymentDetails(); // Panggil fungsi untuk fetch data
    }
  }, [paymentId]);

  const onSubmit = async (values, { setSubmitting, resetForm }) => {
    try {
      // Tambahkan teacher_id secara otomatis
      const updatedValues = {
        ...values,
        teacher_id: 2, // Mengisi teacher_id dengan nilai 2
        keterangan: "Registrasi",
      };

      const response = await CreateLampiranBuktiTransfer(updatedValues);
      const paymentId = response.data?.data?.id;

      // Simpan paymentId ke dalam state
      setPaymentId(paymentId);

      // Simpan status upload ke localStorage
      setIsUploaded(true);

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

      // Tampilkan modal sukses
      setOpenModal(true);

      // Setelah beberapa detik, modal bisa ditutup otomatis
      setTimeout(() => {
        setOpenModal(false);
      }, 3000);
    } catch (error) {
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
              {/* {paymentId ? (
                <div>
                  <p>Payment ID: {paymentId} telah tersimpan!</p>

                  {paymentDetails ? (
                    <div>
                      <h3>Detail Pembayaran</h3>
                      <p>Nominal: {paymentDetails.nominal}</p>
                      <p>Status: {paymentDetails.status}</p>
                      <p>Bukti_Transfer: {paymentDetails.bukti_tf}</p>
                      <p>ID Guru: {paymentDetails.teacher_id}</p>
                    </div>
                  ) : (
                    <p>Memuat data pembayaran...</p>
                  )}
                </div>
              ) : (
                <p>Belum ada Payment ID yang tersimpan.</p>
              )}  */}
              {/* Card Section */}
              <div className="bg-white shadow-lg rounded-lg p-6 w-full mx-auto mt-8">
                <h2 className="text-2xl font-bold mb-4">
                  Panduan Pembayaran Pendaftaran
                </h2>

                <div className="mb-4">
                  <p className="text-gray-700">
                    Kepada ananda <span>{profileData?.nama_siswa}</span> harap
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
              {/* Lampiran Bukti Detail Transfer Section */}
              <div className="bg-white shadow-lg rounded-lg p-6 w-full mx-auto mt-8">
                {dataPembayaran ? (
                  <>
                    <h2 className="text-2xl font-bold mb-4">
                      Lampiran Bukti Transfer
                    </h2>

                    <div className="mb-4">
                      <p>
                        Bukti transfer anda berhasil di upload, lihat
                        lampirannya di bawah ini
                      </p>
                      <p className="text-gray-700">
                        <span className="font-semibold">Status:</span>{" "}
                        {dataPembayaran?.status}
                      </p>

                      {/* Bungkus tombol dalam div flex-col */}
                      <div className="flex flex-col space-y-4">
                        <button
                          onClick={handlePopupToggle}
                          className="bg-green-500 text-white px-4 py-2 rounded w-[250px]"
                        >
                          Lihat Lampiran
                        </button>

                        {/* Tambahan button berdasarkan status */}
                        {dataPembayaran?.status === 0 && (
                          <button className="bg-transparent border-yellow-500 border-2 text-yellow-500 px-4 py-2 rounded w-[250px]">
                            Menunggu Verifikasi dari Admin
                          </button>
                        )}
                        {dataPembayaran?.status === 1 && (
                          <button className="bg-transparent border-green-500 border-2 text-customGreen px-4 py-2 rounded w-[250px]">
                            Pembayaran Berhasil
                          </button>
                        )}
                      </div>

                      {/* Pop-up untuk menampilkan bukti transfer */}
                      {showPopup && (
                        <div
                          className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center"
                          onClick={handlePopupToggle}
                        >
                          <div
                            className="bg-white p-6 rounded-lg shadow-lg relative"
                            onClick={(e) => e.stopPropagation()} // Prevent click inside pop-up from closing it
                          >
                            {dataPembayaran.bukti_tf ? (
                              <img
                                src={dataPembayaran.bukti_tf}
                                alt="Bukti Transfer"
                                style={{ width: "300px", height: "auto" }}
                              />
                            ) : (
                              <p>Bukti transfer tidak tersedia.</p>
                            )}
                            <button
                              onClick={handlePopupToggle}
                              className="bg-red-500 text-white px-4 py-2 mt-4 rounded absolute top-2 right-2"
                            >
                              Tutup
                            </button>
                          </div>
                        </div>
                      )}
                      {/* Tampilkan data pembayaran lainnya jika diperlukan */}
                    </div>
                  </>
                ) : (
                  /*Card Upload Bukti Transfer*/

                  <>
                    <h2 className="text-2xl font-bold mb-4">
                      Lampiran Bukti Transfer
                    </h2>

                    <div className="py-8">
                      <Form.Field className="mb-2 w-[450px]">
                        <label>Upload Bukti Transfer</label>
                        {!values.bukti_tf ? (
                          <DropzoneFile
                            handleDrop={(cont) => {
                              setFieldValue("bukti_tf", cont);
                            }}
                          />
                        ) : (
                          <div className="flex items-center space-x-2">
                            <Button
                              icon="delete"
                              color="red"
                              onClick={() => setFieldValue("bukti_tf", "")}
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

                    <div className="my-4">
                      {/* Checkbox */}
                      <div className="pb-4">
                        <label className="flex items-center">
                          <input
                            type="checkbox"
                            className="form-checkbox h-5 w-5 text-green-600"
                          />
                          <span className="ml-2 text-md">
                            Saya setuju dengan kententuan bahwa{" "}
                            <a className="text-red-500 font-semibold">
                              {" "}
                              "Uang Yang Sudah Di Transfer Tidak Bisa
                              Dikembalikan Dengan Alasan Atau Kondisi Apapun"
                            </a>
                          </span>
                        </label>
                      </div>
                      <p>
                        Dalam hadits abu Hurairah disebutkan bahwa Rasulullah
                        shallallahu ‘alaihi wa sallam bersabda:
                      </p>
                      <p className="text-2xl font-semibold">
                        الْمُسْلِمُونَ عَلَى شُرُوطِهِمْ
                      </p>
                      <p className="font-semibold text-md">
                        “Kaum muslimin wajib mematuhi perjanjian yang telah
                        mereka sepakati.”
                      </p>
                      <p>
                        (HR. Abu Daud no 3594. Al Hafizh Abu Thohir mengatakan
                        bahwa sanad hadits ini hasan).
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
                  </>
                )}
                {/* <p>{dataPembayaran.bukti_tf}</p> */}
              </div>
            </Form>

            {/* <h3>Daftar Pembayaran</h3>
            <ul>
              {payments.map((payment) => (
                <li key={payment.id}>
                  <p>Keterangan: {payment.keterangan}</p>
                  <p>Nominal: {payment.nominal}</p>
                  <p>Dari: {payment.guru.nama_guru}</p>
                  <p>
                    Status:{" "}
                    {payment.status === 0
                      ? "Belum Dikonfirmasi"
                      : "Dikonfirmasi"}
                  </p>
                  <img
                    src={payment.bukti_tf}
                    alt="Bukti Transfer"
                    width={100}
                  />
                </li>
              ))}
            </ul> */}

            {/* Popup Success Modal */}
            <Modal
              size="mini"
              open={openModal}
              onClose={() => setOpenModal(false)}
            >
              <Modal.Content>
                <p>Pembayaran Berhasil</p>
              </Modal.Content>
            </Modal>
          </>
        )}
      </Formik>
    </LayoutPpdb>
  );
};

export default BuktiTransfer;
