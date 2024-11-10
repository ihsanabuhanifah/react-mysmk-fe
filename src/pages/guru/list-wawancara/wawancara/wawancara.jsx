import React, { useState } from "react";
import { Formik } from "formik";
import { Button, Form, Icon } from "semantic-ui-react";
import { toast } from "react-toastify";
import { useQuery, useQueryClient } from "react-query";
import { useNavigate } from "react-router-dom";
import { konfirmasiWawancara } from "../../../../api/guru/wawancara";

const FormikComponent = ({ id, onSuccess, onError }) => {
  const queryClient = useQueryClient();
  const navigate = useNavigate(); // Instantiate navigate
  const [initialValues, setInitialValues] = useState({
    status: null, // Set default to null
  });

  // Ambil data pembayaran berdasarkan id
  const { data, isLoading, error } = useQuery(
    ["wawancara/konfirmasi", id],
    () => konfirmasiWawancara(id), 
    {
      enabled: !!id, // Pastikan query hanya dijalankan jika id ada
      onSuccess: (data) => {
        setInitialValues({
          status: Number(data?.wawancara?.status) || null, // Pastikan status diisi dari data dan diubah ke number
        });
      },
      onError: (err) => {
        console.error("Failed to fetch wawancara data:", err);
        toast.error("Gagal mengambil data wawancara", {
          position: "top-right",
          autoClose: 2000,
        });
      },
    }
  );

  const onSubmit = async (values, { resetForm }) => {
    try {
      // Kirim status sebagai objek data
      const response = await konfirmasiWawancara(id, { status: values.status });
      
      // Tampilkan popup saat respons berhasil
      toast.success("Pembayaran berhasil dikonfirmasi!", {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });

      resetForm();
      queryClient.invalidateQueries("wawancara/list");
      onSuccess && onSuccess();

      // Navigasi ke halaman list wawancara
      navigate("/guru/wawancara/list"); // Ubah path sesuai dengan rute yang tepat
    } catch (err) {
      // Tampilkan popup saat terjadi error
      toast.error("Terjadi kesalahan saat mengonfirmasi pembayaran.", {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
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
              <label htmlFor="status">Status Wawancara</label>
              <Form.Group inline>
                <Form.Radio
                  label="Sudah Wawanwacara"
                  value={1}
                  checked={values.status_tes === "sudah"}
                  onChange={() => handleChange({ target: { name: "status", value: 1 } })}
                  name="status"
                />
                <Form.Radio
                  label="Belum Wawancara"
                  value={0}
                  checked={values.status_tes === "belum"}
                  onChange={() => handleChange({ target: { name: "status", value: 0 } })}
                  name="status"
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
