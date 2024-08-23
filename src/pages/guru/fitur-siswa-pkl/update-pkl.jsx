
import React, { useEffect, useState } from 'react';
import useList from '../../../hook/useList';
import LayoutPage from '../../../module/layoutPage';
import { Formik } from 'formik';
import { Form, Select, Button, Icon, Header, Input } from "semantic-ui-react";
import { ReactSelectAsync, FormLabel } from "../../../components";
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { toast } from 'react-toastify';
import { listSiswaPklOptions } from '../../../api/list';
import { getOptions } from '../../../utils/format';
import { useNavigate, useParams } from 'react-router-dom';
import { updateSiswaPkl, detailSiswaPkl } from '../../../api/guru/fitur-pkl';
import * as Yup from "yup";
import axios from 'axios';

let siswapklSchema = Yup.object().shape({
  student_id: Yup.string().required("wajib pilih"),
  nama_perusahaan: Yup.string().required("wajib diisi"),
  pembimbing_id: Yup.string().required("wajib diisi"),
  alamat: Yup.string().required("wajib diisi"),
  provinsi: Yup.string().required("wajib diisi"),
  kota: Yup.string().required("wajib diisi"),
  kecamatan: Yup.string().required("wajib diisi"),
  desa: Yup.string().required("wajib diisi"),
  rt: Yup.string().required("wajib diisi"),
  rw: Yup.string().required("wajib diisi"),
  kode_pos: Yup.string().required("wajib diisi"),
  no_hp: Yup.string().required("wajib diisi"),
  longtitude: Yup.string().required("wajib diisi"),
  latitude: Yup.string().required("wajib diisi"),
  penanggung_jawab_perusahaan: Yup.string().required("wajib diisi"),
});

export default function UpdatePkl() {
  // const navigate = useNavigate();
  const { id } = useParams();
  const queryClient = useQueryClient();


  let { data, isFetching } = useQuery(
    //query key
    ["/tempat-pkl/update", id],
    //axios function,triggered when page/pageSize change
    () => detailSiswaPkl(id),
    //configuration
    {
      // refetchInterval: 1000 * 60 * 60,
      enabled: id !== undefined,
      select: (response) => {
        console.log('data detail', response.data.data);
        return response.data.data;

      },
      onSuccess: (data) => {
        console.log("data suksus", data);
        // data.soal = JSON.parse(data.soal);


      },
    }
  );

  useEffect(() => {
    if(!!data === true){
      setInitialState({
        ...data,
        nama_siswa : {
          value : data.student_id,
          label : data.siswa.nama_siswa
        }
      });
    }
  }, [data])

  const [initialState, setInitialState] = useState({
    id: data?.id,
    student_id: data?.siswa?.id,
    nama_siswa: {
      value: data?.siswa?.id,
      label: data?.siswa?.nama_siswa,
    },
    nama_perusahaan: data?.nama_perusahaan,
    pembimbing_id: data?.pembimbing?.id,
    nama_guru: {
      value: data?.teacher?.id,
      label: data?.teacher?.nama_guru,
    },
    penanggung_jawab_perusahaan: data?.penanggung_jawab_perusahaan,
    alamat: data?.alamat,
    provinsi: data?.provinsi,
    kota: data?.kota,
    kecamatan: data?.kecamatan,
    desa: data?.desa,
    rt: data?.rt,
    rw: data?.rw,
    kode_pos: data?.kode_pos,
    no_hp: data?.no_hp,
    longtitude: data?.longtitude,
    latitude: data?.latitude,
  });




  // useEffect(() => {
  //   const fetchData = async () => {
  //     try {
  //       const response = await detailSiswaPkl(id);
  //       setInitialState(response.data);
  //     } catch (error) {
  //       console.error('Error fetching detail:', error);
  //     }
  //   };
  //   fetchData();
  // }, [id]);

  const onSubmit = async (values) => {
    try {
      const response = await updateSiswaPkl(id, values);

      toast.success(response?.data?.msg, {
        position: "top-right",
        autoClose: 1000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
      });
      queryClient.invalidateQueries("tempat-pkl/list");
      // navigate(`/pkl/detail/${id}`);
    } catch (err) {
      if (err?.response?.status === 422) {
        return toast.warn(err?.response?.data?.msg, {
          position: "top-right",
          autoClose: 1000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "colored",
        });
      }
      return toast.error("Ada Kesalahan", {
        position: "top-right",
        autoClose: 1000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
      });
    }
  };



  // const onSubmit = async (values, { resetForm }) => {
  //   try {
  //     const response = await updateSiswaPkl(id, values);

  //     toast.success(response?.data?.msg, {
  //       position: "top-right",
  //       autoClose: 1000,
  //       hideProgressBar: false,
  //       closeOnClick: true,
  //       pauseOnHover: true,
  //       draggable: true,
  //       progress: undefined,
  //       theme: "colored",
  //     });
  //     resetForm();
  //     queryClient.invalidateQueries("tempat-pkl/list");
  //   } catch (err) {
  //     if (err?.response?.status === 422) {
  //       return toast.warn(err?.response?.data?.msg, {
  //         position: "top-right",
  //         autoClose: 1000,
  //         hideProgressBar: false,
  //         closeOnClick: true,
  //         pauseOnHover: true,
  //         draggable: true,
  //         progress: undefined,
  //         theme: "colored",
  //       });
  //     }
  //     return toast.error("Ada Kesalahan", {
  //       position: "top-right",
  //       autoClose: 1000,
  //       hideProgressBar: false,
  //       closeOnClick: true,
  //       pauseOnHover: true,
  //       draggable: true,
  //       progress: undefined,
  //       theme: "colored",
  //     });
  //   }
  // };



  let { dataKelas, dataGuru } = useList();


  return (
    <LayoutPage title={'Update Tempat Santri'} isLoading={isFetching}>
      <section className='md:mt-5 px-2'>
        <Header>
          {"Form Update Tempat PKL santri"}
        </Header>
        <Formik initialValues={initialState} enableReinitialize onSubmit={onSubmit} validationSchema={siswapklSchema}>
          {({
            values,
            errors,
            touched,
            handleChange,
            handleBlur,
            handleSubmit,
            isSubmitting,
            setFieldTouched,
            setFieldValue,
            resetForm
          }) => (
            <Form onSubmit={handleSubmit}>
              {console.log('err fatih', errors)}
              {console.log('err touched', touched)}
              {JSON.stringify(values)}
              <div className="grid grid-cols-3 gap-y-2 gap-x-5 shadow-md p-5">
                <div className="col-span-3 lg:col-span-1">
                  <FormLabel
                    error={errors?.student_id && touched?.student_id}
                    label={"Nama Siswa"}
                  >
                    <ReactSelectAsync
                      debounceTimeout={300}
                      value={values?.nama_siswa}
                      loadOptions={listSiswaPklOptions}
                      onChange={(data) => {
                        // console.log('data siswa', data);
                        setFieldValue(`nama_siswa`, data);
                        setFieldValue(
                          `student_id`,
                          data.value
                        );
                      }}
                      error={
                        errors?.student_id !== undefined &&
                        touched?.student_id
                      }

                      placeholder="Nama Siswa"
                      additional={{
                        page: 1,
                      }}
                    />
                  </FormLabel>
                </div>

                <section className="col-span-3 lg:col-span-1">

                  <Form.Field
                    control={Input}
                    label="Perusahaan PKL Santri"
                    placeholder="Ketikan Perusahaan PKL Santri"
                    name={`nama_perusahaan`}
                    value={values.nama_perusahaan}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    fluid
                    type="text"
                    error={
                      errors?.nama_perusahaan !== undefined &&
                      touched?.nama_perusahaan
                    }
                  />
                  {touched.nama_perusahaan && errors.nama_perusahaan && (
                    <div className="ui pointing red basic label ">
                      {errors.nama_perusahaan}
                    </div>
                  )}
                </section>

                <section className="col-span-3 lg:col-span-1">
                  <Form.Field
                    control={Input}
                    label="Nomer Telepon Santri"
                    placeholder="Ketikan Nomer Telepon Santri"
                    name={`no_hp`}
                    value={values?.no_hp}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    fluid
                    type="text"
                    error={
                      errors?.no_hp !== undefined &&
                      touched?.no_hp
                    }
                  />
                  {touched.no_hp && errors.no_hp && (
                    <div className="ui pointing red basic label ">
                      {errors.no_hp}
                    </div>
                  )}
                </section>

                <section className="col-span-3 lg:col-span-1">
                  <Form.Field
                    control={Input}
                    label="Alamat"
                    placeholder="Ketikan Alamat Santri"
                    name={`alamat`}
                    value={values?.alamat}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    fluid
                    type="text"
                    error={
                      errors?.alamat !== undefined &&
                      touched?.alamat
                    }
                  />
                  {touched.alamat && errors.alamat && (
                    <div className="ui pointing red basic label ">
                      {errors.alamat}
                    </div>
                  )}
                </section>
                <section className="col-span-3 lg:col-span-1">
                  <Form.Field
                    control={Input}
                    label="provinsi"
                    placeholder="Ketikan provinsi Santri"
                    name={`provinsi`}
                    value={values?.provinsi}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    fluid
                    type="text"
                    error={
                      errors?.provinsi !== undefined &&
                      touched?.provinsi
                    }
                  />
                  {touched.provinsi && errors.provinsi && (
                    <div className="ui pointing red basic label ">
                      {errors.provinsi}
                    </div>
                  )}
                </section>
                <section className="col-span-3 lg:col-span-1">
                  <Form.Field
                    control={Input}
                    label="kota"
                    placeholder="Ketikan kota Santri"
                    name={`kota`}
                    value={values?.kota}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    fluid
                    type="text"
                    error={
                      errors?.kota !== undefined &&
                      touched?.kota
                    }
                  />
                  {touched.kota && errors.kota && (
                    <div className="ui pointing red basic label ">
                      {errors.kota}
                    </div>
                  )}
                </section>
                <section className="col-span-3 lg:col-span-1">
                  <Form.Field
                    control={Input}
                    label="kecamatan"
                    placeholder="Ketikan kecamatan Santri"
                    name={`kecamatan`}
                    value={values?.kecamatan}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    fluid
                    type="text"
                    error={
                      errors?.kecamatan !== undefined &&
                      touched?.kecamatan
                    }
                  />
                  {touched.kecamatan && errors.kecamatan && (
                    <div className="ui pointing red basic label ">
                      {errors.kecamatan}
                    </div>
                  )}
                </section>
                <section className="col-span-3 lg:col-span-1">
                  <Form.Field
                    control={Input}
                    label="desa"
                    placeholder="Ketikan desa Santri"
                    name={`desa`}
                    value={values?.desa}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    fluid
                    type="text"
                    error={
                      errors?.desa !== undefined &&
                      touched?.desa
                    }
                  />
                  {touched.desa && errors.desa && (
                    <div className="ui pointing red basic label ">
                      {errors.desa}
                    </div>
                  )}
                </section>
                <section className="col-span-3 lg:col-span-1">
                  <Form.Field
                    control={Input}
                    label="rt"
                    placeholder="Ketikan rt Santri"
                    name={`rt`}
                    value={values?.rt}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    fluid
                    type="text"
                    error={
                      errors?.rt !== undefined &&
                      touched?.rt
                    }
                  />
                  {touched.rt && errors.rt && (
                    <div className="ui pointing red basic label ">
                      {errors.rt}
                    </div>
                  )}
                </section>
                <section className="col-span-3 lg:col-span-1">
                  <Form.Field
                    control={Input}
                    label="rw"
                    placeholder="Ketikan rw Santri"
                    name={`rw`}
                    value={values?.rw}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    fluid
                    type="text"
                    error={
                      errors?.rw !== undefined &&
                      touched?.rw
                    }
                  />
                  {touched.rw && errors.rw && (
                    <div className="ui pointing red basic label ">
                      {errors.rw}
                    </div>
                  )}
                </section>
                <section className="col-span-3 lg:col-span-1">
                  <Form.Field
                    control={Input}
                    label="Penangung Jawab Perusahaan"
                    placeholder="Ketikan Penangung Jawab Perusahaan"
                    name={`penanggung_jawab_perusahaan`}
                    value={values?.penanggung_jawab_perusahaan}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    fluid
                    type="text"
                    error={
                      errors?.penanggung_jawab_perusahaan !== undefined &&
                      touched?.penanggung_jawab_perusahaan
                    }
                  />
                  {touched.penanggung_jawab_perusahaan && errors.penanggung_jawab_perusahaan && (
                    <div className="ui pointing red basic label ">
                      {errors.penanggung_jawab_perusahaan}
                    </div>
                  )}
                </section>
                <section className="col-span-3 lg:col-span-1">
                  <Form.Field
                    control={Input}
                    label="Kode pos"
                    placeholder="Ketikan kode_pos Santri"
                    name={`kode_pos`}
                    value={values.kode_pos}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    fluid
                    type="text"
                    error={
                      errors?.kode_pos !== undefined &&
                      touched?.kode_pos
                    }
                  />
                  {touched.kode_pos && errors.kode_pos && (
                    <div className="ui pointing red basic label ">
                      {errors.kode_pos}
                    </div>
                  )}
                </section>

                {/* <section className="col-span-3 lg:col-span-1">
                      <Form.Field
                        control={Select}
                        value={value?.guru_id}
                        options={getOptions(
                          dataGuru?.data,
                          "nama_guru"
                        )}
                        label={{
                          children: "Pilih Penangung Jawab Sekolah ",
                          htmlFor: `guru_id`,
                          name: `guru_id`,
                        }}
                        onChange={(event, data) => {
                          setFieldValue(
                            `guru_id`,
                            data?.value
                          );
                        }}
                        placeholder="Pilih Penangung Jawab Sekolah"
                        search
                        searchInput={{
                          id: `guru_id`,
                          name: `guru_id`,
                        }}
                      />
                    </section> */}

                <section className="col-span-3 lg:col-span-1">
                  <Form.Field
                    control={Select}
                    value={values?.pembimbing_id}
                    options={getOptions(
                      dataGuru?.data,
                      "nama_guru"
                    )}
                    label={{
                      children: "Pilih Pembimbing ",
                      htmlFor: `pembimbing_id`,
                      name: `pembimbing_id`,
                    }}
                    onChange={(event, data) => {
                      setFieldValue(
                        `pembimbing_id`,
                        data?.value
                      );
                    }}
                    placeholder="Pilih Pembimbing"
                    search
                    searchInput={{
                      id: `pembimbing_id`,
                      name: `pembimbing_id`,
                    }}
                    error={
                      errors?.pembimbing_id !== undefined &&
                      touched?.pembimbing_id
                    }
                  />
                  {touched.pembimbing_id && errors.pembimbing_id && (
                    <div className="ui pointing red basic label ">
                      {errors.pembimbing_id}
                    </div>
                  )}


                </section>
                <section className="col-span-3 lg:col-span-1">
                  <Form.Field
                    control={Input}
                    label="latitude"
                    placeholder="Ketikan latitude Santri"
                    name={`latitude`}
                    value={values?.latitude}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    fluid
                    type="text"
                    error={
                      errors?.latitude !== undefined &&
                      touched?.latitude
                    }
                  />
                  {touched.latitude && errors.latitude && (
                    <div className="ui pointing red basic label ">
                      {errors.latitude}
                    </div>
                  )}
                </section>
                <section className="col-span-3 lg:col-span-1">
                  <Form.Field
                    control={Input}
                    label="longtitude"
                    placeholder="Ketikan longtitude Santri"
                    name={`longtitude`}
                    value={values?.longtitude}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    fluid
                    type="text"
                    error={
                      errors?.longtitude !== undefined &&
                      touched?.longtitude
                    }
                  />
                  {touched.longtitude && errors.longtitude && (
                    <div className="ui pointing red basic label ">
                      {errors.longtitude}
                    </div>
                  )}
                </section>

              </div>

              <div>
                <Button
                  content={isSubmitting ? "Menyimpan" : "Simpan"}
                  type="submit"
                  fluid
                  icon={() => <Icon name="save" />}
                  loading={isSubmitting}
                  size="medium"
                  color="teal"
                  disabled={isSubmitting}
                />
              </div>
            </Form>
          )}
        </Formik>
      </section>
    </LayoutPage>
  );
}
