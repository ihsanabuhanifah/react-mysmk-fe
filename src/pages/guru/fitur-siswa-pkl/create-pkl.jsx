import React from 'react';
import useList from '../../../hook/useList';
import LayoutPage from '../../../module/layoutPage';
import { Formik } from 'formik';
import { Form, Select, Button, Icon, Header, Input } from "semantic-ui-react";
import { AddButton, DeleteButton } from '../../../components';
import { useQuery, useQueryClient } from 'react-query';
import { toast } from 'react-toastify';
import { listSiswaPklOptions } from '../../../api/list';
import { ReactSelectAsync, FormLabel } from "../../../components";
import { getOptions } from '../../../utils/format';
import { number } from 'yup';
import { useNavigate, useParams } from 'react-router-dom';
import { createSiswaPkl, deleteSiswaPkl, detailSiswaPkl, listSiswaPkl } from '../../../api/guru/fitur-pkl';
import usePage from '../../../hook/usePage';
import * as Yup from "yup"
import useDelete from '../../../hook/useDelete';

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
export default function CreatePkl() {
  const navigate = useNavigate();
  const { id } = useParams();
  let { page, pageSize, setPage, setPageSize } = usePage();

  let params = {
    page,
    pageSize,

    // is_all: 1,
  };
  let { data, isLoading } = useQuery(
    //query key
    ["/tempat-pkl/list", params],
    //axios function,triggered when page/pageSize change
    () => listSiswaPkl(params),
    //configuration
    {
      // refetchInterval: 1000 * 60 * 60,
      select: (response) => {
        // console.log(response.data)
        return response.data;
      },
    }
  );
  let queryClient = useQueryClient();
  const {

    showAlertDelete,
    setShowAlertDelete,
    deleteLoading,
    confirmDelete,
    onConfirmDelete,
  } = useDelete({
    afterDeleted: () => queryClient.invalidateQueries("/tempat-pkl/list"),
    onDelete: (id) => deleteSiswaPkl(id),
  });
  const [initialState, setInitialState] = React.useState({
    student_id: "",
    nama_perusahaan: "",
    pembimbing_id: "",
    penanggung_jawab_perusahaan: "",
    alamat: "",
    provinsi: "",
    kota: "",
    kecamatan: "",
    desa: "",
    rt: "",
    rw: "",
    kode_pos: "",
    no_hp: "",
    longtitude: "",
    latitude: "",
  });


  const onSubmit = async (values, { resetForm }) => {
    try {

      const response = await createSiswaPkl(values);

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
      resetForm();
      // setInitialState({
      //   data: [
      //     {
      //       student_id: "",
      //       // nama_siswa: "",
      //       nama_perusahaan: "",
      //       // guru_id: "",
      //       // nama_guru: "",

      //       pembimbing_id: "",
      //       // nama_pembimbing: "",
      //       penanggung_jawab_perusahaan: "",
      //       alamat: "",
      //       provinsi: "",
      //       kota: "",
      //       kecamatan: "",
      //       desa: "",
      //       rt: "",
      //       rw: "",
      //       kode_pos: "",
      //       no_hp: "",
      //       longtitude: "",
      //       latitude: "",
      //     }
      //   ]
      // });
      queryClient.invalidateQueries("tempat-pkl/list");
    }
    catch (err) {
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
        })
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
  let { dataKelas, dataGuru } = useList();
  return (
    <LayoutPage title={'Input Tempat Santri'}>
      <section className='md:mt-5 px-2'>
        <Header>
          {"Form Tambah Tempat PKL santri"}
        </Header>
        <div className="flex flex-row justify-start items-center" onClick={() => navigate('/guru/fitur-siswa-pkl')}>
            <Icon
              name="arrow left"
              size="large"

              className="cursor-pointer"
            />
            <p className="text-xl  font-semibold text-black cursor-pointer">Kembali</p>
          </div>
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
            <Form onSubmit={handleSubmit}
            >
              
              {console.log('err fatih', errors)}
              {console.log('err touched', touched)}
              {/* {JSON.stringify(values)} */}


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
                        // console.log(data);
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
                    value={values?.nama_perusahaan}
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
                    value={values?.kode_pos}
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

                {/* Section Input Lainnya */}
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
  )
}