/* eslint-disable jsx-a11y/anchor-is-valid */
import React from "react";
import { ErrorMessage, Formik } from "formik";
import Banner from "../../../image/ppdb/backgroundKosong.png";
import LogoMq from "../../../image/ppdb/ppdb.png";
import Laptop from "../../../image/ppdb/laptop.png";
import { Link, useNavigate } from "react-router-dom";
import { Button, Form, Icon, Message, Select } from "semantic-ui-react";
import Cookies from "js-cookie";
import * as yup from "yup";
import { loginPpdb } from "../../../api/ppdb/ppdbAuth";
import { Input, Label } from "../../../components/input";

// Skema validasi menggunakan yup
const LoginPpdbSchema = yup.object().shape({
  email: yup.string().email().required("Wajib diisi!"),
  password: yup
    .string()
    .min(8, "Password minimal 8 karakter")
    .required("Wajib diisi!"),
});

const LoginPpdb = () => {
  const [showPassword, setShowPassword] = React.useState(false);
  const navigate = useNavigate(); // Panggil useNavigate di dalam komponen

  const initialState = {
    email: "",
    password: "",
    loginAs: "Calon Santri",
  };

  const rolesOptions = [
    { key: 1, value: 1, text: "Super Admin" },
    { key: 2, value: 2, text: "Admin" },
    { key: 3, value: 3, text: "Kepala Sekolah" },
    { key: 4, value: 4, text: "Guru" },
    { key: 5, value: 5, text: "Musyrif" },
    { key: 6, value: 6, text: "Wali Kelas" },
    { key: 7, value: 7, text: "Keuangan" },
    { key: 9, value: 9, text: "Santri" },
    { key: 11, value: 11, text: "Calon Santri" },
  ];

  const onSubmit = async (values, { setErrors }) => {
    try {
      console.log(values);
      const result = await loginPpdb(values); // Pastikan fungsi login tersedia dan berfungsi dengan benar
      console.log(result);

      Cookies.set("mysmk_token", result.data.token, {
        expires: 7,
      });

      navigate("/ppdb/dashboard");
    } catch (err) {
      setErrors(err.response?.data || { msg: "Periksa koneksi internet Anda" });
      console.log("Periksa koneksi internet Anda");
    }
  };

  return (
    <>
      <Formik
        initialValues={initialState}
        validationSchema={LoginPpdbSchema}
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
          <Form onSubmit={handleSubmit}>
            <div className="relative w-full lg:w-[518px] h-full lg:absolute lg:right-0 hidden lg:block">
              <img
                src={Banner}
                alt="Banner"
                className="h-full w-full object-cover"
              />
            </div>

            <div className="bg-imageAbstrak relative w-full h-screen overflow-hidden z-10">
              <div className="mb-12">
                <img
                  alt="LogoMq"
                  src={LogoMq}
                  width={200}
                  height={200}
                  className="absolute top-0 left-0 m-5 p-0"
                />
              </div>
              <section className="relative flex flex-wrap justify-between h-full items-center">
                <div className="w-full px-4 py-12 sm:px-6 sm:py-16 lg:w-1/2 lg:px-8 lg:py-24 mt-12">
                  <div className="relative w-full max-w-[609px]">
                    <p className="text-lg font-medium mt-12">
                      Silahkan masukan email dan password anda untuk login!
                    </p>

                    <div className="lg:mt-20">
                      <p className="text-lg font-normal">Email</p>
                      <Input
                        placeholder="Masukan email kamu"
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
                        size="normal"
                        style={{ width: "100%", maxWidth: "609px" }} // Mengatur width input menjadi 609px maksimal, dan responsif
                      />
                      {errors.email && touched.email && (
                        <Label basic color="red" pointing>
                          {errors.email}
                        </Label>
                      )}
                      <p className="text-lg font-medium mt-6">Password</p>
                      <Input
                        placeholder="Masukan Password kamu"
                        name="password"
                        type={showPassword ? "text" : "password"}
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
                        size="normal"
                        style={{ width: "100%", maxWidth: "609px" }} // Mengatur width input menjadi 609px maksimal, dan responsif
                      />
                      {errors.password && touched.password && (
                        <Label basic color="red" pointing>
                          {errors.password}
                        </Label>
                      )}
                      <span
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer"
                        onClick={() => setShowPassword(!showPassword)}
                      ></span>
                      <div className="flex flex-col items-center mt-12 relative w-full max-w-[609px]">
                        <div className="w-full flex">
                          <Button
                            content={isSubmitting ? "Proses" : "Masuk"}
                            type="submit"
                            size="medium"
                            color="green"
                            loading={isSubmitting}
                            disabled={isSubmitting}
                            style={{ width: "100%", maxWidth: "609px" }} // Set width of the button to 609px maximum and responsive
                            className="absolute left-0"
                          />
                        </div>
                      </div>
                      <Link
                        to="/ppdb/register"
                        className="my-16 w-full flex justify-center md:mr-18"
                      >
                        <p className="text-sm text-gray-500 text-center -ml-16">
                          {/* Adjust margin-left */}
                          Tidak Punya akun?
                          <a className="underline" href="#">
                            Daftar
                          </a>
                        </p>
                      </Link>
                    </div>
                  </div>
                  {errors.msg && (
                    <Message color="red" className="mt-4">
                      {errors.msg}
                    </Message>
                  )}
                </div>
                <div className="relative w-full lg:w-[491px] h-full ">
                  {/* <img
                    src={Banner}
                    alt="Banner"
                    className="absolute inset-0 h-full w-full object-cover"
                  /> */}
                  <img
                    src={Laptop}
                    alt="Laptop"
                    className="hidden lg:block absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-1/2 w-[600px] h-[400px] object-cover z-20"
                  />
                </div>
              </section>
            </div>
          </Form>
        )}
      </Formik>
    </>
  );
};

export default LoginPpdb;
