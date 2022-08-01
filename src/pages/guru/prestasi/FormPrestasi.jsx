import {
  listSiswaOptions,
  listTahunAjaran,
} from "../../../api/list";

import { useQuery } from "react-query";
import { kategoriOptions, semesterOptions } from "../../../utils/options";
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
import useList from "../../../hook/useList";

export default function FormPrestasi({
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
  setIsOpen,
}) {
  const {dataTa} = useList()

  return (
    <Segment>
      <div className="p-0 lg:p-5">
        <Header>Form Pencatatan Prestasi</Header>
        <Divider></Divider>
        <Form onSubmit={handleSubmit}>
          {values?.prestasi?.map((value, index) => (
            <div
              key={index}
              className="grid grid-cols-3 gap-2 border p-5 mt-3 shadow-md"
            >
              <div className="col-span-3 flex justify-end ">
                <DeleteButton
                  disabled={values.prestasi.length <= 1}
                  onClick={() => {
                    let filtered = values.prestasi.filter((i, itemIndex) => {
                      return itemIndex !== index;
                    });

                    setFieldValue("prestasi", filtered);
                  }}
                  size="small"
                />
              </div>
           <div className="col-span-3 lg:col-span-1">
            <Form.Field
                control={Input}
                label="Tanggal"
                placeholder="Tanggal"
                name={`prestasi[${index}]tanggal`}
                onChange={handleChange}
                onBlur={handleBlur}
                value={dayjs(value?.tanggal).format("YYYY-MM-DD")}
                disabled={isSubmitting}
                fluid
                error={
                  errors.prestasi?.[index]?.tanggal &&
                  touched.prestasi?.[index]?.tanggal && {
                    content: `${errors?.prestasi?.[index]?.tanggal}`,
                    pointing: "above",
                    color: "red",
                    basic: true,
                  }
                }
                type="date"
              />
            </div>

           <div className="col-span-3 lg:col-span-1">
            <FormLabel
                error={
                  errors?.prestasi?.[index]?.student_id &&
                  touched?.prestasi?.[index]?.student_id
                }
                label={"Nama Siswa"}
              >
                <ReactSelectAsync
                  debounceTimeout={300}
                  value={value?.nama_siswa}
                  loadOptions={listSiswaOptions}
                  isDisabled={isSubmitting}
                  onChange={(data) => {
                    console.log(data);
                    setFieldValue(`prestasi[${index}]nama_siswa`, data);
                    setFieldValue(`prestasi[${index}]student_id`, data.value);
                  }}
                  error={
                    errors?.prestasi?.[index]?.student_id &&
                    touched?.prestasi?.[index]?.student_id
                  }
                  placeholder="Nama Siswa"
                  additional={{
                    page: 1,
                  }}
                />
              </FormLabel>
            </div>
             <div className="col-span-3 lg:col-span-1">
              <Form.Field
                control={Select}
                options={kategoriOptions}
                label={{
                  children: "Kategori",
                  htmlFor: `prestasi[${index}]kategori`,
                  name: `prestasi[${index}]kategori`,
                }}
                onChange={(event, data) => {
                  setFieldValue(`prestasi[${index}]kategori`, data.value);
                }}
                onBlur={handleBlur}
                value={value?.kategori}
                placeholder="Pilih Kategori"
                error={
                  errors?.prestasi?.[index]?.kategori &&
                  touched?.prestasi?.[index]?.kategori && {
                    content: `${errors?.prestasi?.[index]?.kategori}`,
                    pointing: "above",
                  }
                }
                disabled={isSubmitting}
                search
                searchInput={{
                  id: `prestasi[${index}]kategori`,
                  name: `prestasi[${index}]kategori`,
                }}
              />
              </div>

             <div className="col-span-3 lg:col-span-1">
              <Form.Field
                control={Select}
                options={semesterOptions}
                label={{
                  children: "Semester",
                  htmlFor: `prestasi[${index}]semester`,
                  name: `prestasi[${index}]semester`,
                }}
                onChange={(event, data) => {
                  setFieldValue(`prestasi[${index}]semester`, data.value);
                }}
                onBlur={handleBlur}
                value={value?.semester}
                placeholder="Pilih Semester"
                error={
                  errors?.prestasi?.[index]?.semester &&
                  touched?.prestasi?.[index]?.semester && {
                    content: `${errors?.prestasi?.[index]?.semester}`,
                    pointing: "above",
                  }
                }
                disabled={isSubmitting}
                search
                searchInput={{
                  id: `prestasi[${index}]semester`,
                  name: `prestasi[${index}]semester`,
                }}
              />
              </div>
            <div className="col-span-3 lg:col-span-1">
             <Form.Field
                control={Select}
                options={getOptions(dataTa?.data, "nama_tahun_ajaran")}
                label={{
                  children: "Tahun Ajaran",
                  htmlFor: `prestasi[${index}]ta_id`,
                  name: `prestasi[${index}]ta_id`,
                }}
                onChange={(event, data) => {
                  setFieldValue(`prestasi[${index}]ta_id`, data.value);
                }}
                onBlur={handleBlur}
                value={value?.ta_id}
                placeholder="Pilih Tahun Ajaran"
                error={
                  errors?.prestasi?.[index]?.ta_id &&
                  touched?.prestasi?.[index]?.ta_id && {
                    content: `${errors?.prestasi?.[index]?.ta_id}`,
                    pointing: "above",
                  }
                }
                search
                searchInput={{
                  id: `prestasi[${index}]ta_id`,
                  name: `prestasi[${index}]ta_id`,
                }}
                disabled={isSubmitting}
              />
             </div>
              <div className="col-span-3 col-start-1">
                <Form.Field
                  control={TextArea}
                  label="Prestasi"
                  placeholder="Prestasi"
                  name={`prestasi[${index}]prestasi]`}
                  value={value?.prestasi}
                  onChange={handleChange}
                  fluid
                  type="text"
                  disabled={isSubmitting}
                  error={
                    errors?.prestasi?.[index]?.prestasi &&
                    touched?.prestasi?.[index]?.prestasi && {
                      content: `${errors?.prestasi?.[index]?.prestasi}`,
                      pointing: "above",
                    }
                  }
                />
              </div>
            </div>
          ))}
          <Segment basic textAlign="center">
            {mode === "add" && (
              <Button
                basic
                fluid
                type="button"
                onClick={() => {
                  setFieldValue("prestasi", [
                    ...values.prestasi,
                    {
                      tanggal: "",
                      student_id: "",
                      kategori: "",
                      prestasi: "",
                      semester: "",
                      ta_id: "",
                      nama_siswa: null,
                    },
                  ]);
                }}
                color="teal"
                content="Tambah"
                icon="add"
                labelPosition="left"
              />
            )}
          </Segment>

          <div className="grid grid-cols-3 gap-5 ">
            <div className="col-start-1 lg:col-start-3 grid col-span-3  grid-cols-2  gap-x-5">
              <Button
                content={"Batal"}
                type="button"
                fluid
                basic
                onClick={() => {
                  // setValues(initialValue);
                  setIsOpen(false);
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
