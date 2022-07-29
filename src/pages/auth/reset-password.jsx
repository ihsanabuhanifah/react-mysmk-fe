import React from "react";
import { Formik } from "formik";
import * as Yup from "yup";
import { postResetPassword } from "../../api/auth";
import Cookies from "js-cookie";
import { useNavigate, useParams } from "react-router-dom";

import { Form, Button, Image, Input, Select, Message } from "semantic-ui-react";
import { toast } from "react-toastify";
import Layout from "./Layout";

const LoginSchema = Yup.object().shape({
  newPassword: Yup.string()
    .min(8, "Password minimal 8 karakter")
    .required("Password Wajib diisi"),
  confirmPassword: Yup.string()
    .min(8, "Konfirmasi Password minimal 8 karakter")
    .oneOf(
      [Yup.ref("newPassword")],
      "Password dan Password Konfirmasi tidak sama"
    )
    .required("Password Wajib diisi"),
});

export default function ResetPassword() {
  let [showPassword, setShowPassword] = React.useState(false);

  const initialState = {
    newPassword: "",
    confirmPassword: "",
  };
  let navigate = useNavigate();
  let { id, token } = useParams();

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
      const result = await postResetPassword(id, token, values);

      console.log(result);

      toast.success(result.data?.status, {
        position: "top-right",
        autoClose: 1000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
      });
      return navigate("/login");
    } catch (err) {
      setErrors(err.response.data);
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
                      <div>
                        <Image src={LogoMySMK} />
                        <Image src={SMKMQ} />
                      </div>
                    </div> */}
            <div className="mb-5 space-y-5">
              <h1 className="text-3xl font-black">Lupa Password</h1>
              <p>Input Perubahan Passwword</p>
            </div>
            {errors.msg !== undefined && (
              <Message color="red">
                {" "}
                {errors.msg},{" "}
                <button
                  type="button"
                  onClick={() => {
                    return navigate("/lupa-password");
                  }}
                >
                  Klik disini
                </button>{" "}
                untuk Request Ulang
              </Message>
            )}
            <Form.Field
              control={Input}
              label="Kata Sandi Baru"
              placeholder="Masukan Kata Sandi Baru"
              name="newPassword"
              onChange={handleChange}
              onBlur={handleBlur}
              value={values.newPassword}
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
                errors.newPassword &&
                touched.newPassword && {
                  content: `${errors?.newPassword}`,
                  pointing: "above",
                }
              }
              type={showPassword ? "text" : "password"}
            />{" "}
            <Form.Field
              control={Input}
              label="Kata Sandi Konfirmasi"
              placeholder="Masukan Kata Sandi Konfirmasi"
              name="confirmPassword"
              onChange={handleChange}
              onBlur={handleBlur}
              value={values.confirmPassword}
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
                errors.confirmPassword &&
                touched.confirmPassword && {
                  content: `${errors?.confirmPassword}`,
                  pointing: "above",
                }
              }
              type={showPassword ? "text" : "password"}
            />{" "}
            <Button
              content={isSubmitting ? "Proses" : "Masuk"}
              type="submit"
              fluid
              size="medium"
              color="green"
              loading={isSubmitting}
              disabled={isSubmitting}
            />
          </Form>
        )}
      </Formik>
    </Layout>
  );
}
