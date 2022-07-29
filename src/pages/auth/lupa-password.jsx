import React from "react";
import { Formik } from "formik";
import * as Yup from "yup";
import { postLupaPassword } from "../../api/auth";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import LogoMySMK from "../../image/MySMK.png";
import SMKMQ from "../../image/MADINATULQURAN.png";
import { toast } from "react-toastify";
import { Form, Button, Image, Input, Select, Message } from "semantic-ui-react";

const LoginSchema = Yup.object().shape({
  email: Yup.string().email().required("Wajib di isi"),
});

export default function LupaPassword() {
  let [pesan, setPesan] = React.useState("");
  const initialState = {
    email: "",
  };
  let navigate = useNavigate();

  const onSubmit = async (values, { setErrors }) => {
    try {
      const result = await postLupaPassword(values);

      console.log(result);
      setPesan(result?.data?.msg);
      return toast.success(result.data?.status, {
        position: "top-right",
        autoClose: 1000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
      });
    } catch (err) {
      setErrors(err.response.data);

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
          <div className="w-screen h-screen flex items-center justify-center bg-gray-200 ">
          <div className="grid grid-cols-8  h-full w-full  lg:h-2/3 lg:w-2/3 bg-white border  ">
            <div className=" col-span-1 lg:col-span-5  h-full w-full bg-green-500 "></div>
              <div className=" col-span-7 lg:col-span-3 h-full w-full flex items-center justify-center ">
                <div className="w-[80%]">
                  <Form onSubmit={handleSubmit}>
                    {/* <div className="flex justify-center items-center mb-14">
                      <div>
                        <Image src={LogoMySMK} />
                        <Image src={SMKMQ} />
                      </div>
                    </div> */}
                     <div className="mb-5">
                      <h1 className="text-3xl">Lupa Password</h1>
                      <p className="text-justify">Input Email yang terdaftar untuk meminta perubahan password

</p>
                    </div>
                    {errors.msg !== undefined && (
                      <Message color="red"> {errors.msg}</Message>
                    )}

                    {pesan !== "" && (
                      <Message info>
                        <p>{pesan}</p>
                      </Message>
                    )}
                    <Form.Field
                      control={Input}
                      label="Email"
                      placeholder="Masukan Email"
                      name="email"
                      onChange={(e) => {
                        setPesan("");
                        setFieldValue("email", e.target.value);
                      }}
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

                    <Button
                      content={isSubmitting ? "Proses" : "Kirim"}
                      type="submit"
                      fluid
                      size="medium"
                      color="green"
                      loading={isSubmitting}
                      disabled={isSubmitting || pesan !== ""}
                    />
                  </Form>
                  <div className="flex items-center justify-center">
                  <button className="text-green-500 mt-5 font-poppins " onClick={()=> {
                      return navigate('/login')
                     }} type="button ">Kembali</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </Formik>
    </React.Fragment>
  );
}
