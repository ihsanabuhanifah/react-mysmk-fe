import {
    Input,
  
    Select,
    Form,
    Button,
   
    Icon
  } from "semantic-ui-react";
  import InputRangeDate from "../../../components/inputDateRange";
  import { Formik, setNestedObjectValues } from "formik";
  import { getOptionsText } from "../../../utils/format";
  import { izinOptions } from "../../../utils/options";
  import { ReactSelectAsync, FormLabel } from "../../../components";
  import { listSiswaOptions } from "../../../api/list";
  
  import useList from "../../../hook/useList";
  
  export default function FilterRekap({ filter, setFilter, setVisible }) {
    const { dataGuru, dataTa } = useList();
  
    const onSubmit = (values, {resetForm}) => {
      setFilter(values);
      setVisible(false);
      resetForm()
    };
  
    // let initialValues = {
    //   dariTanggal: filter?.dariTanggal,
    //   sampaiTanggal: filter?.sampaiTanggal,
    //   nama_mapel: filter?.nama_mapel,
    //   nama_guru: filter?.nama_guru,
    //   nama_kelas: filter?.nama_kelas,
    //   nama_siswa: filter?.nama_siswa,
    //   status_kehadiran: filter?.status_kehadiran,
    //   tahun_ajaran: filter?.tahun_ajaran,
    // };
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
                  control={Input}
                  label={{
                    children: "Mulai Tanggal",
                    color: "red",
                    className: "text-red-500",
                    size: "medium",
                  }}
                  onChange={(e) => {
                    setFieldValue("dariTanggal", e.target.value);
                  }}
                  value={values?.dariTanggal}
                  // disabled={isSubmitting}
                  type="date"
                />
              </div>
  
              {console.log('ljhjg',values)}
              <div className="text-left">
                <Form.Field
                  control={Input}
                  label={{
                    children: "Sampai Tanggal ",
                    color: "red",
                    className: "text-red-500",
                    size: "medium",
                  }}
                  onChange={(e) => {
                    setFieldValue("sampaiTanggal", e.target.value);
                  }}
                  value={values?.sampaiTanggal}
                  type="date"
                />
              </div>
             
              <div className="text-left">
                <Form.Field
                  control={Select}
                  // value={absen?.nama_guru}
                  options={getOptionsText(dataGuru?.data, "nama_guru")}
                  label={{
                    children: "Nama Guru",
                  }}
                  onChange={(event, data) => {
                    setFieldValue(`nama_guru`, data?.value);
                  }}
                  placeholder="Nama Guru"
                  search
                  clearable
                  value={values?.nama_guru}
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
  
              <div className="text-left">
                <Form.Field
                  control={Select}
                  // value={absen?.nama_guru}
                  options={izinOptions}
                  label={{
                    children: "Status Kehadiran",
                    //   htmlFor: `laporan.guru.absen[${index}]nama_guru`,
                    //   name: `laporan.guru.absen[${index}]nama_guru`,
                  }}
                  onChange={(event, data) => {
                    setFieldValue(`status_kehadiran`, data?.value);
                  }}
                  fluid
                  value={values?.status_kehadiran}
                  placeholder="Status Kehadiran"
                  search
                  clearable
                  searchInput={
                    {
                      //   id: `laporan.guru.absen[${index}]nama_guru`,
                      //   name: `laporan.guru.absen[${index}]nama_guru`,
                    }
                  }
                />
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
  