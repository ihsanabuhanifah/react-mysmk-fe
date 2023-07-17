import {
  Input,

  Select,
  Form,
  Button,
 
  Icon
} from "semantic-ui-react";
import { Formik} from "formik";
import { getOptionsText } from "../../../utils/format";
import { ReactSelectAsync, FormLabel } from "../../../components";
import { listSiswaOptions } from "../../../api/list";

import useList from "../../../hook/useList";

export default function FilterSiswa({ filter, setFilter, setVisible }) {
  const { dataKelas, dataMapel, dataTa } = useList();

  const onSubmit = (values, {resetForm}) => {
    setFilter(values);
    setVisible(false);
    resetForm()
  };

  
  return (
    <Formik initialValues={filter} enableReinitialize onSubmit={onSubmit}>
      {({ values, setValues, resetForm, handleSubmit, setFieldValue }) => (
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
                    dariTanggal: '',
                    sampaiTanggal: '',
                    nama_mapel: '',
                    nama_guru: '',
                    nama_kelas: '',
                    nama_siswa: '',
                    status_kehadiran: '',
                    tahun_ajaran: '',
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
                // value={absen?.nama_kelas}
                options={getOptionsText(dataKelas?.data, "nama_kelas")}
                label={{
                  children: "Kelas",
                }}
                onChange={(event, data) => {
                  setFieldValue(`nama_kelas`, data?.value);
                }}
                placeholder="Nama Kelas"
                search
                value={values?.nama_kelas}
                clearable
                searchInput={
                  {
                    //   id: `laporan.guru.absen[${index}]nama_kelas`,
                    //   name: `laporan.guru.absen[${index}]nama_kelas`,
                  }
                }
              />
            </div>
            
            
            <div className="text-left">
              <Form.Field
                control={Select}
                // value={absen?.nama_guru}
                options={getOptionsText(dataTa?.data, "nama_tahun_ajaran")}
                label={{
                  children: "Tahun Pelajaran",
                  //   htmlFor: `laporan.guru.absen[${index}]nama_guru`,
                  //   name: `laporan.guru.absen[${index}]nama_guru`,
                }}
                onChange={(event, data) => {
                  setFieldValue(`tahun_ajaran`, data?.value);
                }}
                placeholder="Tahun Pelajaran"
                search
                value={values?.tahun_ajaran}
                clearable
                searchInput={
                  {
                    //   id: `laporan.guru.absen[${index}]nama_guru`,
                    //   name: `laporan.guru.absen[${index}]nama_guru`,
                  }
                }
              />
            </div>

            <div className="text-left">
              <FormLabel label={"Nama Siswa"}>
                <ReactSelectAsync
                  debounceTimeout={300}
                  value={values?.nama_siswa}
                  loadOptions={listSiswaOptions}
                  isClearable
                  onChange={(data) => {
                    setFieldValue(`nama_siswa`, data);
                  }}
                  placeholder="Nama Siswa"
                  additional={{
                    page: 1,
                  }}
                />
              </FormLabel>
            </div>

            
            {/* <div>
            <InputRangeDate />
          </div> */}
            <div className="absolute bottom-2 xl:bottom-12 right-2 left-2">
              <Button   icon={()=> <Icon name='filter'  />} type="submit" content="Terapkan" fluid color="teal" />
            </div>
          </section>
        </Form>
      )}
    </Formik>
  );
}
