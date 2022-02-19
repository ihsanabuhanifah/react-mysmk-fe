import React from "react";
import { Formik } from "formik";
import * as Yup from "yup";
import { login } from "../../api/auth";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";

const LoginSchema = Yup.object().shape({
  email: Yup.string().email().required("Wajib di isi"),
  password: Yup.string()
    .min(8, "Password minimal 8 Karakter")
    .required("wajib di isi"),
  loginAs: Yup.number().required("Wajib di pilih"),
});
export default function Login() {
  const initialState = {
    email: "",
    password: "",
    loginAs: "",
  };
  let navigate = useNavigate();
  const onSubmit = async (values) => {
    try {
      const result = await login(values);
      Cookies.set("mysmk_token", result.data.token, {
        expires: 7,
      });

      if (result.data.role === "Guru") {
        return navigate("/guru");
      }
      console.log(result.data.role);
      if (result.data.role === "Wali Santri") {
        return navigate("/siswa");
      }
    } catch (err) {
      if (err.response.status === 422) {
        return console.log(err.response.data.msg);
      }
      if (err.response.status === 404) {
        return console.log(err.response.data.msg);
      }
      return console.log("periksa koneksi internet anda");
    }
  };

  return (
    <React.Fragment>
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
          <form onSubmit={handleSubmit}>
            <div>
              {/* <label htmlFor="email">email</label> */}
              <input
                id="email"
                name="email"
                placeholder="email"
                error={errors.email && touched.email}
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.email}
                disabled={isSubmitting}
              />
              {errors.email && touched.email && (
                <p className="text-red-500 text-sm">{errors.email}</p>
              )}
            </div>
            <div>
              {/* <label htmlFor="email">email</label> */}
              <input
                id="password"
                name="password"
                placeholder="password"
                error={errors.password && touched.password}
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.password}
                disabled={isSubmitting}
              />
              {errors.password && touched.password && (
                <p className="text-red-500 text-sm">{errors.password}</p>
              )}
            </div>
            <div>
              <select
                id="loginAs"
                name="loginAs"
                placeholder="loginAs"
                error={errors.loginAs && touched.loginAs}
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.loginAs}
                disabled={isSubmitting}
              >
                <option value={null}>Pilih</option>
                <option value={1}>Super Admin</option>
                <option value={2}>Admin</option>
                <option value={3}>Kepala Sekolah</option>
                <option value={4}>Guru</option>
                <option value={5}>Musyrif</option>
                <option value={6}>Wali Kelas</option>
                <option value={7}>Keuangan</option>
                <option value={8}>Santri</option>
              </select>
              {errors.loginAs && touched.loginAs && (
                <p className="text-red-500 text-sm">{errors.loginAs}</p>
              )}
            </div>
            <div>
              <button type="submit">
                {isSubmitting ? "Process" : "Login"}
              </button>
            </div>
          </form>
        )}
      </Formik>
    </React.Fragment>
  );
}
