import React from "react";
import { Formik } from "formik";
import * as Yup from "yup";
import { postLupaPassword, postResetPassword } from "../../api/auth";
import { useNavigate, useSearchParams } from "react-router-dom";

import { Form, Button, Input, Message } from "semantic-ui-react";
import { toast } from "react-toastify";
import Layout from "./Layout";

const TOKEN_LENGTH = 6;
const RESEND_COOLDOWN = 60; // detik

const ResetSchema = Yup.object().shape({
  email: Yup.string().email("Email tidak valid").required("Email wajib diisi"),
  token: Yup.string()
    .length(TOKEN_LENGTH, `Kode harus ${TOKEN_LENGTH} karakter`)
    .required("Kode wajib diisi"),
  newPassword: Yup.string()
    .min(8, "Password minimal 8 karakter")
    .required("Password Wajib diisi"),
  confirmPassword: Yup.string()
    .oneOf(
      [Yup.ref("newPassword")],
      "Password dan Password Konfirmasi tidak sama"
    )
    .required("Password Wajib diisi"),
});

const toastOptions = {
  position: "top-right",
  autoClose: 2000,
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
  theme: "colored",
};

export default function ResetPassword() {
  const [showPassword, setShowPassword] = React.useState(false);
  const [cooldown, setCooldown] = React.useState(RESEND_COOLDOWN);
  const [resending, setResending] = React.useState(false);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  React.useEffect(() => {
    if (cooldown <= 0) return;
    const t = setTimeout(() => setCooldown((c) => c - 1), 1000);
    return () => clearTimeout(t);
  }, [cooldown]);

  const initialState = {
    email: searchParams.get("email") || "",
    token: "",
    newPassword: "",
    confirmPassword: "",
  };

  const onSubmit = async (values, { setErrors }) => {
    try {
      const result = await postResetPassword({
        email: values.email,
        token: values.token,
        newPassword: values.newPassword,
      });
      toast.success(result.data?.msg || "Password berhasil diubah", toastOptions);
      return navigate("/login");
    } catch (err) {
      setErrors(
        err?.response?.data || { msg: "Periksa koneksi internet anda" }
      );
    }
  };

  const resendCode = async (email, setErrors) => {
    if (!email) {
      return setErrors({ email: "Isi email terlebih dahulu" });
    }
    try {
      setResending(true);
      const result = await postLupaPassword({ email });
      toast.success(result.data?.msg || "Kode baru telah dikirim", toastOptions);
      setCooldown(RESEND_COOLDOWN);
      setErrors({});
    } catch (err) {
      setErrors(
        err?.response?.data || { msg: "Periksa koneksi internet anda" }
      );
    } finally {
      setResending(false);
    }
  };

  return (
    <Layout>
      <Formik
        initialValues={initialState}
        validationSchema={ResetSchema}
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
          setErrors,
          isSubmitting,
        }) => (
          <Form onSubmit={handleSubmit}>
            <div className="mb-5 space-y-3">
              <h1 className="text-3xl font-black">Reset Password</h1>
              <p className="text-gray-600">
                Masukkan kode {TOKEN_LENGTH} karakter yang dikirim ke email Anda,
                lalu buat password baru.
              </p>
            </div>

            {errors.msg !== undefined && (
              <Message color="red">{errors.msg}</Message>
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
              icon="envelope"
              iconPosition="left"
              type="email"
              error={
                errors.email &&
                touched.email && { content: `${errors.email}`, pointing: "above" }
              }
            />

            <Form.Field
              control={Input}
              label="Kode Reset"
              placeholder="ABC123"
              name="token"
              autoComplete="one-time-code"
              onChange={(e) =>
                setFieldValue(
                  "token",
                  e.target.value
                    .toUpperCase()
                    .replace(/[^A-Z0-9]/g, "")
                    .slice(0, TOKEN_LENGTH)
                )
              }
              onBlur={handleBlur}
              value={values.token}
              disabled={isSubmitting}
              fluid
              icon="key"
              iconPosition="left"
              input={{
                style: {
                  letterSpacing: "0.5em",
                  fontWeight: 700,
                  fontFamily: "monospace",
                  textTransform: "uppercase",
                },
                maxLength: TOKEN_LENGTH,
              }}
              error={
                errors.token &&
                touched.token && { content: `${errors.token}`, pointing: "above" }
              }
            />

            <div className="-mt-2 mb-4 text-sm text-right">
              {cooldown > 0 ? (
                <span className="text-gray-500">
                  Kirim ulang kode dalam {cooldown} detik
                </span>
              ) : (
                <button
                  type="button"
                  className="text-green-600 font-medium"
                  disabled={resending}
                  onClick={() => resendCode(values.email, setErrors)}
                >
                  {resending ? "Mengirim..." : "Kirim ulang kode"}
                </button>
              )}
            </div>

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
                  content: `${errors.newPassword}`,
                  pointing: "above",
                }
              }
              type={showPassword ? "text" : "password"}
            />

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
                  content: `${errors.confirmPassword}`,
                  pointing: "above",
                }
              }
              type={showPassword ? "text" : "password"}
            />

            <Button
              content={isSubmitting ? "Proses" : "Simpan Password Baru"}
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
                onClick={() => navigate("/login")}
                type="button"
              >
                Kembali ke Login
              </button>
            </div>
          </Form>
        )}
      </Formik>
    </Layout>
  );
}
