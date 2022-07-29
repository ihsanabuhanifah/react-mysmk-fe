import React from "react";
import { Formik } from "formik";
import * as Yup from "yup";
import { postLupaPassword } from "../../api/auth";

import { useNavigate } from "react-router-dom";

import { toast } from "react-toastify";
import { Form, Button, Image, Input, Select, Message } from "semantic-ui-react";
import Layout from "./Layout";

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
                     <div className="flex items-center justify-center">
                  <button className="text-green-500 mt-5 font-poppins " onClick={()=> {
                      return navigate('/login')
                     }} type="button ">Kembali</button>
                  </div>
                  </Form>
                 
              
        )}
      </Formik>
    </Layout>
  );
}
