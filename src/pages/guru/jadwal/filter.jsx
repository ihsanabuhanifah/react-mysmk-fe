import {
  Input,
  Table,
  Select,
  Form,
  Button,
  Segment,
  Header,
  TextArea,
  Dropdown,
} from "semantic-ui-react";
import InputRangeDate from "../../../components/inputDateRange";
import { Formik } from "formik";
import { getOptionsText } from "../../../utils/format";
import { izinOptions } from "../../../utils/options";
import { ReactSelectAsync, FormLabel } from "../../../components";
import { listSiswaOptions } from "../../../api/list";
export default function Filter({ listGuru, listKelas, listTa, listMapel }) {
  return (
    <Formik>
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
        <Form>
          <section className="p-5 bg-gray-50 border shadow-2xl h-screen space-y-5 relative">
            <div className="flex items-center justify-between">
              <button className="text-lg">Filter</button>
              <button className="text-lg">Reset</button>
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
                name="email"
                onChange={(e) => {
                  //   setTanggalActive(e.target.value);
                }}
                // value={tanggalActive}
                // disabled={isSubmitting}
                type="date"
              />
            </div>
            <div className="text-left">
              <Form.Field
                control={Input}
                label={{
                  children: "Sampai Tanggal ",
                  color: "red",
                  className: "text-red-500",
                  size: "medium",
                }}
                name="email"
                onChange={(e) => {
                  //   setTanggalActive(e.target.value);
                }}
                // value={tanggalActive}
                // disabled={isSubmitting}
                type="date"
              />
            </div>
            <div className="text-left">
              <Form.Field
                control={Select}
                // value={absen?.nama_kelas}
                options={getOptionsText(listKelas?.data, "nama_kelas")}
                label={{
                  children: "Kelas",
                  //   htmlFor: `laporan.guru.absen[${index}]nama_kelas`,
                  //   name: `laporan.guru.absen[${index}]nama_kelas`,
                }}
                onChange={(event, data) => {
                  //   setFieldValue(
                  //     `laporan.guru.absen[${index}]nama_kelas`,
                  //     data?.value
                  //   );
                }}
                placeholder="Nama Kelas"
                search
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
                options={getOptionsText(listGuru?.data, "nama_guru")}
                label={{
                  children: "Nama Guru",
                  //   htmlFor: `laporan.guru.absen[${index}]nama_guru`,
                  //   name: `laporan.guru.absen[${index}]nama_guru`,
                }}
                onChange={(event, data) => {
                  //   setFieldValue(
                  //     `laporan.guru.absen[${index}]nama_guru`,
                  //     data?.value
                  //   );
                }}
                placeholder="Nama Guru"
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
            <div className="text-left">
              <Form.Field
                control={Select}
                // value={absen?.nama_guru}
                options={getOptionsText(listMapel?.data, "nama_mapel")}
                label={{
                  children: "Mata Pelajaran",
                  //   htmlFor: `laporan.guru.absen[${index}]nama_guru`,
                  //   name: `laporan.guru.absen[${index}]nama_guru`,
                }}
                onChange={(event, data) => {
                  //   setFieldValue(
                  //     `laporan.guru.absen[${index}]nama_guru`,
                  //     data?.value
                  //   );
                }}
                placeholder="Mata Pelajaran"
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
            <div className="text-left">
              <Form.Field
                control={Select}
                // value={absen?.nama_guru}
                options={getOptionsText(listTa?.data, "nama_tahun_ajaran")}
                label={{
                  children: "Tahun Pelajaran",
                  //   htmlFor: `laporan.guru.absen[${index}]nama_guru`,
                  //   name: `laporan.guru.absen[${index}]nama_guru`,
                }}
                onChange={(event, data) => {
                  //   setFieldValue(
                  //     `laporan.guru.absen[${index}]nama_guru`,
                  //     data?.value
                  //   );
                }}
                placeholder="Tahun Pelajaran"
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

            <div className="text-left">
                <FormLabel
              
                  label={"Nama Siswa"}
                >
                  <ReactSelectAsync
                    debounceTimeout={300}
                    // value={value?.nama_siswa}
                    loadOptions={listSiswaOptions}
                    isClearable
                    onChange={(data) => {
                    //   console.log(data);
                    //   setFieldValue(`pelanggaran[${index}]nama_siswa`, data);
                    //   setFieldValue(
                    //     `pelanggaran[${index}]student_id`,
                    //     data.value
                    //   );
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
                  //   setFieldValue(
                  //     `laporan.guru.absen[${index}]nama_guru`,
                  //     data?.value
                  //   );
                }}
                fluid
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
              <Button content="Filter" fluid color="teal" />
            </div>
          </section>
        </Form>
      )}
    </Formik>
  );
}
