import { Select, Button, Icon, Form } from "semantic-ui-react";
import { getOptionsText } from "../../../../../utils/format";
import { useState } from "react";
import { Formik } from "formik";

export default function Filter({
  payload,
  onClick,
  setVisible,
  params,
  setParams,
  dataTa,
  dataPg,
}) {
  let [th, setTh] = useState("");
  
  console.log(dataTa);

  const terapkan = (values, {resetForm}) => {
    setParams((prev) => {
      return {
        ...prev,
        ta: th,
      };
    });
    setVisible(false)
    resetForm()
  };

  return (
    <Formik onSubmit={terapkan} enableReinitialize initialValues={params}>
      {({ handleSubmit,setFieldValue }) => (
        <Form onSubmit={handleSubmit}>
          <section className="p-5 bg-gray-50 border shadow-2xl h-screen space-y-5 relative">
            <div className="flex items-center justify-between">
              <button
                type="button"
                onClick={() => {
                  setVisible(false);
                }}
                className="text-lg"
              >
                Tutup
              </button>
              {/* <button
                type="button"
                onClick={() => {
                  setParams({
                    nama_mapel: null,
                    ta_id: null,
                    tanggal: null,
                  });
                  setTh("");
                  setVisible(false);
                }}
                className="text-lg"
              >
                Reset
              </button> */}
            </div>
            <div className="text-left">
              <Form.Field
                control={Select}
                value={th}
                options={getOptionsText(dataTa, "nama_tahun_ajaran")}
                label="Tahun Ajaran"
                onChange={(event, data) => {
                  setTh(data.value);
                }}
                placeholder="Pilih Tahun Ajaran"
                search
                clearable
              />
            </div>
            <div className="absolute bottom-2 xl:bottom-12 right-2 space-y-2 left-2">
              <Button
                icon={<Icon name="filter" />}
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
