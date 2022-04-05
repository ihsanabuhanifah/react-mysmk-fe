import {
  listSiswaOptions,
  listPelanggaranOptions,
  listTahunAjaran,
} from "../../../api/list";

import { useQuery } from "react-query";
import {
  kategoriPelanggaranOptions,
  semesterOptions,
} from "../../../utils/options";
import {
  Input,
  Segment,
  Form,
  Select,
  Button,
  Header,
  Divider,
  TextArea,
} from "semantic-ui-react";
import { DeleteButton } from "../../../components";
import { ReactSelectAsync, FormLabel } from "../../../components";

import { getOptions } from "../../../utils/format";
import dayjs from "dayjs";

export default function FormPelanggaran({
  values,
  setValues,
  errors,
  touched,
  handleChange,
  handleBlur,
  handleSubmit,
  isSubmitting,
  setFieldTouched,
  setFieldValue,
  resetForm,
  mode,
  setIsOpen
}) {
  let { data: dataTahunAjaran } = useQuery(
    //query key
    ["list_tahun_ajaran"],
    //axios function,triggered when page/pageSize change
    () => listTahunAjaran(),
    //configuration
    {
      keepPreviousData: true,
      staleTime: 60 * 1000 * 60 * 12, // 12 jam,
      select: (response) => response.data,
    }
  );


  return (
    <Segment>
      <div className="p-5">
        <Header>Form Pencatatan Pelanggaran</Header>
        <Divider></Divider>
        <Form onSubmit={handleSubmit}>
          {values?.pelanggaran?.map((value, index) => (
            <div
              key={index}
              className="grid grid-cols-3 gap-2 border p-5 mt-3 shadow-md"
            >
              <div className="col-span-3 flex justify-end ">
                <DeleteButton
                  disabled={values.pelanggaran.length <= 1}
                  onClick={() => {
                    let filtered = values.pelanggaran.filter((i, itemIndex) => {
                      return itemIndex != index;
                    });

                    setFieldValue("pelanggaran", filtered);
                  }}
                  size="small"
                />
              </div>
              <Form.Field
                control={Input}
                label="Tanggal"
                placeholder="Tanggal"
                name={`pelanggaran[${index}]tanggal`}
                onChange={handleChange}
                onBlur={handleBlur}
                value={dayjs(value?.tanggal).format("YYYY-MM-DD")}
                disabled={isSubmitting}
                fluid
                error={
                  errors.pelanggaran?.[index]?.tanggal &&
                  touched.pelanggaran?.[index]?.tanggal && {
                    content: `${errors?.pelanggaran?.[index]?.tanggal}`,
                    pointing: "above",
                    color: "red",
                    basic: true,
                  }
                }
                type="date"
              />

              <FormLabel
                error={
                  errors?.pelanggaran?.[index]?.student_id &&
                  touched?.pelanggaran?.[index]?.student_id
                }
                label={"Nama Siswa"}
              >
                <ReactSelectAsync
                  debounceTimeout={300}
                  value={value?.nama_siswa}
                  loadOptions={listSiswaOptions}
                  onChange={(data) => {
                    console.log(data);
                    setFieldValue(`pelanggaran[${index}]nama_siswa`, data);
                    setFieldValue(
                      `pelanggaran[${index}]student_id`,
                      data.value
                    );
                  }}
                  error={
                    errors?.pelanggaran?.[index]?.student_id &&
                    touched?.pelanggaran?.[index]?.student_id
                  }
                  placeholder="Nama Siswa"
                  additional={{
                    page: 1,
                  }}
                />
              </FormLabel>
              <FormLabel
                error={
                  errors?.pelanggaran?.[index]?.pelanggaran_id &&
                  touched?.pelanggaran?.[index]?.pelanggaran_id
                }
                label={"Pelanggaran"}
              >
                <ReactSelectAsync
                  debounceTimeout={300}
                  value={value?.nama_pelanggaran}
                  loadOptions={listPelanggaranOptions}
                  onChange={(data) => {
                    console.log(data);
                    setFieldValue(
                      `pelanggaran[${index}]nama_pelanggaran`,
                      data
                    );
                    setFieldValue(
                      `pelanggaran[${index}]pelanggaran_id`,
                      data.value
                    );
                    setFieldValue(
                      `pelanggaran[${index}]nama_pelanggaran`,
                      data
                    );
                    setFieldValue(`pelanggaran[${index}]tipe`, data.tipe);
                    setFieldValue(
                      `pelanggaran[${index}]kategori`,
                      data.kategori
                    );
                    setFieldValue(`pelanggaran[${index}]point`, data.point);
                  }}
                  error={
                    errors?.pelanggaran?.[index]?.pelanggaran_id &&
                    touched?.pelanggaran?.[index]?.pelanggaran_id
                  }
                  placeholder="Nama Pelanggaran"
                  additional={{
                    page: 1,
                  }}
                />

                {/* {errors?.absensi_kehadiran?.[index]?.surat_awal &&
                          touched?.absensi_kehadiran?.[index]?.surat_awal && (
                            <ErrorMEssage>
                              {errors?.absensi_kehadiran?.[index]?.surat_awal}
                            </ErrorMEssage>
                          )} */}
              </FormLabel>
              <Form.Field
                control={Select}
                options={semesterOptions}
                label={{
                  children: "Semester",
                  htmlFor: `pelanggaran[${index}]semester`,
                  name: `pelanggaran[${index}]semester`,
                }}
                onChange={(event, data) => {
                  setFieldValue(`pelanggaran[${index}]semester`, data.value);
                }}
                onBlur={handleBlur}
                value={value?.semester}
                placeholder="Pilih Semester"
                error={
                  errors?.pelanggaran?.[index]?.semester &&
                  touched?.pelanggaran?.[index]?.semester && {
                    content: `${errors?.pelanggaran?.[index]?.semester}`,
                    pointing: "above",
                  }
                }
                search
                searchInput={{
                  id: `pelanggaran[${index}]semester`,
                  name: `pelanggaran[${index}]semester`,
                }}
              />
              <Form.Field
                control={Select}
                options={getOptions(dataTahunAjaran?.data, "nama_tahun_ajaran")}
                label={{
                  children: "Tahun Ajaran",
                  htmlFor: `pelanggaran[${index}]ta_id`,
                  name: `pelanggaran[${index}]ta_id`,
                }}
                onChange={(event, data) => {
                  setFieldValue(`pelanggaran[${index}]ta_id`, data.value);
                }}
                onBlur={handleBlur}
                value={value?.ta_id}
                placeholder="Pilih Tahun Ajaran"
                error={
                  errors?.pelanggaran?.[index]?.ta_id &&
                  touched?.pelanggaran?.[index]?.ta_id && {
                    content: `${errors?.pelanggaran?.[index]?.ta_id}`,
                    pointing: "above",
                  }
                }
                search
                searchInput={{
                  id: `pelanggaran[${index}]ta_id`,
                  name: `pelanggaran[${index}]ta_id`,
                }}
              />
              <div></div>
              <div className="col-span-3">
                <Form.Field
                  control={TextArea}
                  label="Tindakan Sekolah"
                  placeholder="Tindakan Sekolah"
                  name={`pelanggaran[${index}]tindakan]`}
                  value={value?.tindakan}
                  onChange={handleChange}
                  fluid
                  type="text"
                />
              </div>

              <Form.Field
                control={Input}
                label="Tipe Pelanggaran"
                placeholder="Tipe Pelanggaran"
                name={`pelanggaran[${index}tipe]`}
                value={value?.tipe}
                fluid
                type="text"
              />
              <Form.Field
                control={Input}
                label="Ketegori Pelanggaran"
                placeholder="Kategori Pelanggaran"
                name={`pelanggaran[${index}kategori]`}
                value={value?.kategori}
                fluid
                type="text"
              />
              <Form.Field
                control={Input}
                label="Poin Pelanggaran"
                placeholder="Poin Pelanggaran"
                name={`pelanggaran[${index}point]`}
                value={value?.point}
                fluid
                type="text"
              />
            </div>
          ))}
          <Segment basic textAlign="center">
           {mode === 'add' &&  <Button
              basic
              type="button"
              onClick={() => {
                setFieldValue("pelanggaran", [
                  ...values.pelanggaran,
                  {
                    tanggal: "",
                    student_id: "",
                    pelapor: "",
                    pelanggaran_id: "",
                    status: "",
                    tindakan: "",
                    penindak: null,
                    semester: "",
                    ta_id: "",
                    tahun_ajaran: null,
                    nama_siswa: null,
                    tahun_ajaran: null,
                    tipe: "",
                    kategori: "",
                    point: "",
                    nama_pelanggaran: null,
                  },
                ]);
              }}
              color="teal"
              content="Tambah"
              icon="add"
              labelPosition="left"
            />}
          </Segment>

          <div className="grid grid-cols-3 gap-5">
            <div className="col-start-3 grid grid-cols-2 gap-x-5">
              <Button
                content={"Batal"}
                type="button"
                fluid
                basic
                onClick={() => {
                  // setValues(initialValue);
                  setIsOpen(false)
                  resetForm();
                }}
                size="medium"
                color="red"
                disabled={isSubmitting}
              />
              <Button
                content={mode === "update" ? "Perbahrui" : "Simpan"}
                type="submit"
                fluid
                basic
                size="medium"
                color="teal"
                loading={isSubmitting}
                disabled={isSubmitting}
              />
            </div>
          </div>
        </Form>
      </div>
    </Segment>
  );
}
