import React, { useEffect, useState } from "react";
import { Formik } from "formik";
import { Button, Form, Icon } from "semantic-ui-react";
import { toast } from "react-toastify";
import { useQuery, useQueryClient } from "react-query";
import { updateSiswaKelasHandle } from "../../../../api/guru/siswa";
import { getCalonSantriById } from "../../../../api/guru/calonSiswa";

const FormikComponent = ({ id, onSuccess, onError }) => {
  const queryClient = useQueryClient();
  const [initialValues, setInitialValues] = useState({
    nama_siswa: '',
    nis: '',
    nisn: '',
    tempat_lahir: '',
    // tanggal_lahir: '',
    nama_kelas: '',
  });

  const { data: CalonSantriData, isLoading, error } = useQuery(
    ["ppdb/detail-calsan", id],
    () => getCalonSantriById(id),
    {
      onSuccess: (data) => {
        setInitialValues({
          nama_siswa: data.siswa.nama_siswa || '',
          nis: data.siswa.nis || '',
          nisn: data.siswa.nisn || '',
          tempat_lahir: data.siswa.tempat_lahir || '',
          // // tanggal_lahir: data.siswa.tanggal_lahir || '',
          nama_kelas: data.siswa.kelas.nama_kelas || '',
        });
      },
      onError: (err) => {
        console.error("Failed to fetch siswa data:", err);
        toast.error("Gagal mengambil data siswa", {
          position: "top-right",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "colored",
        });
      },
    }
  );

  const onSubmit = async (values, { resetForm }) => {
    try {
      const response = await updateSiswaKelasHandle(values);
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
      queryClient.invalidateQueries("siswa/list");
      onSuccess && onSuccess();
    } catch (err) {
      if (err?.response?.status === 422) {
        toast.warn(err?.response?.data?.msg, {
          position: "top-right",
          autoClose: 1000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "colored",
        });
      } else {
        toast.error("Ada Kesalahan", {
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
              <label htmlFor="nama_siswa">Nama Siswa</label>
              <Form.Input
                value={values?.nama_siswa}
                id="nama_siswa"
                name="nama_siswa"
                onChange={handleChange}
                style={{ width: '100%' }}
              />
            </section>
            <section>
              <label htmlFor="nis">NIS</label>
              <Form.Input
                value={values?.nis}
                id="nis"
                name="nis"
                onChange={handleChange}
                style={{ width: '100%' }}
              />
            </section>
            <section>
              <label htmlFor="nisn">NISN</label>
              <Form.Input
                value={values?.nisn}
                id="nisn"
                name="nisn"
                onChange={handleChange}
                style={{ width: '100%' }}
              />
            </section>
            <section>
              <label htmlFor="tempat_lahir">Tempat Tanggal Lahir</label>
              <Form.Input
                value={values?.tempat_lahir}
                id="tempat_lahir"
                name="tempat_lahir"
                onChange={handleChange}
                style={{ width: '100%' }}
              />
            </section>
            {/* <section>
              <label htmlFor="tanggal_lahir">Tanggal Lahir</label>
              <Form.Input
                value={values?.tanggal_lahir}
                id="tanggal_lahir"
                name="tanggal_lahir"
                onChange={handleChange}
                style={{ width: '100%' }}
              />
            </section> */}
            <section>
              <label htmlFor="nama_kelas">Nama Kelas</label>
              <Form.Input
                value={values?.nama_kelas}
                id="nama_kelas"
                name="nama_kelas"
                onChange={handleChange}
                style={{ width: '100%' }}
              />
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
