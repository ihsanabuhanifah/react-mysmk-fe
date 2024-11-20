import React, { useState } from "react";
import { Formik } from "formik";
import { Button, Form, Icon } from "semantic-ui-react";
import { toast } from "react-toastify";
import { useQuery, useQueryClient } from "react-query";
import { useNavigate } from "react-router-dom";
import { konfirmasiWawancara, useFetchWawancaraDetails } from "../../../../api/guru/wawancara";

const FormikComponent = ({ id, onSuccess, onError }) => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  // Ambil data wawancara untuk diisi ke initialValues
  const { data: wawancaraData, isLoading, error } = useFetchWawancaraDetails(id);

  const [initialValues, setInitialValues] = useState({
    status_tes: wawancaraData?.status_tes || "", // Menyesuaikan dengan status_tes dari API
    is_lulus:wawancaraData?.is_lulus || ""
  });

  // Memperbarui initialValues ketika wawancaraData berubah
  React.useEffect(() => {
    if (wawancaraData) {
      setInitialValues({
        status_tes: wawancaraData.status_tes, // Menetapkan status tes awal dari data yang diterima
        is_lulus:wawancaraData.is_lulus
      });
    }
  }, [wawancaraData]);

  const onSubmit = async (values, { resetForm }) => {
    try {
      // Buat objek data hanya dengan field yang diisi
      const dataToSend = {};
      if (values.status_tes) dataToSend.status_tes = values.status_tes;
      if (values.is_lulus) dataToSend.is_lulus = values.is_lulus;
  
      // Kirim data update ke API hanya dengan field yang ada isinya
      const response = await konfirmasiWawancara(id, dataToSend);
  
      // Tampilkan notifikasi berhasil
      toast.success("Wawancara berhasil dikonfirmasi!", {
        position: "top-right",
        autoClose: 2000,
      });
  
      resetForm();
      queryClient.invalidateQueries("wawancara/list");
      onSuccess && onSuccess();
  
      // Navigasi ke halaman list wawancara
      navigate("/guru/list-wawancara");
    } catch (err) {
      // Tampilkan notifikasi error
      toast.error("Terjadi kesalahan saat mengonfirmasi wawancara.", {
        position: "top-right",
        autoClose: 2000,
      });
      onError && onError(err);
    }
  };
  

  return (
    <Formik
      initialValues={initialValues}
      enableReinitialize
      onSubmit={onSubmit}
    >
      {({ values, handleChange, handleSubmit, isSubmitting }) => (
        <form onSubmit={handleSubmit}>
          <div className="flex flex-col gap-y-2 gap-x-5 shadow-md p-5 mt-5">
            <section>
              <label htmlFor="status_tes">Status Wawancara</label>
              <Form.Group inline>
                <Form.Radio
                  label="Sudah Wawancara"
                  value="sudah"
                  checked={values.status_tes === "sudah"}
                  onChange={() => handleChange({ target: { name: "status_tes", value: "sudah" } })}
                  name="status_tes"
                />
                <Form.Radio
                  label="Belum Wawancara"
                  value="belum"
                  checked={values.status_tes === "belum"}
                  onChange={() => handleChange({ target: { name: "status_tes", value: "belum" } })}
                  name="status_tes"
                />
              </Form.Group>
            </section>

            <section className="pt-8">
              <label htmlFor="is_lulus">Apakah Santri Ini Lulus?</label>
              <Form.Group inline>
                <Form.Radio
                  label="Lulus"
                  value={"lulus"}
                  checked={values.is_lulus === "lulus"}
                  onChange={() => handleChange({ target: { name: "is_lulus", value: 'lulus' } })}
                  name="is_lulus"
                />
                <Form.Radio
                  label="Tidak Lulus"
                  value={"tidak lulus"}
                  checked={values.is_lulus === "tidak lulus"}
                  onChange={() => handleChange({ target: { name: "is_lulus", value: 'tidak lulus' } })}
                  name="is_lulus"
                />
              </Form.Group>
            </section>


            <div className="mt-5">
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
        </form>
      )}
    </Formik>
  );
};

export default FormikComponent;
