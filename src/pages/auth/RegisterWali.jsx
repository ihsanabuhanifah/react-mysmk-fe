/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import { Formik, FormikProvider, useFormik } from "formik";
import * as Yup from "yup";
import { login, useNISNCek, useRegisterWali } from "../../api/auth";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import { Form, Button, Image, Input, Select, Message } from "semantic-ui-react";
import Layout from "./Layout";

const RegisterSchema = Yup.object().shape({
  email: Yup.string().email().required("Wajib di isi"),
  password: Yup.string()
    .min(8, "Password minimal 8 Karakter")
    .required("wajib di isi"),
  name: Yup.string().required("wajib di isi"),

  hubungan: Yup.string().required("wajib di isi"),
  nisn: Yup.string()
    .matches(/^[0-9]{10}$/, "NISN harus terdiri dari 10 karakter angka")
    .required("NISN wajib diisi"),
  no_hp: Yup.string()
    .matches(
      /^08[0-9]{8,}$/,
      "Nomor Handphone harus dimulai dengan '08' dan terdiri dari minimal 10 angka setelah '08'"
    )
    .required("Nomor Handphone wajib diisi"),
});

export default function RegisterWali() {
  let [showPassword, setShowPassword] = React.useState(false);
  let mutate = useRegisterWali();
  let [nisnFound, setNisnFound] = useState(false);
  let mutateNISN = useNISNCek();

  const initialState = {
    email: "",
    password: "",
    name: "",
    nisn: "",
    no_hp: "",
    hubungan: "",
  };

  const rolesOptions = [
    { key: 1, value: "ayah", text: "Ayah" },
    { key: 2, value: "ibu", text: "Ibu" },
    { key: 3, value: "wali", text: "Wali" },
  ];
  const onSubmit = async (values, { resetForm, setErrors }) => {
    mutate.mutate(values, {
      onSuccess: () => {
        resetForm();
      },
      onError: (err) => {
        setErrors(err.response.data);
      },
    });
  };

  const formik = useFormik({
    initialValues: initialState,
    validationSchema: RegisterSchema,
    enableReinitialize: true,
    onSubmit: onSubmit,
  });

  const {
    errors,
    touched,
    handleChange,
    handleBlur,
    handleSubmit,
    setFieldValue,
    isSubmitting,
    values,
  } = formik;

  useEffect(() => {
    if (values?.nisn?.length === 10) {
      setNisnFound(false);
      // Fetch NISN data or do something else
      mutateNISN.mutate(
        { nisn: values.nisn },
        {
          onSuccess: () => {
            setNisnFound(true);
          },
        }
      );
    }
  }, [values.nisn]);

  return (
    <Layout>
      <FormikProvider values={formik}>
        <Form onSubmit={handleSubmit}>
          <div className="mb-5 space-y-5">
            <h1 className="text-3xl font-black">Registarasi Wali Siswa</h1>
            <p>
              Silahkan Registrasikan Akun Wali Santri untuk melihat laporan
              aktifitas siswa{" "}
            </p>
          </div>
          {errors.msg !== undefined && (
            <Message color="red"> {errors.msg}</Message>
          )}
          <Form.Field
            control={Input}
            label="Nama Wali Siswa"
            placeholder="Masukan Nama Wali Siswa"
            name="name"
            onChange={handleChange}
            onBlur={handleBlur}
            value={values.name}
            disabled={mutate.isLoading}
            fluid
            icon={"envelope"}
            iconPosition="left"
            error={
              errors.name &&
              touched.name && {
                content: `${errors?.name}`,
                pointing: "above",
              }
            }
          />
          <Form.Field
            control={Input}
            label="Email"
            placeholder="Masukan Email"
            name="email"
            onChange={handleChange}
            onBlur={handleBlur}
            value={values.email}
            disabled={mutate.isLoading}
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
            disabled={mutate.isLoading}
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
            control={Input}
            label="NISN"
            loading={mutateNISN.isLoading}
            disabled={mutate.isLoading || mutateNISN.isLoading}
            placeholder="Masukan NISN"
            name="nisn"
            onChange={handleChange}
            onBlur={handleBlur}
            value={values.nisn}
            fluid
            icon={"envelope"}
            iconPosition="left"
            error={
              errors.nisn &&
              touched.nisn && {
                content: `${errors?.nisn}`,
                pointing: "above",
              }
            }
          />
          <Form.Field
            control={Input}
            label="Nomor Handphone"
            placeholder="Masukan Nomor Handphone"
            name="no_hp"
            onChange={handleChange}
            onBlur={handleBlur}
            value={values.no_hp}
            disabled={mutate.isLoading}
            fluid
            icon={"envelope"}
            iconPosition="left"
            error={
              errors.no_hp &&
              touched.no_hp && {
                content: `${errors?.no_hp}`,
                pointing: "above",
              }
            }
          />
          <Form.Field
            control={Select}
            options={rolesOptions}
            label={{
              children: "Hubungan",
              htmlFor: "hubungan",
              name: "hubungan",
            }}
            onChange={(event, data) => {
              setFieldValue("hubungan", data.value);
            }}
            onBlur={handleBlur}
            value={values.hubungan}
            disabled={mutate.isLoading}
            placeholder="Pilih"
            error={
              errors.hubungan &&
              touched.hubungan && {
                content: `${errors?.hubungan}`,
                pointing: "above",
              }
            }
            search
            searchInput={{ id: "hubungan", name: "hubungan" }}
          />
          <Button
            content={mutate.isLoading ? "Proses" : "Masuk"}
            type="submit"
            fluid
            size="medium"
            color="green"
            loading={mutate.isLoading}
            disabled={mutate.isLoading || nisnFound === false}
          />
        </Form>
      </FormikProvider>
    </Layout>
  );
}
