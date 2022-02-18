import React from "react";
import Layout from "../../components/layout/auth";
import Button from "../../components/templates/Button";
import Input from "../../components/templates/Input";
import Label from "../../components/templates/Label";
import ErrorMessage from "../../components/templates/ErrorMessage";
import { Formik } from "formik";
import * as Yup from "yup";
import { useDispatch, useSelector } from "react-redux";
import { authLogin } from "../../redux/actions/authAction";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
const RegisterSchema = Yup.object().shape({
  email: Yup.string().email().required("Wajib di isi"),
  password: Yup.string()
    .min(8, "Password minimal 8 Karakter")
    .required("wajib di isi"),
});

export default function Login() {
  const [errorBE, setErrorBE] = React.useState({});
  const initialState = {
    email: "",
    password: "",
  };

  const isLoading = useSelector((state) => state.auth.isLoading);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const onSubmit = async (values) => {
    const result = await dispatch(authLogin(values));
    console.log("result", result);
    if (result.status === "fail") {
      setErrorBE(result);
      alert(result?.msg)
    }
    if (result.status === "Success") return navigate("/dashboard");
  };
  return (
    <Layout>
      <div className="w-3/4 px-10">
        <h1 className="text-xl uppercase font-bold  mb-10">login Page</h1>

        <p className="text-red-500 italic">{errorBE?.msg}</p>
        <Formik
          initialValues={initialState}
          validationSchema={RegisterSchema}
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
            <form className="grid gri-cols-1 gap-5" onSubmit={handleSubmit}>
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  placeholder="email"
                  error={errors.email && touched.email}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.email}
                  disabled={isSubmitting}
                ></Input>
                {errors.email && touched.email && (
                  <ErrorMessage>{errors.email}</ErrorMessage>
                )}
              </div>
              <div>
                <Label htmlFor="password">password</Label>
                <Input
                  id="password"
                  name="password"
                  placeholder="password"
                  error={errors.password && touched.password}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.password}
                  disabled={isSubmitting}
                ></Input>
                {errors.password && touched.password && (
                  <ErrorMessage>{errors.password}</ErrorMessage>
                )}
              </div>

              <div>
                <button
                  type="submit"
                  className="p-2 bg-blue-500 w-full text-white"
                >
                  {isLoading ? "Process ..." : "Login"}
                </button>
                {/* <Button block variant="solid" htmlType="submit" color="red">
                  Klik
                </Button> */}
              </div>
            </form>
          )}
        </Formik>
        <Link to="/register">Register</Link>
        <Link to="/dashboard">Dashboard</Link>
      </div>
    </Layout>
  );
}
