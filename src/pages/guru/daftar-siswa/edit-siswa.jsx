import React from "react";
import LayoutPage from "../../../module/layoutPage";
import { Form, Button, Icon, Tab } from "semantic-ui-react";
import { toast } from "react-toastify";
import { useQuery, useQueryClient } from "react-query";
import { useNavigate, useParams } from "react-router-dom";
import { Formik } from "formik";
import { getSiswaById, updateSiswaKelasHandle } from "../../../api/guru/siswa";

// Komponen untuk setiap konten
const ProfileContent = ({ values, handleChange }) => (
  <div className="flex flex-col gap-y-2 gap-x-5 shadow-md p-5 mt-5">
    <section>
      <Form.Input
        value={values?.nama_siswa}
        label="Nama Siswa"
        id="nama_siswa"
        name="nama_siswa"
        onChange={handleChange}
      />
    </section>
    <section>
      <Form.Input
        value={values?.nis}
        label="NIS"
        id="nis"
        name="nis"
        onChange={handleChange}
      />
    </section>
    <section>
      <Form.Input
        value={values?.nisn}
        label="NISN"
        id="nisn"
        name="nisn"
        onChange={handleChange}
      />
    </section>
    <section>
      <Form.Input
        value={values?.tempat_lahir}
        label="Tempat Lahir"
        id="tempat_lahir"
        name="tempat_lahir"
        onChange={handleChange}
      />
    </section>
    <section>
      <Form.Input
        value={values?.tanggal_lahir}
        label="Tanggal Lahir"
        id="tanggal_lahir"
        name="tanggal_lahir"
        onChange={handleChange}
      />
    </section>
    <section>
      <Form.Input
        value={values?.nama_kelas}
        label="Nama Kelas"
        id="nama_kelas"
        name="nama_kelas"
        onChange={handleChange}
      />
    </section>
  </div>
);

const NilaiContent = () => <div>Konten Nilai</div>;

const UjianContent = () => <div>Konten Ujian</div>;

const PelanggaranContent = () => <div>Konten Pelanggaran</div>;

export function EditSiswa() {
  const queryClient = useQueryClient();
  const [visible, setVisible] = React.useState(false);
  const navigate = useNavigate();
  const { nama } = useParams(); // menangkap parameter 'nama' dari URL

  const [initialState, setInitialState] = React.useState({
    data: {
      nama_siswa: "",
      nis: "",
      nisn: "",
      tempat_lahir: "",
      tanggal_lahir: "",
      nama_kelas: "",
    },
  });

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

  const {
    data: siswaData,
    isLoading,
    error,
  } = useQuery(["siswa/detail", nama], () => getSiswaById(nama), {
    onSuccess: (data) => {
      setInitialState({
        data: {
          nama_siswa: data.siswa.nama_siswa,
          nis: data.siswa.nis,
          nisn: data.siswa.nisn,
          tempat_lahir: data.siswa.tempat_lahir,
          tanggal_lahir: data.siswa.tanggal_lahir,
          nama_kelas: data.siswa.kelas.nama_kelas,
        },
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
  });

  const panes = [
    {
      menuItem: "Profile",
      render: () => (
        <Tab.Pane style={{ border: "none", boxShadow: "none" }}>
          <ProfileContent values={initialState.data} handleChange={() => {}} />
        </Tab.Pane>
      ),
    },
    {
      menuItem: "Nilai",
      render: () => (
        <Tab.Pane style={{ border: "none", boxShadow: "none" }}>
          <NilaiContent />
        </Tab.Pane>
      ),
    },
    {
      menuItem: "Ujian",
      render: () => (
        <Tab.Pane style={{ border: "none", boxShadow: "none" }}>
          <UjianContent />
        </Tab.Pane>
      ),
    },
    {
      menuItem: "Pelanggaran",
      render: () => (
        <Tab.Pane style={{ border: "none", boxShadow: "none" }}>
          <PelanggaranContent />
        </Tab.Pane>
      ),
    },
  ];

  return (
    <LayoutPage
      title={`Edit Siswa: ${decodeURIComponent(nama)}`}
      visible={visible}
      setVisible={setVisible}
    >
      <section className="grid grid-cols-6 gap-5">
        <div className="col-span-6 lg:col-span-1 xl:col-span-1">
          <Tab menu={{ secondary: true, pointing: true }} panes={panes} />
        </div>
      </section>
      <Formik
        initialValues={initialState.data}
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
          <>
            <div>
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
          </>
        )}
      </Formik>
    </LayoutPage>
  );
}
