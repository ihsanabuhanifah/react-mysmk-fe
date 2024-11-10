/* eslint-disable jsx-a11y/anchor-is-valid */
import React from "react";
import { Formik, Form } from "formik";
import Banner from "../../../image/ppdb/backgroundKosong.png";
import LogoMq from "../../../image/ppdb/ppdb.png";
import Laptop from "../../../image/ppdb/laptop.png";
import { Link, useNavigate } from "react-router-dom";
import { Button, Icon, Label, Message } from "semantic-ui-react";
import Cookies from "js-cookie";
import * as yup from "yup";
import { loginPpdb } from "../../../api/ppdb/ppdbAuth";
import { Input } from "../../../components/input";

// Skema validasi menggunakan yup
const LoginPpdbSchema = yup.object().shape({
  email: yup
    .string()
    .email("Format email tidak valid")
    .nullable()
    .test(
      "email-or-no_hp",
      "Email atau nomor HP wajib diisi",
      function (value) {
        const { no_hp } = this.parent;
        return value || no_hp; // Passes if either email or no_hp has a value
      }
    ),
  no_hp: yup
    .string()
    .matches(/^\d+$/, "Format nomor HP tidak valid")
    .nullable()
    .test(
      "email-or-no_hp",
      "Email atau nomor HP wajib diisi",
      function (value) {
        const { email } = this.parent;
        return value || email; // Passes if either email or no_hp has a value
      }
    ),
  password: yup
    .string()
    .min(8, "Password minimal 8 karakter")
    .required("Silahkan isi password!"),
});

const LoginPpdb = () => {
  const [showPassword, setShowPassword] = React.useState(false);
  const navigate = useNavigate();

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const initialState = {
    email: "",
    no_hp: "",
    password: "",
  };

  const onSubmit = async (values, { setErrors }) => {
    try {
      const result = await loginPpdb({
        email: values.email || undefined,
        no_hp: values.no_hp || undefined,
        password: values.password,
      });

      console.log("Respons dari API:", result.data); // Logging seluruh data respons

      Cookies.set("mysmk_token", result.data.token, {
        expires: 7,
      });

      // Validasi jika role tidak ditemukan
      if (!result.data.user.role) {
        setErrors({
          msg: "Role tidak ditemukan dalam respons. Periksa akun Anda!",
        });
        return;
      }

      // Validasi hanya role 'Calon Santri' yang bisa masuk
      if (result.data.user.role.toLowerCase() !== "calon santri") {
        setErrors({ msg: "Hanya Calon Santri yang dapat masuk!" });
        return;
      }

      // Jika role adalah 'Calon Santri', navigasikan ke dashboard PPDB
      return navigate("/ppdb/dashboard");
    } catch (err) {
      setErrors(err.response?.data || { msg: "Periksa koneksi internet Anda" });
      console.log("Periksa koneksi internet Anda");
    }
  };

  return (
    <Formik
      initialValues={initialState}
      validationSchema={LoginPpdbSchema}
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
                  <div className="flex flex-col">
                    <p className="text-2xl font-medium mt-12">Masuk Aplikasi</p>
                    <p className="text-lg">
                      Silahkan masuk untuk mengikuti rangkaian proses PSB secara
                      Online
                    </p>
                  </div>

                  <div className="lg:mt-11">
                    <p className="text-lg font-normal">
                      Email atau No Handphone
                    </p>
                    <Input
                      placeholder="Masukkan email atau nomor handphone anda"
                      name="email"
                      onChange={(e) => {
                        const value = e.target.value;
                        handleChange(e);

                        if (/^\d+$/.test(value)) {
                          // Jika input berupa nomor, set ke no_hp
                          setFieldValue("no_hp", value);
                          setFieldValue("email", ""); // Kosongkan email jika nomor diisi
                        } else {
                          // Jika input berupa email, set ke email
                          setFieldValue("email", value);
                          setFieldValue("no_hp", ""); // Kosongkan no_hp jika email diisi
                        }
                      }}
                      onBlur={handleBlur}
                      value={values.email || values.no_hp}
                      disabled={isSubmitting}
                      error={
                        (errors.email && touched.email) ||
                        (errors.no_hp && touched.no_hp)
                          ? {
                              content: `${errors.email || errors.no_hp}`,
                              pointing: "above",
                            }
                          : null
                      }
                      size="normal"
                      style={{
                        width: "100%",
                        maxWidth: "609px",
                        paddingLeft: "15px",
                      }}
                    />
                    {(errors.email || errors.no_hp) && (
                      <Label basic color="red" pointing>
                        {errors.email || errors.no_hp}
                      </Label>
                    )}

                    {/* Password Input */}
                    <p className="text-lg font-medium mt-6">Password</p>
                    <div className="relative w-full max-w-[609px]">
                      <Input
                        placeholder="Masukkan Password anda"
                        name="password"
                        type={showPassword ? "text" : "password"} // Toggle between text and password
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
                        style={{
                          width: "100%",
                          maxWidth: "609px",
                          paddingLeft: "15px",
                        }}
                      />
                      {/* Toggle password visibility icon */}
                      <Icon
                        name={showPassword ? "eye slash" : "eye"} // Choose icon based on showPassword state
                        link
                        onClick={togglePasswordVisibility} // Toggle password visibility
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer"
                      />
                    </div>
                    {errors.password && touched.password && (
                      <Label basic color="red" pointing>
                        {errors.password}
                      </Label>
                    )}
                    <div className="flex flex-col items-center mt-8 relative w-full max-w-[609px]">
                      <div className="w-full flex">
                        <Button
                          content={isSubmitting ? "Proses" : "Masuk"}
                          type="submit"
                          size="medium"
                          color="green"
                          loading={isSubmitting}
                          disabled={isSubmitting}
                          style={{ width: "100%", maxWidth: "609px" }}
                          className="absolute left-0 hover:shadow-md"
                        />
                      </div>
                    </div>
                    <Link
                      to="/ppdb/register"
                      className="my-16 w-full flex justify-center md:mr-18"
                    >
                      <p className="text-base text-gray-500 text-center lg:-ml-16">
                        Anda belum terdaftar?
                        <a className="hover:underline" href="#">
                          Daftar sekarang
                        </a>
                      </p>
                    </Link>
                  </div>
                </div>
                {errors.msg && (
                  <Message color="red" className="mt-4 w-full max-w-[609px]">
                    {errors.msg}
                  </Message>
                )}
              </div>
              <div className="relative w-full lg:w-[491px] h-full">
                <img
                  src={Laptop}
                  alt="Laptop"
                  className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-1/2 w-[600px] h-[400px] object-cover z-20 lg:block hidden lg:max-w-[1024px]:hidden"
                />
              </div>
            </section>
          </div>
        </Form>
      )}
    </Formik>
  );
};

export default LoginPpdb;
