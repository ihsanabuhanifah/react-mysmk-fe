import React from "react";
import LayoutPage from "../../../module/layoutPage";
import useList from "../../../hook/useList";
import { Formik } from "formik";


import { toast } from "react-toastify";
import { DeleteButton } from "../../../components";

import { dayOptions } from ".";
import { getOptions } from "../../../utils/format";
import { Form, Select, Button, Icon } from "semantic-ui-react";
import { createJadwalHandle } from "../../../api/guru/absensi";
export function CreateJadwal() {
  const [initialState, setInitialState] = React.useState({
    data: [
      {
        hari: "",
        kelas_id: "",
        teacher_id: "",
        mapel_id: "",
        jam_ke: "",
        jumlah_jam: "",
        semester: "",
        ta_id: "",
        student: "",
        status: 1,
      },
    ],
  });

  const onSubmit = async (values, { resetForm }) => {
    try {
      const response = await createJadwalHandle(values);

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
            hari: "",
            kelas_id: "",
            teacher_id: "",
            mapel_id: "",
            jam_ke: "",
            jumlah_jam: "",
            semester: "",
            ta_id: "",
            student: "",
            status: 1,
          },
        ],
      });
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
  let { dataKelas, dataGuru, dataMapel, dataTa } = useList();
  return (
    <LayoutPage title={"Tambah Jadwal"}>
      <section className="mt-5">
        <Formik
          initialValues={initialState}
          //   validationSchema={laporanSchema}
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
              <div className="space-y-5">
                {values?.data?.map((value, index) => {
                  return (
                    <>
                      <div className="col-span-3 flex justify-end ">
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
                      </div>
                      <div className="grid grid-cols-3 gap-y-2 gap-x-5 shadow-md p-5">
                        <section>
                          <Form.Dropdown
                            selection
                            search
                            label={{
                              children: "Hari",
                              htmlFor: `data[${index}]hari`,
                              name: `data[${index}]hari`,
                            }}
                            options={dayOptions}
                            id={`data[${index}]hari`}
                            name={`data[${index}]hari`}
                            onChange={(e, data) => {
                              setFieldValue(`data[${index}]hari`, data.value);
                            }}
                            // error={
                            //   errors?.absensi_kehadiran?.[index]?.kehadiran
                            //     ?.alasan !== undefined &&
                            //   errors?.absensi_kehadiran?.[index]?.kehadiran
                            //     ?.alasan
                            // }
                            placeholder="Pilih Hari"
                            value={value?.hari}
                          />
                        </section>
                        <section>
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
                        </section>
                        <section>
                          <Form.Field
                            control={Select}
                            value={value?.teacher_id}
                            options={getOptions(dataGuru?.data, "nama_guru")}
                            label={{
                              children: "Guru",
                              htmlFor: `data[${index}]teacher_id`,
                              name: `data[${index}]teacher_id`,
                            }}
                            onChange={(event, data) => {
                              setFieldValue(
                                `data[${index}]teacher_id`,
                                data?.value
                              );
                            }}
                            placeholder="Pilih Guru"
                            search
                            searchInput={{
                              id: `data[${index}]teacher_id`,
                              name: `data[${index}]teacher_id`,
                            }}
                          />
                        </section>
                        <section>
                          <Form.Field
                            control={Select}
                            value={value?.mapel_id}
                            options={getOptions(dataMapel?.data, "nama_mapel")}
                            label={{
                              children: "Mata Pelajaran",
                              htmlFor: `data[${index}]mapel_id`,
                              name: `data[${index}]mapel_id`,
                            }}
                            onChange={(event, data) => {
                              setFieldValue(
                                `data[${index}]mapel_id`,
                                data?.value
                              );
                            }}
                            placeholder="Pilih Mata Pelajaran"
                            search
                            searchInput={{
                              id: `data[${index}]mapel_id`,
                              name: `data[${index}]mapel_id`,
                            }}
                          />
                        </section>
                        <section>
                          <Form.Dropdown
                            selection
                            search
                            label={{
                              children: "Jam Ke",
                              htmlFor: `data[${index}]jam_ke`,
                              name: `data[${index}]jam_ke`,
                            }}
                            placeholder="Pilih"
                            options={[
                              { key: "1", value: 1, text: 1 },
                              { key: "2", value: 2, text: 2 },
                              { key: "3", value: 3, text: 3 },
                              { key: "4", value: 4, text: 4 },
                              { key: "5", value: 5, text: 5 },
                              { key: "6", value: 6, text: 6 },
                              { key: "7", value: 7, text: 7 },
                              { key: "8", value: 8, text: 8 },
                            ]}
                            id={`data[${index}]jam_ke`}
                            name={`data[${index}]jam_ke`}
                            onChange={(e, data) => {
                              setFieldValue(`data[${index}]jam_ke`, data.value);
                            }}
                            // error={
                            //   errors?.absensi_kehadiran?.[index]?.kehadiran
                            //     ?.alasan !== undefined &&
                            //   errors?.absensi_kehadiran?.[index]?.kehadiran
                            //     ?.alasan
                            // }
                            value={value?.jam_ke}
                          />
                        </section>
                        <section>
                          <Form.Dropdown
                            selection
                            search
                            label={{
                              children: "Jumlah Jam",
                              htmlFor: `data[${index}]jumlah_jam`,
                              name: `data[${index}]jumlah_jam`,
                            }}
                            placeholder="Pilih"
                            options={[
                              { key: "1", value: 1, text: 1 },
                              { key: "2", value: 2, text: 2 },
                              { key: "3", value: 3, text: 3 },
                              { key: "4", value: 4, text: 4 },
                              { key: "5", value: 5, text: 5 },
                              { key: "6", value: 6, text: 6 },
                              { key: "7", value: 7, text: 7 },
                              { key: "8", value: 8, text: 8 },
                            ]}
                            id={`data[${index}]jumlah_jam`}
                            name={`data[${index}]jumlah_jam`}
                            onChange={(e, data) => {
                              setFieldValue(
                                `data[${index}]jumlah_jam`,
                                data.value
                              );
                            }}
                            // error={
                            //   errors?.absensi_kehadiran?.[index]?.kehadiran
                            //     ?.alasan !== undefined &&
                            //   errors?.absensi_kehadiran?.[index]?.kehadiran
                            //     ?.alasan
                            // }
                            value={value?.jumlah_jam}
                          />
                        </section>
                        <section>
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
                        </section>
                        <section>
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
                        </section>
                      </div>
                    </>
                  );
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
                          hari: "",
                          kelas_id: "",
                          teacher_id: "",
                          mapel_id: "",
                          jam_ke: "",
                          jumlah_jam: "",
                          semester: "",
                          ta_id: "",
                          student: "",
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
  );
}
