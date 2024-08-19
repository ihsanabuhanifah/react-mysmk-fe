import React from "react";
import LayoutSiswa from "../../../module/layoutSiswa";
import {
  Input,
  Segment,
  Form,
  Button,
  Header,
  Divider,
  TextArea,
  Icon,
} from "semantic-ui-react";
import { Formik, Field } from 'formik';
import * as yup from "yup"

const CreateLaporanPkl = () => {
  const validationSchema = yup.object().shape({
    judul_kegiatan: yup.string().required('Judul kegiatan wajib diisi'),
    isi_laporan: yup.string().required('Isi laporan wajib diisi'),
    foto: yup.mixed().required('Foto dokumentasi wajib diisi'),
  });

  const initialValues = {
    judul_kegiatan: "",
    isi_laporan: "",
    foto: null,
  };

  const handleSubmit = (values) => {
    console.log(values);
  };

  return (
    <>
      <LayoutSiswa title="Laporan Harian">
        <Segment>
          {/* <Header>Antum bisa membuat Laporan Harian di sini</Header> */}
          {/* <Divider /> */}

          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            {({
              values,
              errors,
              touched,
              handleChange,
              handleBlur,
              handleSubmit,
              setFieldValue,
            }) => (
              <Form onSubmit={handleSubmit}>
                <Form.Field>
                  <label>Judul Jurnal Harian</label>
                  <Input
                    name="judul_kegiatan"
                    placeholder="Masukkan judul jurnal"
                    value={values.judul_kegiatan}
                    onChange={handleChange}
                    onBlur={handleBlur}
                  />
                  {touched.judul_kegiatan && errors.judul_kegiatan && (
                    <div className="ui pointing red basic label">
                      {errors.judul_kegiatan}
                    </div>
                  )}
                </Form.Field>

                <Form.Field>
                  <label>Tanggal Jurnal</label>
                  <Input
                    value={new Date().toLocaleDateString()}
                    disabled        
                  />
                </Form.Field>

                <Form.Field>
                  <label>Foto Dokumentasi</label>
                  <Input
                    type="file"
                    name="foto"
                    onChange={(event) =>
                      setFieldValue("foto", event.currentTarget.files[0])
                    }
                    onBlur={handleBlur}
                  />
                  {touched.foto && errors.foto && (
                    <div className="ui pointing red basic label">
                      {errors.foto}
                    </div>
                  )}
                </Form.Field>

                <Form.Field>
                  <label>Deskripsi Jurnal Harian</label>
                  <TextArea
                    name="isi_laporan"
                    placeholder="Apa yang antum kerjakan hari ini?"
                    value={values.isi_laporan}
                    onChange={handleChange}
                    onBlur={handleBlur}
                  />
                  {touched.isi_laporan && errors.isi_laporan && (
                    <div className="ui pointing red basic label">
                      {errors.isi_laporan}
                    </div>
                  )}
                </Form.Field>

                <Button type="submit" primary>
                  <Icon name="save" />
                  Simpan
                </Button>
              </Form>
            )}
          </Formik>
        </Segment>
      </LayoutSiswa>
    </>
  );
};

export default CreateLaporanPkl;
