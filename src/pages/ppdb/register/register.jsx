import React, { useState } from "react";
import { Formik } from "formik";
import { Link, useNavigate } from "react-router-dom";
import * as yup from "yup";
import Banner from "../../../image/ppdb/backgorund.png";
import Bannerregister from "../../../image/ppdb/BannerRegister.png";
import LogoMq from "../../../image/ppdb/ppdb.png";
import LogoMqWhite from "../../../image/ppdb/ppdbwhite.png";
import { Button, Form, Select } from "semantic-ui-react";
import { registerPpdb } from "../../../api/ppdb/ppdbAuth";
import Cookies from "js-cookie";
import { Input, Label } from "../../../components/input";

// Skema validasi menggunakan yup
const RegisterPpdbSchema = yup.object().shape({
  name: yup.string().nullable().default("").required("wajib di isi!"),
  email: yup.string().email().nullable().default("").required("Wajib diisi!"),
  no_hp: yup.string().nullable().default("").required("wajib di isi!"),
  password: yup
    .string()
    .nullable()
    .default("")
    .required("Wajib isi!")
    .min(8, "Minimal 8 karakater"),
  passwordConfirmation: yup
    .string()
    .nullable()
    .default("")
    .required("Wajib isi!")
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
    role:"Calon Santri"
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
          <div className="overflow-hidden">
            <section className="relative flex flex-wrap lg:h-screen h-full">
              <div
                className="relative w-full lg:w-1/2 hidden lg:block"
                style={{ height: "811px" }}
              >
                <img
                  src={Bannerregister}
                  alt="Banner"
                  className="absolute inset-0 w-full object-cover rounded-br-lg"
                  style={{ height: "811px" }}
                />
                <div className="absolute top-0 left-0 mt-5 p-0 bg-white rounded-tr-full rounded-br-full shadow-lg px-3 py-4 pr-12">
                  <img
                    alt="LogoMq"
                    src={LogoMq}
                    width={200}
                    height={200}
                    className="block"
                  />
                </div>
              </div>

              <div className="relative lg:hidden mt-5 flex items-center justify-center  bg-customGreen rounded-br-full rounded-tr-full shadow-lg px-3 py-4 pr-12">
                <img
                  alt="LogoMq"
                  src={LogoMqWhite}
                  width={200}
                  height={200}
                  className="block"
                />
              </div>

              <div className="w-full px-4 py-12 sm:px-6 sm:py-16 lg:w-1/2 lg:px-8 lg:py-24 flex items-center justify-center mt-10">
                <div className="mx-auto max-w-sm text-left">
                  <h1 className="text-2xl font-bold sm:text-3xl">
                    Ayo bergabung bersama SMK Madinatulquran!
                  </h1>
                  {/* <p className="mt-2 text-gray-500">
                    Silahkan isi data di bawah ini untuk membuat akun di
                    Aplikasi PSB Online SMK MADINATULQUR’AN
                  </p> */}

                  <Form onSubmit={handleSubmit}>
                    <p>Username</p>
                    <Input
                      placeholder="Masukan nama Kamu"
                      name="name"
                      onChange={handleChange}
                      onBlur={handleBlur}
                      value={values.name}
                      disabled={isSubmitting}
                      error={!!errors.name && touched.name}
                    />
                    {errors.name && touched.name && (
                      <Label basic color="red" pointing>
                        {errors.name}
                      </Label>
                    )}

                    <p>No Handphone</p>
                    <Input
                      placeholder="masukan Nomor kamu"
                      name="no_hp"
                      onChange={handleChange}
                      onBlur={handleBlur}
                      onClick={() => handleNoHpClick(setFieldValue)}
                      value={values.no_hp}
                      disabled={isSubmitting}
                      error={
                        errors.no_hp &&
                        touched.no_hp && {
                          content: `${errors.no_hp}`,
                          pointing: "above",
                        }
                      }
                      type="text"
                    />

                    <p>Email</p>
                    <Input
                      placeholder="Masukan email Kamu"
                      name="email"
                      onChange={handleChange}
                      onBlur={handleBlur}
                      value={values.email}
                      disabled={isSubmitting}
                      error={
                        errors.email &&
                        touched.email && {
                          content: `${errors.email}`,
                          pointing: "above",
                        }
                      }
                      type="text"
                    />

                    <p>Password</p>
                    <Input
                      placeholder="Masukan password Kamu"
                      name="password"
                      onChange={handleChange}
                      onBlur={handleBlur}
                      value={values.password}
                      disabled={isSubmitting}
                      error={
                        errors.password &&
                        touched.password && {
                          content: `${errors.password}`,
                          pointing: "above",
                        }
                      }
                      type={showPassword ? "text" : "password"}
                    />

                    <p>Konfirmasi Password</p>
                    <Input
                      placeholder="Masukan password Kamu"
                      name="passwordConfirmation"
                      onChange={handleChange}
                      onBlur={handleBlur}
                      value={values.passwordConfirmation}
                      disabled={isSubmitting}
                      error={
                        errors.passwordConfirmation &&
                        touched.passwordConfirmation && {
                          content: `${errors.passwordConfirmation}`,
                          pointing: "above",
                        }
                      }
                      type={showPassword ? "text" : "password"}
                    />

                    <div className="flex flex-col items-center justify-center mt-8">
                      <Button
                        content={isSubmitting ? "Proses" : "Daftar"}
                        type="submit"
                        fluid
                        size="medium"
                        color="green"
                        loading={isSubmitting}
                        disabled={isSubmitting}
                      />

                      <Link to="/ppdb/login" className="my-4">
                        <p className="text-sm text-gray-500">
                          Kembali Ke -{" "}
                          <a className="hover:underline" href="#">
                            Login
                          </a>
                        </p>
                      </Link>
                    </div>
                  </Form>
                </div>
              </div>
            </section>
          </div>
        )}
      </Formik>
    </>
  );
};

export default RegisterPpdb;
