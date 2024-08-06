/* eslint-disable jsx-a11y/anchor-is-valid */
import React from "react";
import { Formik } from "formik";
import Banner from "../../../image/ppdb/backgorund.png";
import LogoMq from "../../../image/ppdb/ppdb.png";
import { Link, useNavigate } from "react-router-dom";
import { Button, Form, Input, Message, Select } from "semantic-ui-react";
import Cookies from "js-cookie";
import * as yup from "yup";
import { loginPpdb } from "../../../api/ppdb/ppdbAuth";

// Skema validasi menggunakan yup
const LoginPpdbSchema = yup.object().shape({
  email: yup.string().email().required("Wajib diisi"),
  password: yup
    .string()
    .min(8, "Password minimal 8 karakter")
    .required("Wajib diisi"),
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
            <section className="relative flex flex-wrap lg:h-screen lg:items-center">
              <div className="w-full px-4 py-12 sm:px-6 sm:py-16 lg:w-1/2 lg:px-8 lg:py-24">
                <div className="mx-auto max-w-lg text-center">
                  <div className="w-full flex justify-center mb-4">
                    <img
                      alt="LogoMq"
                      src={LogoMq}
                      width={200} // sesuaikan dengan ukuran yang diinginkan
                      height={200} // sesuaikan dengan ukuran yang diinginkan
                    />
                  </div>
                  <h1 className="text-2xl font-bold sm:text-3xl">
                    Selamat Datang!
                  </h1>
                  <p className="mt-4 text-gray-500">
                    Lorem ipsum dolor sit amet consectetur adipisicing elit. Et
                    libero nulla eaque error neque ipsa culpa autem, at itaque
                    nostrum!
                  </p>
                </div>
                {errors.msg && <Message color="red"> {errors.msg}</Message>}
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
                  label="Kata Sandi"
                  placeholder="Masukkan Kata Sandi"
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
                {/* <Form.Field
                  control={Select}
                  options={rolesOptions}
                  label={{
                    children: "Masuk Sebagai",
                    htmlFor: "loginAs",
                    name: "loginAs",
                  }}
                  onChange={(event, data) => {
                    setFieldValue("loginAs", data.value);
                  }}
                  onBlur={handleBlur}
                  value={values.loginAs}
                  disabled={isSubmitting}
                  placeholder="Pilih Role"
                  error={
                    errors.loginAs &&
                    touched.loginAs && {
                      content: `${errors?.loginAs}`,
                      pointing: "above",
                    }
                  }
                  search
                  searchInput={{ id: "loginAs", name: "loginAs" }}
                /> */}
                <div className="flex flex-col items-center justify-center">
                  <Button
                    content={isSubmitting ? "Proses" : "Masuk"}
                    type="submit"
                    fluid
                    size="medium"
                    color="green"
                    loading={isSubmitting}
                    disabled={isSubmitting}
                  />
                  <Link to="/ppdb/register" className="my-4">
                    <p className="text-sm text-gray-500">
                      Tidak Punya akun?
                      <a className="underline" href="#">
                        Daftar
                      </a>
                    </p>
                  </Link>
                </div>
              </div>

              <div className="relative h-64 w-full sm:h-96 lg:h-full lg:w-1/2">
                <img
                  alt="Banner"
                  src={Banner}
                  layout="fill"
                  className="absolute inset-0 h-full w-full object-cover"
                />
              </div>
            </section>
          </Form>
        )}
      </Formik>
    </>
  );
};

export default LoginPpdb;
