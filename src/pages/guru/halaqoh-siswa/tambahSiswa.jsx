import React from "react";
import { Formik } from "formik";
import * as Yup from "yup";
import useList from "../../../hook/useList";
import LayoutPage from "../../../module/layoutPage";
import { Form, Button, Icon, Select } from "semantic-ui-react";
import { ReactSelectAsync, FormLabel, DeleteButton } from "../../../components";
import { listSiswaOptions } from "../../../api/list";
import { addSiswaHalaqoHandle } from "../../../api/guru/halaqoh";
import { getOptions } from "../../../utils/format";
import { toast } from "react-toastify";
export default function AddSiswa() {
  const [initialState, setInitialState] = React.useState({
    data: [
      {
        halaqoh_id: "",
        student_id: "",
        status: 1,
      },
    ],
  });

 
  let { dataHalaqoh } = useList();
  const onSubmit = async (values, { resetForm }) => {
    try {
      const response = await addSiswaHalaqoHandle(values);

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
            halaqoh_id: "",
            student_id: "",
nama_siswa : "",
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
  return (
    <LayoutPage title={"Tambah Siswa"}>
      <div className="mt-5">
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
                {values?.data?.map((value, index) => (
                  <>
                   
                    <div className="grid grid-cols-5 gap-y-2 gap-x-5 shadow-md p-5">
                      <section className="col-span-2">
                        <Form.Field
                          control={Select}
                          value={value?.halaqoh_id}
                          options={getOptions(
                            dataHalaqoh?.data,
                            "nama_kelompok"
                          )}
                          label={{
                            children: "Pilih Pengampu ",
                            htmlFor: `data[${index}]halaqoh_id`,
                            name: `data[${index}]halaqoh_id`,
                          }}
                          onChange={(event, data) => {
                            setFieldValue(
                              `data[${index}]halaqoh_id`,
                              data?.value
                            );
                          }}
                          placeholder="Pilih Mata Pelajaran"
                          search
                          searchInput={{
                            id: `data[${index}]halaqoh_id`,
                            name: `data[${index}]halaqoh_id`,
                          }}
                        />
                      </section>
                      <section className="col-span-2"> 
                        <FormLabel
                          error={
                            errors?.data?.[index]?.student_id &&
                            touched?.data?.[index]?.student_id
                          }
                          label={"Nama Siswa"}
                        >
                          <ReactSelectAsync
                            debounceTimeout={300}
                            value={value?.nama_siswa}
                            loadOptions={listSiswaOptions}
                            isDisabled={isSubmitting}
                            onChange={(data) => {
                              setFieldValue(
                                `data[${index}]student_id`,
                                data.value
                              );
                            }}
                            error={
                              errors?.data?.[index]?.student_id &&
                              touched?.data?.[index]?.student_id
                            }
                            placeholder="Nama Siswa"
                            additional={{
                              page: 1,
                            }}
                          />
                        </FormLabel>
                      </section>
                      <section className= " flex items-center justify-end ">
                      <DeleteButton
                        disabled={values.data.length <= 1}
                        onClick={() => {
                          let filtered = values.data.filter((i, itemIndex) => {
                            return itemIndex !== index;
                          });

                          setFieldValue("data", filtered);
                        }}
                        size="small"
                      />
                    </section>
                    </div>
                  </>
                ))}
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
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </LayoutPage>
  );
}
