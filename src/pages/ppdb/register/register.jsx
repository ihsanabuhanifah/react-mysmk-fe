import React, { useState } from "react";
import { Formik } from "formik";
import { Link, useNavigate } from "react-router-dom";
import * as yup from "yup";
import Banner from "../../../image/ppdb/backgorund.png";
import LogoMq from "../../../image/ppdb/ppdb.png";
import { Button, Form, Select } from "semantic-ui-react";
import { registerPpdb } from "../../../api/ppdb/ppdbAuth";
import Cookies from "js-cookie";
import { Input } from "../../../components/input";

// Skema validasi menggunakan yup
const RegisterPpdbSchema = yup.object().shape({
  name: yup.string().nullable().default("").required("wajib di isi"),
  email: yup.string().email().nullable().default("").required("Wajib diisi"),
  no_hp: yup.string().nullable().default("").required("wajib di isi"),
  password: yup
    .string()
    .nullable()
    .default("")
    .required("Wajib isi")
    .min(8, "Minimal 8 karakater"),
  passwordConfirmation: yup
    .string()
    .nullable()
    .default("")
    .required("Wajib isi")
    .min(8, "Minimal 8 karakater"),
});

const RegisterPpdb = () => {
  const [showPassword, setShowPassword] = React.useState(false);
  const [showPopup, setShowPopup] = React.useState(false);
  const navigate = useNavigate();

  const initialState = {
    name: "",
    email: "",
    no_hp: "",
    password: "",
    passwordConfirmation: "",
    loginAs: "", // Pastikan ini ada dalam initial state
  };

  const rolesOptions = [{ key: 11, value: 11, text: "Calon Santri" }];

  const onSubmit = async (values, { setErrors }) => {
    try {
      console.log(values);
      const result = await registerPpdb(values); // Pastikan fungsi login tersedia dan berfungsi dengan benar
      console.log(result);

      Cookies.set("mysmk_token", result.data.token, {
        expires: 7,
      });

      setShowPopup(true);
      setTimeout(() => {
        setShowPopup(false);
        navigate("/ppdb/login");
      }, 3000);
    } catch (err) {
      setErrors(err.response?.data || { msg: "Periksa koneksi internet Anda" });
      console.log("Periksa koneksi internet Anda");
    }
  };

  const handleNoHpClick = (setFieldValue) => {
    setFieldValue("no_hp", "62");
  };

  const Popup = () => (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white p-6 rounded shadow-lg text-center">
        <h2 className="text-2xl font-bold mb-4">Registrasi Berhasil!</h2>
        <p className="mb-4">Anda akan diarahkan ke halaman login...</p>
        <Button
          onClick={() => {
            setShowPopup(false);
            navigate("/ppdb/login");
          }}
          color="green"
        >
          OK
        </Button>
      </div>
    </div>
  );

  return (
    <>
      {showPopup && <Popup />}
      <Formik
        initialValues={initialState}
        validationSchema={RegisterPpdbSchema}
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
          <body className="bg-imageAbstrak h-screen overflow-hidden">
            <section className="relative flex flex-wrap lg:h-screen h-full">
              <div className="relative w-full lg:w-1/2 h-full lg:h-screen">
                <img
                  src={Banner}
                  alt="Banner"
                  className="absolute inset-0 h-full w-full object-cover"
                />
                <div className="absolute top-4 left-4">
                  <img
                    alt="LogoMq"
                    src={LogoMq}
                    width={200} // sesuaikan dengan ukuran yang diinginkan
                    height={200} // sesuaikan dengan ukuran yang diinginkan
                  />
                </div>
              </div>
              <div className="w-full px-4 py-12 sm:px-6 sm:py-16 lg:w-1/2 lg:px-8 lg:py-24 flex items-center justify-center">
                <div className="mx-auto max-w-lg text-left">
                  <h1 className="text-2xl font-bold sm:text-3xl">
                    Ayo bergabung bersama Kami!
                  </h1>
                  <p className="mt-2 text-gray-500">
                    Silahkan isi data di bawah ini untuk membuat akun di
                    Aplikasi PSB Online SMK MADINATULQUR’AN
                  </p>

                  <Form onSubmit={handleSubmit}>
                    <Form.Field
                      control={Input}
                      label="username"
                      placeholder="Masukkan Nama Anda"
                      name="name"
                      onChange={handleChange}
                      onBlur={handleBlur}
                      value={values.name}
                      disabled={isSubmitting}
                      fluid
                      icon={"envelope"}
                      iconPosition="left"
                      error={
                        errors.name &&
                        touched.name && {
                          content: `${errors.name}`,
                          pointing: "above",
                        }
                      }
                      type="text"
                    />
                    <Form.Field
                      control={Input}
                      label="No Handphone"
                      placeholder="Masukkan Nomor  Anda"
                      name="no_hp"
                      onChange={handleChange}
                      onBlur={handleBlur}
                      onClick={() => handleNoHpClick(setFieldValue)}
                      value={values.no_hp}
                      disabled={isSubmitting}
                      fluid
                      icon={"phone"}
                      iconPosition="left"
                      error={
                        errors.no_hp &&
                        touched.no_hp && {
                          content: `${errors.no_hp}`,
                          pointing: "above",
                        }
                      }
                      type="text"
                    />
                    <Form.Field
                      control={Input}
                      label="Email"
                      placeholder="Masukkan Email Anda"
                      name="email"
                      onChange={handleChange}
                      onBlur={handleBlur}
                      value={values.email}
                      disabled={isSubmitting}
                      fluid
                      icon={"envelope"}
                      iconPosition="left"
                      error={
                        errors.email &&
                        touched.email && {
                          content: `${errors.email}`,
                          pointing: "above",
                        }
                      }
                      type="email"
                    />
                    <Form.Field
                      control={Input}
                      label="Password"
                      placeholder="Masukkan Password"
                      name="password"
                      onChange={handleChange}
                      onBlur={handleBlur}
                      value={values.password}
                      disabled={isSubmitting}
                      fluid
                      icon={{
                        name: showPassword ? "eye slash" : "eye",
                        circular: true,
                        link: true,
                        onClick: () => setShowPassword(!showPassword),
                      }}
                      iconPosition="left"
                      error={
                        errors.password &&
                        touched.password && {
                          content: `${errors.password}`,
                          pointing: "above",
                        }
                      }
                      type={showPassword ? "text" : "password"}
                    />
                    <Form.Field
                      control={Input}
                      label="Konfirmasi Password"
                      placeholder="Masukkan konfirmasi password"
                      name="passwordConfirmation"
                      onChange={handleChange}
                      onBlur={handleBlur}
                      value={values.passwordConfirmation}
                      disabled={isSubmitting}
                      fluid
                      icon={{
                        name: showPassword ? "eye slash" : "eye",
                        circular: true,
                        link: true,
                        onClick: () => setShowPassword(!showPassword),
                      }}
                      iconPosition="left"
                      error={
                        errors.passwordConfirmation &&
                        touched.passwordConfirmation && {
                          content: `${errors.passwordConfirmation}`,
                          pointing: "above",
                        }
                      }
                      type={showPassword ? "text" : "password"}
                    />

                    <div className="flex flex-col items-center justify-center">
                      <Button
                        content={isSubmitting ? "Proses" : "Daftar"}
                        type="submit"
                        fluid
                        size="medium"
                        color="green"
                        loading={isSubmitting}
                        disabled={isSubmitting}
                      />

                      {/* <Link to="/ppdb/login" className="my-4">
                        <p className="text-sm text-gray-500">
                          Kembali Ke -
                          <a className="hover:underline" href="#">
                            Login
                          </a>
                        </p>
                      </Link> */}
                    </div>
                  </Form>
                </div>
              </div>
            </section>
          </body>
        )}
      </Formik>
    </>
  );
};

export default RegisterPpdb;
