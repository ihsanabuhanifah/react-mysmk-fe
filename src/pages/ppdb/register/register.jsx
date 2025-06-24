import React from "react";
import { Formik } from "formik";
import { Link, useNavigate } from "react-router-dom";
import * as yup from "yup";
import Bannerregister from "../../../image/ppdb/BannerRegister.png";
import LogoMq from "../../../image/ppdb/ppdb.png";
import { Button, Form, Message, Checkbox } from "semantic-ui-react";
import { registerPpdb } from "../../../api/ppdb/ppdbAuth";
import Cookies from "js-cookie";
import { Input } from "../../../components/input";

const RegisterPpdbSchema = yup.object().shape({
  name: yup.string().required("Nama wajib diisi"),
  email: yup.string().email("Email tidak valid").required("Email wajib diisi"),
  no_hp: yup.string().required("Nomor HP wajib diisi"),
  password: yup
    .string()
    .required("Password wajib diisi")
    .min(8, "Password minimal 8 karakter"),
  passwordConfirmation: yup
    .string()
    .required("Konfirmasi password wajib diisi")
    .oneOf([yup.ref("password"), null], "Password tidak cocok"),
  infoSource: yup
    .array()
    .min(1, "Pilih minimal satu sumber informasi")
    .required("Sumber informasi wajib dipilih"),
});

const infoSourceOptions = [
  { key: 'instagram', value: 'Instagram', label: 'Instagram' },
  { key: 'facebook', value: 'Facebook', label: 'Facebook' },
  { key: 'whatsapp', value: 'WhatsApp', label: 'WhatsApp' },
  { key: 'tiktok', value: 'TikTok', label: 'TikTok' },
  { key: 'teman', value: 'Teman', label: 'Teman' },
  { key: 'keluarga', value: 'Keluarga', label: 'Keluarga' },
  { key: 'kegiatan_sekolah', value: 'Kegiatan Sekolah', label: 'Kegiatan Sekolah' },
  { key: 'spanduk', value: 'Spanduk', label: 'Spanduk/Banner' },
  { key: 'website', value: 'Website Sekolah', label: 'Website Sekolah' },
  { key: 'lainnya', value: 'Lainnya', label: 'Lainnya' },
];

const RegisterPpdb = () => {
  const [showPassword, setShowPassword] = React.useState(false);
  const [showPopup, setShowPopup] = React.useState(false);
  const [backendError, setBackendError] = React.useState(null);
  const navigate = useNavigate();

  const initialState = {
    name: "",
    email: "",
    no_hp: "",
    password: "",
    passwordConfirmation: "",
    loginAs: "11",
    infoSource: [],
    otherInfoSource: "",
  };

  const onSubmit = async (values, { setErrors, setSubmitting }) => {
    try {
      setBackendError(null);
      
      // Prepare data for API
      const submitData = {
        ...values,
        // Combine infoSource with otherInfoSource if 'other' is selected
        infoSource: values.infoSource.includes('other') 
          ? [...values.infoSource.filter(src => src !== 'other'), values.otherInfoSource]
          : values.infoSource
      };

      const result = await registerPpdb(submitData);

      Cookies.set("mysmk_token", result.data.token, {
        expires: 7,
      });

      setShowPopup(true);
      setTimeout(() => {
        setShowPopup(false);
        navigate("/ppdb/login");
      }, 3000);
    } catch (err) {
      setSubmitting(false);
      if (err.response?.data?.errors) {
        setErrors(err.response.data.errors);
      } else if (err.response?.data?.msg) {
        setBackendError(err.response.data.msg);
      } else {
        setBackendError("Terjadi kesalahan. Silakan coba lagi.");
      }
    }
  };

  const handleNoHpClick = (setFieldValue, values) => {
    if (!values.no_hp) {
      setFieldValue("no_hp", "62");
    }
  };

  const Popup = () => (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white p-6 rounded-lg shadow-xl text-center w-11/12 max-w-md">
        <h2 className="text-2xl font-bold mb-4 text-green-600">Registrasi Berhasil!</h2>
        <p className="mb-6 text-gray-700">Anda akan diarahkan ke halaman login...</p>
        <Button
          onClick={() => {
            setShowPopup(false);
            navigate("/ppdb/login");
          }}
          color="green"
          className="w-full"
        >
          OK
        </Button>
      </div>
    </div>
  );

  return (
    <>
      {showPopup && <Popup />}
      <div className="min-h-screen bg-gray-50">
        <section className="relative bg-imageAbstrak flex flex-col lg:flex-row">
          {/* Left Side (Banner) */}
          <div className="lg:w-1/2 hidden lg:block relative h-screen">
            <img
              src={Bannerregister}
              alt="Banner"
              className="absolute inset-0 w-full h-full object-cover"
            />
            <div className="absolute top-8 left-0 bg-white rounded-r-full shadow-md px-6 py-3 pr-16">
              <img
                alt="LogoMq"
                src={LogoMq}
                width={180}
                height={180}
                className="block"
              />
            </div>
            <div className="absolute bottom-10 left-0 right-0 text-center text-white px-8">
              <h2 className="text-3xl font-bold mb-4">SMK Madinatulquran</h2>
              <p className="text-lg">Membentuk generasi qurani yang berakhlak mulia dan berprestasi</p>
            </div>
          </div>

          {/* Right Side (Form) */}
          <div className="lg:w-1/2 w-full flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
            <div className="w-full max-w-md">
              <div className="text-center mb-8 lg:hidden">
                <h1 className="text-2xl font-bold text-gray-800">SMK Madinatulquran</h1>
                <p className="text-gray-600 mt-2">Mendaftar sebagai calon santri baru</p>
              </div>

              <div className="bg-white p-8 rounded-xl shadow-lg">
                <h1 className="text-2xl font-bold text-gray-800 mb-6 text-center">
                  Daftar Akun Baru
                </h1>

                {backendError && (
                  <Message negative className="mb-6">
                    <Message.Header>Gagal Registrasi</Message.Header>
                    <p>{backendError}</p>
                  </Message>
                )}

                <Formik
                  initialValues={initialState}
                  validationSchema={RegisterPpdbSchema}
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
                    <Form onSubmit={handleSubmit} className="space-y-5">
                      {/* Existing fields (name, email, no_hp, password, passwordConfirmation) */}
                      {/* ... */}

                       <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Nama Lengkap
                        </label>
                        <Input
                          placeholder="Masukkan nama lengkap"
                          name="name"
                          onChange={handleChange}
                          onBlur={handleBlur}
                          value={values.name}
                          disabled={isSubmitting}
                          error={touched.name && !!errors.name}
                          className="w-full"
                        />
                        {touched.name && errors.name && (
                          <p className="mt-1 text-sm text-red-600">{errors.name}</p>
                        )}
                      </div>
                       <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Nomor Handphone
                        </label>
                        <Input
                          placeholder="Masukkan nomor handphone"
                          name="no_hp"
                          onChange={handleChange}
                          onBlur={handleBlur}
                          onClick={() => handleNoHpClick(setFieldValue, values)}
                          value={values.no_hp}
                          disabled={isSubmitting}
                          error={touched.no_hp && !!errors.no_hp}
                          className="w-full"
                        />
                        {touched.no_hp && errors.no_hp && (
                          <p className="mt-1 text-sm text-red-600">{errors.no_hp}</p>
                        )}
                      </div>
                         <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Email
                        </label>
                        <Input
                          placeholder="Masukkan email aktif"
                          name="email"
                          onChange={handleChange}
                          onBlur={handleBlur}
                          value={values.email}
                          disabled={isSubmitting}
                          error={touched.email && !!errors.email}
                          className="w-full"
                        />
                        {touched.email && errors.email && (
                          <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                        )}
                      </div>
                       <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Password
                        </label>
                        <Input
                          placeholder="Buat password minimal 8 karakter"
                          name="password"
                          onChange={handleChange}
                          onBlur={handleBlur}
                          value={values.password}
                          disabled={isSubmitting}
                          error={touched.password && !!errors.password}
                          type={showPassword ? "text" : "password"}
                          className="w-full"
                        />
                        {touched.password && errors.password && (
                          <p className="mt-1 text-sm text-red-600">{errors.password}</p>
                        )}
                      </div>
 <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Konfirmasi Password
                        </label>
                        <Input
                          placeholder="Ulangi password Anda"
                          name="passwordConfirmation"
                          onChange={handleChange}
                          onBlur={handleBlur}
                          value={values.passwordConfirmation}
                          disabled={isSubmitting}
                          error={touched.passwordConfirmation && !!errors.passwordConfirmation}
                          type={showPassword ? "text" : "password"}
                          className="w-full"
                        />
                        {touched.passwordConfirmation && errors.passwordConfirmation && (
                          <p className="mt-1 text-sm text-red-600">{errors.passwordConfirmation}</p>
                        )}
                      </div>


                      {/* New Info Source Field */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Dari mana Anda mengetahui informasi PPDB ini? (Boleh pilih lebih dari satu)
                        </label>
                        <div className="space-y-2">
                          {infoSourceOptions.map((option) => (
                            <div key={option.key} className="flex items-center">
                              <Checkbox
                                name="infoSource"
                                value={option.value}
                                checked={values.infoSource.includes(option.value)}
                                onChange={(e, { checked }) => {
                                  const newValue = checked
                                    ? [...values.infoSource, option.value]
                                    : values.infoSource.filter(v => v !== option.value);
                                  setFieldValue("infoSource", newValue);
                                }}
                                className="!mr-2"
                              />
                              <label className="text-sm text-gray-700">
                                {option.label}
                              </label>
                            </div>
                          ))}
                        </div>
                        {values.infoSource.includes('other') && (
                          <div className="mt-3">
                            <Input
                              placeholder="Sebutkan sumber lainnya"
                              name="otherInfoSource"
                              onChange={handleChange}
                              onBlur={handleBlur}
                              value={values.otherInfoSource}
                              disabled={isSubmitting}
                              className="w-full mt-2"
                            />
                          </div>
                        )}
                        {touched.infoSource && errors.infoSource && (
                          <p className="mt-1 text-sm text-red-600">
                            {errors.infoSource}
                          </p>
                        )}
                      </div>

                      {/* Show Password Checkbox */}
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          id="showPassword"
                          checked={showPassword}
                          onChange={() => setShowPassword(!showPassword)}
                          className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                        />
                        <label htmlFor="showPassword" className="ml-2 block text-sm text-gray-700">
                          Tampilkan Password
                        </label>
                      </div>

                      <Button
                        type="submit"
                        color="green"
                        fluid
                        size="large"
                        loading={isSubmitting}
                        disabled={isSubmitting}
                        className="mt-6 bg-green-600 hover:bg-green-700 focus:ring-green-500"
                      >
                        {isSubmitting ? "Mendaftarkan..." : "Daftar Sekarang"}
                      </Button>
                    </Form>
                  )}
                </Formik>

                <div className="mt-6 text-center">
                  <p className="text-sm text-gray-600">
                    Sudah punya akun?{" "}
                    <Link
                      to="/ppdb/login"
                      className="font-medium text-green-600 hover:text-green-500"
                    >
                      Masuk disini
                    </Link>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default RegisterPpdb;