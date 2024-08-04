import React from 'react'
import useList from '../../../hook/useList';
import LayoutPage from '../../../module/layoutPage';
import { Formik } from 'formik';
import { Form, Select, Button, Icon, Header, Input } from "semantic-ui-react";
import { DeleteButton } from '../../../components';
import { useQueryClient } from 'react-query';
import { createSiswaHandle } from '../../../api/guru/siswa';
import { toast } from 'react-toastify';
import { listSiswaPklOptions } from '../../../api/list';

import { ReactSelectAsync, FormLabel } from "../../../components";
import { getOptions } from '../../../utils/format';
// import LocationSearch from '../../../components/geocode';

export const CreatePkl = () => {
  const queryClient = useQueryClient();
  let [visible, setVisible] = React.useState(false);
  const [initialState, setInitialState] = React.useState({
    // data: [
    //   {
    //     student_id: "",
    //     nama_siswa: "",
    //     // nama_perusahaan: "",
    //     // daerah_perusahaan: "",


    //     // long: 0.0,
    //     // let: 0.0,
    //     alamat: "",
    //     provinsi: "",
    //     kota: "",
    //     kecamatan: "",
    //     desa: "",
    //     rt: "",
    //     rw: "",
    //     kodepos: 0,
    //     no_hp: 0,


    //   }
    // ]
    data: [
      {
        kelas_id: "",
        student_id: "",
        student_name: "",
        semester: "",
        ta_id: "",
        status: 1,
      },
    ],
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
            // student_id: "",
            // nama_siswa: "",
            // nama_perusahaan: "",
            // daerah_perusahaan: "",
            // no_hp: 0,

            kelas_id: "",
            student_id: "",
            student_name: "",
            semester: "",
            ta_id: "",
            status: 1,
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
  let {
    dataKelas, dataGuru, dataMapel, dataTa
  } = useList()
  return (
    <LayoutPage title={"Tambah Tempat PKL santri"} visible={visible} setVisible={setVisible}>
      <section className='md:mt-5 px-2'>
        <Header>
          Tambah Tempat Santri PKL
        </Header>
        <Formik initialValues={initialState} enableReinitialize onSubmit={onSubmit}>
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
              {JSON.stringify(values)}
              <div className="space-y-5">
                {values?.data?.map((value, index) => {
                  return (
                    <>
                      <div className="col-span-3 flex justify-end">
                        <DeleteButton disabled={values.data.length <= 1}
                          onClick={() => {
                            let filtered = values.data.filter(
                              (i, itemIndex) => {
                                return itemIndex !== index;
                              }
                            );

                            setFieldValue("data", filtered);
                          }}
                          size="small">

                        </DeleteButton>
                      </div>
                      <div className="grid grid-cols-3 gap-y-2 gap-x-5 shadow-md p-5">
                        {/* <section>
                          <Form.Field
                            control={Select}
                            value={value?.kelas_id}
                            options={getOptions(dataKelas?.data, "nama_kelas")}
                            label={{
                              children: "Kelas",
                              htmlFor: `data[${index}]kelas_id`,
                              name: `data[${index}]kelas_id`,
                            }}
                            onChange={(event, data) => {
                              setFieldValue(
                                `data[${index}]kelas_id`,
                                data?.value
                              );
                            }}
                            placeholder="Pilih Kelas"
                            search
                            searchInput={{
                              id: `data[${index}]kelas_id`,
                              name: `data[${index}]kelas_id`,
                            }}
                          />
                        </section> */}
                        <section>
                          <FormLabel label={"Nama Siswa"}>
                            <ReactSelectAsync
                              debounceTimeout={1000}
                              value={
                                !!value.student_id === false
                                  ? ""
                                  : {
                                    value: value.student_id,
                                    label: value.student_name,
                                  }
                              }
                              loadOptions={listSiswaPklOptions}
                              isClearable
                              onChange={(data) => {
                                setFieldValue(
                                  `data[${index}]student_id`,
                                  data?.value
                                );
                                setFieldValue(
                                  `data[${index}]student_name`,
                                  data?.label
                                );
                              }}
                              placeholder="Nama Siswa"
                              additional={{
                                page: 1,
                              }}
                            />
                          </FormLabel>
                        </section>
                        
                        <section className="col-span-3 lg:col-span-1">
                          <Form.Field
                            control={Input}
                            label="Perusahaan PKL Santri"
                            placeholder="Tipe Pelanggaran"
                            name={`pelanggaran[${index}tipe]`}
                            value={value?.tipe}
                            fluid
                            type="text"
                          />
                        </section>
                        <section className="col-span-3 lg:col-span-1">
                          <Form.Field
                            control={Input}
                            label="Nomer Telepon Santri"
                            placeholder="Tipe Pelanggaran"
                            name={`pelanggaran[${index}tipe]`}
                            value={value?.tipe}
                            fluid
                            type="text"
                          />
                        </section>
                        
                        <section className="col-span-3 lg:col-span-1">
                          <Form.Field
                            control={Input}
                            label="Alamat"
                            placeholder="Tipe Pelanggaran"
                            name={`pelanggaran[${index}tipe]`}
                            value={value?.tipe}
                            fluid
                            type="text"
                          />
                        </section>
                        <section className="col-span-3 lg:col-span-1">
                          <Form.Field
                            control={Input}
                            label="Provinsi"
                            placeholder="Tipe Pelanggaran"
                            name={`pelanggaran[${index}tipe]`}
                            value={value?.tipe}
                            fluid
                            type="text"
                          />
                        </section>
                        <section className="col-span-3 lg:col-span-1">
                          <Form.Field
                            control={Input}
                            label="Kota"
                            placeholder="Tipe Pelanggaran"
                            name={`pelanggaran[${index}tipe]`}
                            value={value?.tipe}
                            fluid
                            type="text"
                          />
                        </section>
                        <section className="col-span-3 lg:col-span-1">
                          <Form.Field
                            control={Input}
                            label="Kecamatan"
                            placeholder="Tipe Pelanggaran"
                            name={`pelanggaran[${index}tipe]`}
                            value={value?.tipe}
                            fluid
                            type="text"
                          />
                        </section>
                        <section className="col-span-3 lg:col-span-1">
                          <Form.Field
                            control={Input}
                            label="Desa"
                            placeholder="Tipe Pelanggaran"
                            name={`pelanggaran[${index}tipe]`}
                            value={value?.tipe}
                            fluid
                            type="text"
                          />
                        </section>
                        <section className="col-span-3 lg:col-span-1">
                          <Form.Field
                            control={Input}
                            label="Rt"
                            placeholder="Tipe Pelanggaran"
                            name={`pelanggaran[${index}tipe]`}
                            value={value?.tipe}
                            fluid
                            type="text"
                          />
                        </section>
                        <section className="col-span-3 lg:col-span-1">
                          <Form.Field
                            control={Input}
                            label="Rw"
                            placeholder="Tipe Pelanggaran"
                            name={`pelanggaran[${index}tipe]`}
                            value={value?.tipe}
                            fluid
                            type="text"
                          />
                        </section>
                        <section className="col-span-3 lg:col-span-1">
                          <Form.Field
                            control={Input}
                            label="Kode Pos"
                            placeholder="Tipe Pelanggaran"
                            name={`pelanggaran[${index}tipe]`}
                            value={value?.tipe}
                            fluid
                            type="text"
                          />
                        </section>
                        <section className="col-span-3 lg:col-span-1">
                          <Form.Field
                            control={Input}
                            label="Penangung Jawab Perusahaan"
                            placeholder="Tipe Pelanggaran"
                            name={`pelanggaran[${index}tipe]`}
                            value={value?.tipe}
                            fluid
                            type="text"
                          />
                        </section>
                        <section className="col-span-3 lg:col-span-1">
                        <Form.Field
                          control={Select}
                          value={value?.guru_id}
                          options={getOptions(
                            dataGuru?.data,
                            "nama_guru"
                          )}
                          label={{
                            children: "Pilih Pengampu ",
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
                        </section>

                        {/* <section>
                          <Form.Dropdown
                            selection
                            search
                            label={{
                              children: "Semester",
                              htmlFor: `data[${index}]semester`,
                              name: `data[${index}]semester`,
                            }}
                            placeholder="Pilih"
                            options={[
                              { key: "1", value: 1, text: 1 },
                              { key: "2", value: 2, text: 2 },
                              { key: "3", value: 3, text: 3 },
                              { key: "4", value: 4, text: 4 },
                              { key: "5", value: 5, text: 5 },
                              { key: "6", value: 6, text: 6 },
                            ]}
                            id={`data[${index}]semester`}
                            name={`data[${index}]semester`}
                            onChange={(e, data) => {
                              setFieldValue(
                                `data[${index}]semester`,
                                data.value
                              );
                            }}
                            // error={
                            //   errors?.absensi_kehadiran?.[index]?.kehadiran
                            //     ?.alasan !== undefined &&
                            //   errors?.absensi_kehadiran?.[index]?.kehadiran
                            //     ?.alasan
                            // }
                            value={value?.semester}
                          />
                        </section> */}

                        {/* <section>
                          <Form.Field
                            control={Select}
                            value={value?.ta_id}
                            options={getOptions(
                              dataTa?.data,
                              "nama_tahun_ajaran"
                            )}
                            label={{
                              children: "Tahun Pelajaran",
                              htmlFor: `data[${index}]ta_id`,
                              name: `data[${index}]ta_id`,
                            }}
                            onChange={(event, data) => {
                              setFieldValue(`data[${index}]ta_id`, data?.value);
                            }}
                            placeholder="Pilih Mata Pelajaran"
                            search
                            searchInput={{
                              id: `data[${index}]ta_id`,
                              name: `data[${index}]ta_id`,
                            }}
                          />
                        </section> */}
                        
                        {/* <LocationSearch /> */}
                      </div>
                      
                    </>
                  )
                })}
              </div>
              <div>
                  <div className="flex items-center justify-center w-full my-5">
                    <Button
                      basic
                      fluid
                      type="button"
                      color="teal"
                      content="Tambah"
                      icon="add"
                      labelPosition="left"
                      onClick={() => {
                        setFieldValue("data", [
                          ...values?.data,
                          {
                            halaqoh_id: "",
                            student_id: "",

                            status: 1,
                          },
                        ]);
                      }}
                    >
                      Tambah
                    </Button>
                  </div>
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
