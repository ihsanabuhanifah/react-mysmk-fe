/* eslint-disable no-unused-vars */
import { useDetailPembayaran } from "../../../api/ppdb/pembayaran";
import { useProfileCalonSantri } from "../../../api/ppdb/profile";
import {
  CreateWawancara,
  fetchWawancaraDetails,
  useDetailWawancara,
} from "../../../api/ppdb/wawancara";
import LayoutPpdb from "../../../module/layoutPpdb";
import * as yup from "yup";
import { toast } from "react-toastify";
import { Formik } from "formik";
import { Button, Form, Input, Select, TextArea } from "semantic-ui-react";
import DropzoneFile from "../../../components/Dropzone";
import {
  CreateLampiranBuktiDaftarUlang,
  fetchPaymentDaftarUlangDetails,
  useDetailDaftarUlang,
} from "../../../api/ppdb/daftarUlang";
import { useEffect, useState } from "react";
import { format, parseISO } from "date-fns";
import { useQueryClient } from "react-query";

const WawancaraSchema = yup.object().shape({
  method: yup.string().nullable().required("Method harus di isi!"),
  tanggal: yup.string().nullable().required("Tanggal harus di isi!"),
  catatan: yup.string().nullable().optional(),
});

// Simulasi user login (sesuaikan dengan logika login dari backend-mu)
const getUser = () => {
  return localStorage.getItem("currentUser") || "UserA"; // UserA or UserB
};

const Wawancara = () => {
  const { profileData } = useProfileCalonSantri();
  const { dataWawancara, error, isError } = useDetailWawancara();
  const { dataPembayaran } = useDetailPembayaran();
  const [wawancaraId, setWawancaraId] = useState(null); // State untuk menyimpan paymentId
  const [openModal, setOpenModal] = useState(false);
  const [wawancaraDetails, setWawancaraDetails] = useState(null); // Menyimpan data pembayaran
  const [showPopup, setShowPopup] = useState(false);
  const [isUploaded, setIsUploaded] = useState(false); // Status upload
  const handlePopupToggle = () => {
    setShowPopup(!showPopup);
  };
  const queryClient = useQueryClient();
  const [initialValues, setInitialValues] = useState({
    method: "",
    tanggal: "",
    catatan: "",
  });

  // Fetch data setelah wawancaraId tersimpan
  useEffect(() => {
    if (wawancaraId) {
      const getWawancaraDetails = async () => {
        try {
          const response = await fetchWawancaraDetails(wawancaraId); // Panggil API untuk data berdasarkan wawancaraId
          setWawancaraDetails(response.data); // Simpan data wawancara di state
        } catch (error) {
          console.error("Error fetching wawancara details:", error);
        }
      };
      getWawancaraDetails(); // Panggil fungsi untuk fetch data
    }
  }, [wawancaraId]);

  const onSubmit = async (values, { setSubmitting, resetForm }) => {
    try {
      const updatedValues = {
        ...values,
        pewawancara: 2, // Mengisi pewawancara dengan nilai 2
      };

      const response = await CreateWawancara(updatedValues);
      const wawancaraId = response.data?.data?.id;

      // Simpan paymentId ke dalam state
      setWawancaraId(wawancaraId);

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

      // Invalidate cache query terkait wawancara
      queryClient.invalidateQueries(dataWawancara);
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

  // Check if profileData is incomplete
  const isPembayaranIncomplete = dataPembayaran
    ? Object.values(dataPembayaran).some((value) => value === null)
    : true;

  return (
    <LayoutPpdb title="Test Wawancara">
      {isPembayaranIncomplete ? (
        <div className="card bg-red-100 p-4 rounded-md shadow-md">
          <p className="text-red-600 font-semibold">
            Silahkan lakukan pembayaran terlebih dahulu!
          </p>
        </div>
      ) : (
        <Formik
          initialValues={initialValues}
          validationSchema={WawancaraSchema}
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
                <div className="bg-white shadow-lg border-2 rounded-lg p-6 w-full mx-auto mt-8">
                  <h2 className="text-2xl font-bold mb-4">
                    Panduan Test Wawancara
                  </h2>

                  <div className="mb-4">
                    <p className="text-gray-700">
                      Kepada ananda <span>{profileData?.nama_siswa}</span> yang
                      sudah melunasi biaya pendaftaran sebagai syarat untuk bisa
                      mengikuti rangkaian proses penerimaan santri baru SMK
                      Madinatul Quran.
                    </p>
                  </div>

                  <div className="mt-6">
                    <p>
                      Setelah melakukan pembayaran, silahkan untuk{" "}
                      <span>{profileData?.nama_siswa}</span> mengikuti test
                      wawancara.
                    </p>
                  </div>
                </div>
                {/* Lampiran Bukti Detail Transfer Section */}
                <div className="bg-white shadow-lg border-2 rounded-lg p-6 w-full mx-auto mt-8">
                  {dataWawancara ? (
                    <>
                      <div className="space-y-4">
                        <div className="flex items-center space-x-3">
                          <div className="w-6 h-6 bg-green-500 text-white rounded-full flex items-center justify-center">
                            <span className="font-semibold text-sm">M</span>
                          </div>
                          <p className="text-gray-600 text-lg">
                            <span className="font-semibold">
                              Metode Wawancara:
                            </span>{" "}
                            {dataWawancara?.method}
                          </p>
                        </div>

                        <div className="flex items-center space-x-3">
                          <div className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center">
                            <span className="font-semibold text-sm">T</span>
                          </div>
                          <p className="text-gray-600 text-lg">
                            <span className="font-semibold">
                              Tanggal Wawancara:
                            </span>{" "}
                            {dataWawancara?.tanggal}
                          </p>
                        </div>

                        <div className="flex items-center space-x-3">
                          <div className="w-6 h-6 bg-yellow-500 text-white rounded-full flex items-center justify-center">
                            <span className="font-semibold text-sm">G</span>
                          </div>
                          <p className="text-gray-600 text-lg">
                            <span className="font-semibold">
                              Guru Wawancara:
                            </span>{" "}
                            {dataWawancara?.guruWawancara?.nama_guru}
                          </p>
                        </div>

                        <div className="flex items-center space-x-3">
                          <div className="w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center">
                            <span className="font-semibold text-sm">S</span>
                          </div>
                          <p className="text-gray-600 text-lg">
                            <span className="font-semibold">Status Tes:</span>{" "}
                            {dataWawancara?.status_tes}
                          </p>
                        </div>

                        <div className="text-sm text-red-500 mt-4">
                          <p>
                            *Untuk wawancara gelombang 1 dilakukan mulai pukul
                            08.00 - 11.00
                          </p>
                          <p>Dan untuk gelombang 2 mulai pukul 01.30 - 15.00</p>
                        </div>
                      </div>
                    </>
                  ) : (
                    /*Card Lampiran Test Wawancara Transfer*/
                    <>
                      <h2 className="text-2xl font-bold mb-4">
                        Lampiran Test Wawancara
                      </h2>

                      <div className="py-8">
                        <Form.Field>
                          <label className="font-semibold">
                            Metode Wawancara
                          </label>
                          <Select
                            placeholder="Pilih Metode Wawancara"
                            name="method"
                            value={values.method}
                            onChange={(_, { value }) =>
                              setFieldValue("method", value)
                            }
                            options={[
                              {
                                key: "online",
                                value: "Online",
                                text: "Online",
                              },
                              {
                                key: "offline",
                                value: "Offline",
                                text: "Offline",
                              },
                            ]}
                            error={
                              touched.method && errors.method
                                ? errors.method
                                : null
                            }
                          />
                          {touched.method && errors.method && (
                            <div className="text-sm text-red-600">
                              {errors.method}
                            </div>
                          )}
                        </Form.Field>

                        <Form.Field
                          control={Input}
                          label="Tanggal Wawancara"
                          name="tanggal"
                          onChange={handleChange}
                          onBlur={handleBlur}
                          value={
                            values.tanggal
                              ? format(parseISO(values.tanggal), "yyyy-MM-dd")
                              : ""
                          }
                          disabled={isSubmitting}
                          fluid
                          error={
                            errors.tanggal &&
                            touched.tanggal && {
                              content: `${errors?.tanggal}`,
                              pointing: "above",
                            }
                          }
                          type="date"
                        />
                        <Form.Field>
                          <label className="font-semibold">
                            Catatan Wawancara
                          </label>
                          <TextArea
                            name="catatan"
                            value={values.catatan}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            error={
                              touched.catatan && errors.catatan
                                ? errors.catatan
                                : null
                            }
                            placeholder="Masukkan catatan wawancara jika ada..."
                          />
                          {touched.catatan && errors.catatan && (
                            <div className="text-sm text-red-600">
                              {errors.catatan}
                            </div>
                          )}
                        </Form.Field>
                      </div>

                      <div className="my-4">
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
                        color="green"
                        disabled={isSubmitting}
                        loading={isSubmitting}
                      >
                        {isSubmitting ? "Menyimpan..." : "Submit Wawancara"}
                      </Button>
                    </>
                  )}
                </div>
              </Form>
            </>
          )}
        </Formik>
      )}
    </LayoutPpdb>
  );
};

export default Wawancara;
