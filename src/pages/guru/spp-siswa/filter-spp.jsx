import { Form, Button, Icon, Select } from "semantic-ui-react";
import { Formik } from "formik";
import { StatusSiswaOptions } from "../../../utils/options";

export default function FilterSPP({ filter, setFilter, setVisible }) {
  const onSubmit = (values, { resetForm }) => {
    console.log("Submitted values:", values);
    setFilter(values);
    setVisible(false);
    resetForm();
  };
  console.log("Initial filtes:", filter);

  return (
    <Formik  initialValues={{ status: filter.status || "" }}  enableReinitialize onSubmit={onSubmit}>
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
                type="submit"
                onClick={() => {
                  resetForm();
                  setValues({
                    status: "",
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
                options={StatusSiswaOptions}
                label="Status"
                onChange={(e, { value }) => setFieldValue("status", value)}
                onBlur={handleBlur}
                value={values.status || ""}
                placeholder="Pilih Status"
                search
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


