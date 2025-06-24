import React, { useState } from "react";
import * as yup from "yup";
import { Formik } from "formik";
import { Link, useNavigate } from "react-router-dom";
import { Button, Form } from "semantic-ui-react";
import { Input } from "../../../components/input";
import { CreateDataCalonSantri } from "../../../api/ppdb/pendaftaran";
import LayoutPpdb from "../../../module/layoutPpdb";
import { toast } from "react-toastify";

const PendaftaranCalonSantriSchema = yup.object().shape({
  nama_siswa: yup.string().nullable().default("").required("wajib di isi!"),
  tanggal_lahir: yup.string().nullable().default("").required("Wajib diisi!"),
  tempat_lahir: yup.string().nullable().default("").required("wajib di isi!"),
  alamat: yup.string().nullable().default("").required("wajib di isi!"),
  sekolah_asal: yup.string().nullable().default("").required("wajib di isi!"),
});

const PendaftaranCalonSantri = () => {
  const navigate = useNavigate();
  const [currentCard, setCurrentCard] = useState(1);

  const initialState = {
    nama_siswa: "",
    tanggal_lahir: "",
    tempat_lahir: "",
    alamat: "",
    sekolah_asal: "",
  };

  const onSubmit = async (values, { setSubmitting, resetForm }) => {
    try {
      const response = await CreateDataCalonSantri(values);

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
        navigate("/ppdb/dashboard");
      }, 2000);
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
    <LayoutPpdb title="Informasi Calon Santri">
      <Formik
        initialValues={initialState}
        validationSchema={PendaftaranCalonSantriSchema}
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
          isSubmitting,
        }) => (
          <main className="bg-imageAbstrak object-cover min-h-screen overflow-hidden">
            <div className="text-center h-full flex items-center justify-center">
              <Form onSubmit={handleSubmit}>
                {currentCard === 1 && (
                  <div className="card p-6 border rounded shadow-lg bg-white w-full sm:w-[90%] md:max-w-[800px] lg:max-w-[1237px] h-auto px-4 py-6 mt-20">
                    <div className="w-full flex flex-col mb-4">
                      <label className="block text-left pb-4">
                        Nama Calon Santri
                      </label>
                      <Input
                        placeholder="Masukan nama anda"
                        name="nama_siswa"
                        onChange={handleChange}
                        onBlur={handleBlur}
                        value={values.nama_siswa}
                        disabled={isSubmitting}
                        type="text"
                        className="w-full"
                      />
                      {errors.nama_siswa && touched.nama_siswa && (
                        <div className="text-red-500 text-sm mt-1 text-left">
                          {errors.nama_siswa}
                        </div>
                      )}
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4 mb-4 pt-8">
                      <div className="w-full sm:w-[555px] flex flex-col">
                        <label className="block text-left pb-4">
                          Tanggal Lahir
                        </label>
                        <Input
                          placeholder="Pilih tanggal lahir"
                          name="tanggal_lahir"
                          onChange={handleChange}
                          onBlur={handleBlur}
                          value={values.tanggal_lahir}
                          disabled={isSubmitting}
                          type="date"
                          className="w-full"
                        />
                        {errors.tanggal_lahir && touched.tanggal_lahir && (
                          <div className="text-red-500 text-sm mt-1 text-left">
                            {errors.tanggal_lahir}
                          </div>
                        )}
                      </div>

                      <div className="w-full sm:w-[555px] flex flex-col">
                        <label className="block text-left pb-4">
                          Tempat Lahir
                        </label>
                        <Input
                          placeholder="Masukan Tempat Lahir anda"
                          name="tempat_lahir"
                          onChange={handleChange}
                          onBlur={handleBlur}
                          value={values.tempat_lahir}
                          disabled={isSubmitting}
                          type="text"
                          className="w-full"
                        />
                        {errors.tempat_lahir && touched.tempat_lahir && (
                          <div className="text-red-500 text-sm mt-1 text-left">
                            {errors.tempat_lahir}
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4 mb-4 pt-8">
                      <div className="w-full sm:w-[555px] flex flex-col">
                        <label className="block text-left pb-4">
                          Asal Sekolah
                        </label>
                        <Input
                          placeholder="Masukan nama sekolah asal anda"
                          name="sekolah_asal"
                          onChange={handleChange}
                          onBlur={handleBlur}
                          value={values.sekolah_asal}
                          disabled={isSubmitting}
                          type="text"
                          className="w-full"
                        />
                        {errors.sekolah_asal && touched.sekolah_asal && (
                          <div className="text-red-500 text-sm mt-1 text-left">
                            {errors.sekolah_asal}
                          </div>
                        )}
                      </div>

                      <div className="w-full sm:w-[555px] flex flex-col">
                        <label className="block text-left pb-4">Alamat</label>
                        <Input
                          placeholder="Masukan alamat Anda"
                          name="alamat"
                          onChange={handleChange}
                          onBlur={handleBlur}
                          value={values.alamat}
                          disabled={isSubmitting}
                          type="text"
                          className="w-full"
                        />
                        {errors.alamat && touched.alamat && (
                          <div className="text-red-500 text-sm mt-1 text-left">
                            {errors.alamat}
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row justify-between mb-4 mt-4 gap-4">
                      <Link to={"/ppdb/dashboard"}>
                        <button className="bg-btnCustom text-white p-4 w-full sm:w-[150px] rounded-lg">
                          Back
                        </button>
                      </Link>
                      <Button
                        content={isSubmitting ? "Proses" : "Submit"}
                        type="submit"
                        size="medium"
                        color="green"
                        loading={isSubmitting}
                        disabled={isSubmitting}
                        className="w-full sm:w-[150px]"
                      />
                    </div>
                  </div>
                )}
              </Form>
            </div>
          </main>
        )}
      </Formik>
    </LayoutPpdb>
  );
};

export default PendaftaranCalonSantri;
