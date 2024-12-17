import { Form, Button, Icon, Select } from "semantic-ui-react";
import { Formik } from "formik";
import { getOptionsText } from "../../../utils/format";
import useList from "../../../hook/useList";

export default function FilterDetailSPP({ filter, setFilter, setVisible }) {
  const onSubmit = (values, { resetForm }) => {
    console.log("Submitted values:", values);
    setFilter(values);
    setVisible(false);
    resetForm();
  };

  console.log("Initial filter:", filter);

  const { dataTa } = useList();

  return (
    <Formik
      initialValues={{ nama_tahun_ajaran: filter.nama_tahun_ajaran || "" }}
      enableReinitialize
      onSubmit={onSubmit}
    >
      {({
        values,
        setValues,
        handleBlur,
        resetForm,
        handleSubmit,
        setFieldValue,
      }) => (
        <Form onSubmit={handleSubmit}>
          <section className="p-5 bg-gray-50 border shadow-2xl h-screen space-y-5 relative">
            <div className="flex items-center justify-between">
              <button
                type="b"
                onClick={() => {
                  setVisible(false);
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
                    nama_tahun_ajaran: "",
                  });
                  setFilter({}); 
                  setVisible(false);
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
                label="Tahun Ajaran"
                onChange={(e, { value }) => {
                  setFieldValue("nama_tahun_ajaran", value);
                }}
                placeholder="Tahun Pelajaran"
                search
                value={values.nama_tahun_ajaran || ""} // Menggunakan values.tahun_ajaran
                clearable
              />
            </div>
            {/* <div>
              <InputRangeDate />
            </div> */}
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
