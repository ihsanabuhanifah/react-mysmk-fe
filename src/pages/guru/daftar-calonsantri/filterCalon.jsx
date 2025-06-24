import { Input, Select, Form, Button, Icon } from "semantic-ui-react";
import { Formik } from "formik";
import { getOptionsText } from "../../../utils/format";
import { ReactSelectAsync, FormLabel } from "../../../components";
import { listCalonSiswaOptions } from "../../../api/list";
import useList from "../../../hook/useList";

export default function FilterCalonSantri({ filter, setFilter, setVisible }) {
  const { dataTa } = useList(); // Mengambil data tahun ajaran

  const onSubmit = (values, { resetForm }) => {
    console.log("dataFil", values);
    setFilter(values); // Mengatur filter dengan nilai yang dipilih
    setVisible(false); // Menutup filter
    resetForm(); // Mengatur ulang form
  };

  return (
    <Formik initialValues={filter} enableReinitialize onSubmit={onSubmit}>
      {({ values, setValues, resetForm, handleSubmit, setFieldValue }) => (
        <Form onSubmit={handleSubmit}>
          <section className="p-5 bg-gray-50 border shadow-2xl h-screen space-y-5 relative">
            <div className="flex items-center justify-between">
              <button
                type="button"
                onClick={() => {
                  setVisible(false); // Menutup filter
                }}
                className="text-lg"
              >
                Tutup
              </button>
              <button
                type="button"
                onClick={() => {
                  resetForm();
                  setValues({
                    nama_siswa: "",
                    tahun_ajaran: "",
                  });
                }}
                className="text-lg"
              >
                Reset
              </button>
            </div>

            <div className="text-left">
              <Form.Field
                control={Select}
                options={getOptionsText(dataTa?.data, "nama_tahun_ajaran")}
                label={{ children: "Tahun Pelajaran" }}
                onChange={(event, data) => {
                  setFieldValue('tahun_ajaran', data?.value);
                }}
                placeholder="Tahun Pelajaran"
                search
                value={values?.tahun_ajaran}
                clearable
                searchInput={{}}
              />
            </div>

            <div className="text-left">
              <FormLabel label={"Nama Calon Siswa"}>
                <ReactSelectAsync
                  debounceTimeout={300}
                  value={
                    values?.nama_siswa
                      ? { label: values.nama_siswa, value: values.nama_siswa }
                      : null
                  } // Pastikan value diatur dengan benar
                  loadOptions={listCalonSiswaOptions}
                  isClearable
                  onChange={(data) => {
                    setFieldValue("nama_siswa", data ? data.label : ""); // Simpan nama siswa yang dipilih
                  }}
                  placeholder="Nama Calon Siswa"
                  additional={{
                    page: 1,
                  }}
                />
              </FormLabel>
            </div>

            <div className="absolute bottom-2 xl:bottom-12 right-2 left-2">
              <Button
                icon={() => <Icon name="filter" />}
                type="submit"
                content="Terapkan"
                fluid
                color="teal"
              />
            </div>
          </section>
        </Form>
      )}
    </Formik>
  );
}