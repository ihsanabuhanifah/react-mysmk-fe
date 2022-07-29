/* eslint-disable no-unused-vars */
import React from "react";
import { Formik } from "formik";
import * as Yup from "yup";
import { login } from "../../api/auth";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import LoginImage from "../../image/login.png";
import { Form, Button, Image, Input, Select, Message } from "semantic-ui-react";
import Layout from "./Layout";

const LoginSchema = Yup.object().shape({
  email: Yup.string().email().required("Wajib di isi"),
  password: Yup.string()
    .min(8, "Password minimal 8 Karakter")
    .required("wajib di isi"),
  loginAs: Yup.number().required("Wajib di pilih"),
});

export default function Login() {
  let [showPassword, setShowPassword] = React.useState(false);

  const initialState = {
    email: "",
    password: "",
    loginAs: 4,
  };
  let navigate = useNavigate();
  const rolesOptions = [
    { key: 1, value: 1, text: "Super Admin" },
    { key: 2, value: 2, text: "Admin" },
    { key: 3, value: 3, text: "Kepala Sekolah" },
    { key: 4, value: 4, text: "Guru" },
    { key: 5, value: 5, text: "Musyrif" },
    { key: 6, value: 6, text: "Wali Kelas" },
    { key: 7, value: 7, text: "Keuangan" },
    { key: 9, value: 9, text: "Santri" },
  ];
  const onSubmit = async (values, { setErrors }) => {
    try {
      console.log(values);
      const result = await login(values);

      Cookies.set("mysmk_token", result.data.token, {
        expires: 7,
      });

      if (result.data.role === "Guru") {
        return navigate("/guru/dashboard");
      }
      console.log(result.data.role);
      if (result.data.role === "Wali Santri") {
        return navigate("/siswa/dashboard");
      }
    } catch (err) {
      setErrors(err.response.data);

      return console.log("periksa koneksi internet anda");
    }
  };

  return (
    <Layout>
      <Formik
        initialValues={initialState}
        validationSchema={LoginSchema}
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
            {/* <div className="flex justify-center items-center mb-14">
                      <div className="h-24 w-24">
                        <Image src={LogoMySMK} />
                        <Image src={SMKMQ} />
                      </div>
                    </div> */}
            <div className="mb-5 space-y-5">
              <h1 className="text-3xl font-black">Login</h1>
              <p>Silahkan Login mengguankan akun yang sudah diberikan</p>
            </div>
            {errors.msg !== undefined && (
              <Message color="red"> {errors.msg}</Message>
            )}
            <Form.Field
              control={Input}
              label="Email"
              placeholder="Masukan Email"
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
                  content: `${errors?.email}`,
                  pointing: "above",
                }
              }
              type="email"
            />
            <Form.Field
              control={Input}
              label="Kata Sandi"
              placeholder="Masukan Kata Sandi"
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
                  content: `${errors?.password}`,
                  pointing: "above",
                }
              }
              type={showPassword ? "text" : "password"}
            />{" "}
            <Form.Field
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
            />
            <Button
              content={isSubmitting ? "Proses" : "Masuk"}
              type="submit"
              fluid
              size="medium"
              color="green"
              loading={isSubmitting}
              disabled={isSubmitting}
            />
            <div className="flex items-center justify-center">
              <button
                className="text-green-500 mt-5 font-poppins"
                onClick={() => {
                  return navigate("/lupa-password");
                }}
                type="button "
              >
                Lupa Password ?
              </button>
            </div>
          </Form>
        )}
      </Formik>
    </Layout>
  );
}
