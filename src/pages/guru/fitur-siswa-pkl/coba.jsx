import React from 'react';
import useList from '../../../hook/useList';
import LayoutPage from '../../../module/layoutPage';
import { Formik } from 'formik';
import { Form, Select, Button, Icon, Header, Input } from "semantic-ui-react";
import { AddButton, DeleteButton } from '../../../components';
import { useQuery, useQueryClient } from 'react-query';
import { createSiswaHandle } from '../../../api/guru/siswa';
import { toast } from 'react-toastify';
import { listSiswaPklOptions } from '../../../api/list';
import { ReactSelectAsync, FormLabel } from "../../../components";
import { getOptions } from '../../../utils/format';
import { number } from 'yup';
import { useParams } from 'react-router-dom';
import { detailSiswaPkl } from '../../../api/guru/fitur-pkl';

export const CreatePkl = () => {
  const queryClient = useQueryClient();
  const { id } = useParams();
  let { data, isLoading } = useQuery(
    //query key
    ["/tempat-pkl/update"],
    //axios function,triggered when page/pageSize change
    () => detailSiswaPkl(id),
    //configuration
    {
      // refetchInterval: 1000 * 60 * 60,
      enabled: id !== undefined,
      select: (response) => {
        return response.data;
      },
      onSuccess: (data) => {
        console.log(data)
        // data = JSON.parse(data);
        setInitialState({
          data: [data]
        });
      },
    }
  );
  const [initialState, setInitialState] = React.useState({
    data: [
      {
        student_id: "",
        // nama_siswa: "",
        nama_perusahaan: "",
        // guru_id: "",
        // nama_guru: "",

        pembimbing_id: "",
        // nama_pembimbing: "",
        penangung_jawab_perusahaan: "",
        alamat: "",
        provinsi: "",
        kota: "",
        kecamatan: "",
        desa: "",
        rt: "",
        rw: "",
        kodepos: "",
        no_hp: "",
        long: "",
        latitude: "",
      }
    ]
  });

  const onSubmit = async (values, { resetForm }) => {
    try {
      const response = await createSiswaHandle(values);
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
      setInitialState({
        data: [
          {
            student_id: "",
            // nama_siswa: "",
            nama_perusahaan: "",
            // guru_id: "",
            // nama_guru: "",

            pembimbing_id: "",
            // nama_pembimbing: "",
            penangung_jawab_perusahaan: "",
            alamat: "",
            provinsi: "",
            kota: "",
            kecamatan: "",
            desa: "",
            rt: "",
            rw: "",
            kodepos: "",
            no_hp: "",
            long: "",
            latitude: "",
          }
        ]
      });
      queryClient.invalidateQueries("siswa/list");
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
    <LayoutPage title={"Input Tempat PKL santri"} >
      <section className='md:mt-5 px-2'>
        <Header>
          {id === undefined ? "Form Tambah Tempat PKL santri" : "Form Update Tempat PKL santri"}
        </Header>
        <Formik initialValues={initialState} enableReinitialize onSubmit={onSubmit}>
          {({
            values,
            handleChange,
            handleBlur,
            handleSubmit,
            setFieldValue,
            isSubmitting,
          }) => (
            <Form onSubmit={handleSubmit}>
              {JSON.stringify(values)}
              <div className="space-y-5">
                {values?.data?.map((value, index) => (
                  <div key={index} className="grid grid-cols-3 gap-y-2 gap-x-5 shadow-md p-5">
                    <div className="col-span-3 flex justify-end">
                      {id === undefined && (
                        <section className="flex items-center justify-end">
                          <AddButton
                            disabled={false}
                            onClick={() => {
                              setFieldValue("data", [
                                ...values?.data,
                                {
                                  student_id: "",
                                  // nama_siswa: "",
                                  nama_perusahaan: "",
                                  // guru_id: "",
                                  // nama_guru: "",

                                  pembimbing_id: "",
                                  // nama_pembimbing: "",
                                  penangung_jawab_perusahaan: "",
                                  alamat: "",
                                  provinsi: "",
                                  kota: "",
                                  kecamatan: "",
                                  desa: "",
                                  rt: "",
                                  rw: "",
                                  kodepos: "",
                                  no_hp: "",
                                  long: "",
                                  latitude: "",
                                },
                              ]);
                            }}
                            size="small"
                          />
                          <DeleteButton
                            disabled={values.data.length <= 1}
                            onClick={() => {
                              let filtered = values.data.filter(
                                (i, itemIndex) => {
                                  return itemIndex !== index;
                                }
                              );

                              setFieldValue("data", filtered);
                            }}
                            size="small"
                          />
                        </section>
                      )}
                    </div>

                    <section className='col-span-3 lg:col-span-1'>
                      <FormLabel label={"Nama Siswa"}>
                        <ReactSelectAsync
                          debounceTimeout={1000}
                          value={
                            !!value.student_id === false
                              ? ""
                              : {
                                value: value.student_id,
                                label: value.nama_siswa,
                              }
                          }
                          loadOptions={listSiswaPklOptions}
                          isClearable
                          onChange={(data) => {
                            setFieldValue(`data[${index}]student_id`, data?.value);
                            setFieldValue(`data[${index}]nama_siswa`, data?.label);
                          }}
                          placeholder="Nama Siswa"
                          additional={{ page: 1 }}
                        />
                        {/* <ReactSelectAsync
                          debounceTimeout={300}
                          value={value?.nama_siswa}
                          loadOptions={listSiswaPklOptions}
                          isDisabled={isSubmitting}
                          onChange={(data) => {
                            console.log(data);
                            setFieldValue(`sholat[${index}]nama_siswa`, data);
                            setFieldValue(`sholat[${index}]student_id`, data.value);
                          }}
                          error={
                            errors?.sholat?.[index]?.student_id &&
                            touched?.sholat?.[index]?.student_id
                          }
                          placeholder="Nama Siswa"
                          additional={{
                            page: 1,
                          }}
                        /> */}
                      </FormLabel>
                    </section>

                    <section className="col-span-3 lg:col-span-1">
                      <Form.Field
                        control={Input}
                        label="Perusahaan PKL Santri"
                        placeholder="Ketikan Perusahaan PKL Santri"
                        name={`data[${index}].nama_perusahaan`}
                        value={value?.nama_perusahaan}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        fluid
                        type="text"
                      />
                    </section>

                    <section className="col-span-3 lg:col-span-1">
                      <Form.Field
                        control={Input}
                        label="Nomer Telepon Santri"
                        placeholder="Ketikan Nomer Telepon Santri"
                        name={`data[${index}].no_hp`}
                        value={value?.no_hp}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        fluid
                        type="text"
                      />
                    </section>

                    <section className="col-span-3 lg:col-span-1">
                      <Form.Field
                        control={Input}
                        label="Alamat"
                        placeholder="Ketikan Alamat Santri"
                        name={`data[${index}].alamat`}
                        value={value?.alamat}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        fluid
                        type="text"
                      />
                    </section>
                    <section className="col-span-3 lg:col-span-1">
                      <Form.Field
                        control={Input}
                        label="provinsi"
                        placeholder="Ketikan provinsi Santri"
                        name={`data[${index}].provinsi`}
                        value={value?.provinsi}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        fluid
                        type="text"
                      />
                    </section>
                    <section className="col-span-3 lg:col-span-1">
                      <Form.Field
                        control={Input}
                        label="kota"
                        placeholder="Ketikan kota Santri"
                        name={`data[${index}].kota`}
                        value={value?.kota}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        fluid
                        type="text"
                      />
                    </section>
                    <section className="col-span-3 lg:col-span-1">
                      <Form.Field
                        control={Input}
                        label="kecamatan"
                        placeholder="Ketikan kecamatan Santri"
                        name={`data[${index}].kecamatan`}
                        value={value?.kecamatan}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        fluid
                        type="text"
                      />
                    </section>
                    <section className="col-span-3 lg:col-span-1">
                      <Form.Field
                        control={Input}
                        label="desa"
                        placeholder="Ketikan desa Santri"
                        name={`data[${index}].desa`}
                        value={value?.desa}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        fluid
                        type="text"
                      />
                    </section>
                    <section className="col-span-3 lg:col-span-1">
                      <Form.Field
                        control={Input}
                        label="rt"
                        placeholder="Ketikan rt Santri"
                        name={`data[${index}].rt`}
                        value={value?.rt}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        fluid
                        type="text"
                      />
                    </section>
                    <section className="col-span-3 lg:col-span-1">
                      <Form.Field
                        control={Input}
                        label="rw"
                        placeholder="Ketikan rw Santri"
                        name={`data[${index}].rw`}
                        value={value?.rw}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        fluid
                        type="text"
                      />
                    </section>
                    <section className="col-span-3 lg:col-span-1">
                      <Form.Field
                        control={Input}
                        label="Penangung Jawab Perusahaan"
                        placeholder="Ketikan Penangung Jawab Perusahaan"
                        name={`data[${index}].penangung_jawab_perusahaan`}
                        value={value?.penangung_jawab_perusahaan}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        fluid
                        type="text"
                      />
                    </section>
                    <section className="col-span-3 lg:col-span-1">
                      <Form.Field
                        control={Input}
                        label="kodepos"
                        placeholder="Ketikan kodepos Santri"
                        name={`data[${index}].kodepos`}
                        value={value?.kodepos}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        fluid
                        type="text"
                      />
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
                          htmlFor: `data[${index}]guru_id`,
                          name: `data[${index}]guru_id`,
                        }}
                        onChange={(event, data) => {
                          setFieldValue(
                            `data[${index}]guru_id`,
                            data?.value
                          );
                        }}
                        placeholder="Pilih Penangung Jawab Sekolah"
                        search
                        searchInput={{
                          id: `data[${index}]guru_id`,
                          name: `data[${index}]guru_id`,
                        }}
                      />
                    </section> */}

                    <section className="col-span-3 lg:col-span-1">
                      <Form.Field
                        control={Select}
                        value={value?.pembimbing_id}
                        options={getOptions(
                          dataGuru?.data,
                          "nama_guru"
                        )}
                        label={{
                          children: "Pilih Pembimbing ",
                          htmlFor: `data[${index}]pembimbing_id`,
                          name: `data[${index}]pembimbing_id`,
                        }}
                        onChange={(event, data) => {
                          setFieldValue(
                            `data[${index}]pembimbing_id`,
                            data?.value
                          );
                        }}
                        placeholder="Pilih Pembimbing"
                        search
                        searchInput={{
                          id: `data[${index}]pembimbing_id`,
                          name: `data[${index}]pembimbing_id`,
                        }}
                      />



                    </section>
                    <section className="col-span-3 lg:col-span-1">
                      <Form.Field
                        control={Input}
                        label="latitude"
                        placeholder="Ketikan latitude Santri"
                        name={`data[${index}].latitude`}
                        value={value?.latitude}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        fluid
                        type="text"
                      />
                    </section>
                    <section className="col-span-3 lg:col-span-1">
                      <Form.Field
                        control={Input}
                        label="longtitude"
                        placeholder="Ketikan longtitude Santri"
                        name={`data[${index}].long`}
                        value={value?.long}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        fluid
                        type="text"
                      />
                    </section>

                    {/* Section Input Lainnya */}
                  </div>
                ))}
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
