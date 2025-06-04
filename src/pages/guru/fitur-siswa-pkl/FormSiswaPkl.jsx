import { listSiswaPklOptions, listPelanggaranOptions } from "../../../api/list";

import { semesterOptions } from "../../../utils/options";
import {
  Input,
  Segment,
  Form,
  Select,
  Button,
  Header,
  Divider,
  TextArea,
  Icon,
} from "semantic-ui-react";
import { DeleteButton } from "../../../components";
import { ReactSelectAsync, FormLabel } from "../../../components";

import { getOptions } from "../../../utils/format";
import dayjs from "dayjs";
import useList from "../../../hook/useList";

export default function FormFiturPkl({
  values,

  errors,
  touched,
  handleChange,
  handleBlur,
  handleSubmit,
  isSubmitting,

  setFieldValue,
  resetForm,
  mode,
  setIsOpen,
}) {
  const { dataTa, dataGuru } = useList();

  return (
    <Segment>
      <div className="p-0 lg:p-5">
        <Header>Form Pencatatan Fitur Pkl</Header>
        <Divider></Divider>
        <Form onSubmit={handleSubmit}>
          {values?.data?.map((value, index) => (
            <div
              key={index}
              className="mt-3 grid grid-cols-3 gap-2 border p-5 shadow-md"
            >
              <div className="col-span-3 flex justify-end">
                <DeleteButton
                  disabled={values.data.length <= 1}
                  onClick={() => {
                    let filtered = values.data.filter((i, itemIndex) => {
                      return itemIndex != index;
                    });

                    setFieldValue("data", filtered);
                  }}
                  size="small"
                />
              </div>

              <div className="col-span-3 lg:col-span-1">
                <FormLabel
                  error={
                    errors?.data?.[index]?.student_id &&
                    touched?.data?.[index]?.student_id
                  }
                  label={"Nama Siswa"}
                >
                  <ReactSelectAsync
                    debounceTimeout={300}
                    value={value?.nama_siswa}
                    loadOptions={listSiswaPklOptions}
                    onChange={(data) => {
                      setFieldValue(`data[${index}]nama_siswa`, data);
                      setFieldValue(`data[${index}]student_id`, data.value);
                    }}
                    // error={
                    //   errors?.data?.[index]?.student_id &&
                    //   touched?.data?.[index]?.student_id
                    // }
                    placeholder="Nama Siswa"
                    additional={{
                      page: 1,
                    }}
                  />
                </FormLabel>
              </div>
              <section className="col-span-3 lg:col-span-1">
                <Form.Field
                  control={Input}
                  label="Perusahaan PKL Santri"
                  placeholder="Ketikan Perusahaan PKL Santri"
                  name={`data[${index}].nama_perusahaan`}
                  value={value?.nama_perusahaan}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  fluid
                  type="text"
                />
              </section>

              <section className="col-span-3 lg:col-span-1">
                <Form.Field
                  control={Input}
                  label="Nomer Telepon Santri"
                  placeholder="Ketikan Nomer Telepon Santri"
                  name={`data[${index}].no_hp`}
                  value={value?.no_hp}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  fluid
                  type="text"
                />
              </section>

              <section className="col-span-3 lg:col-span-1">
                <Form.Field
                  control={Input}
                  label="Alamat"
                  placeholder="Ketikan Alamat Santri"
                  name={`data[${index}].alamat`}
                  value={value?.alamat}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  fluid
                  type="text"
                />
              </section>
              <section className="col-span-3 lg:col-span-1">
                <Form.Field
                  control={Input}
                  label="provinsi"
                  placeholder="Ketikan provinsi Santri"
                  name={`data[${index}].provinsi`}
                  value={value?.provinsi}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  fluid
                  type="text"
                />
              </section>
              <section className="col-span-3 lg:col-span-1">
                <Form.Field
                  control={Input}
                  label="kota"
                  placeholder="Ketikan kota Santri"
                  name={`data[${index}].kota`}
                  value={value?.kota}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  fluid
                  type="text"
                />
              </section>
              <section className="col-span-3 lg:col-span-1">
                <Form.Field
                  control={Input}
                  label="kecamatan"
                  placeholder="Ketikan kecamatan Santri"
                  name={`data[${index}].kecamatan`}
                  value={value?.kecamatan}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  fluid
                  type="text"
                />
              </section>
              <section className="col-span-3 lg:col-span-1">
                <Form.Field
                  control={Input}
                  label="desa"
                  placeholder="Ketikan desa Santri"
                  name={`data[${index}].desa`}
                  value={value?.desa}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  fluid
                  type="text"
                />
              </section>
              <section className="col-span-3 lg:col-span-1">
                <Form.Field
                  control={Input}
                  label="rt"
                  placeholder="Ketikan rt Santri"
                  name={`data[${index}].rt`}
                  value={value?.rt}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  fluid
                  type="text"
                />
              </section>
              <section className="col-span-3 lg:col-span-1">
                <Form.Field
                  control={Input}
                  label="rw"
                  placeholder="Ketikan rw Santri"
                  name={`data[${index}].rw`}
                  value={value?.rw}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  fluid
                  type="text"
                />
              </section>
              <section className="col-span-3 lg:col-span-1">
                <Form.Field
                  control={Input}
                  label="Penangung Jawab Perusahaan"
                  placeholder="Ketikan Penangung Jawab Perusahaan"
                  name={`data[${index}].penanggung_jawab_perusahaan`}
                  value={value?.penanggung_jawab_perusahaan}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  fluid
                  type="text"
                />
              </section>
              <section className="col-span-3 lg:col-span-1">
                <Form.Field
                  control={Input}
                  label="kodepos"
                  placeholder="Ketikan kodepos Santri"
                  name={`data[${index}].kodepos`}
                  value={value?.kodepos}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  fluid
                  type="text"
                />
              </section>
              <section className="col-span-3 lg:col-span-1">
                <Form.Field
                  control={Select}
                  value={value?.pembimbing_id}
                  options={getOptions(dataGuru?.data, "nama_guru")}
                  label={{
                    children: "Pilih Pembimbing ",
                    htmlFor: `data[${index}]pembimbing_id`,
                    name: `data[${index}]pembimbing_id`,
                  }}
                  onChange={(event, data) => {
                    setFieldValue(`data[${index}]pembimbing_id`, data?.value);
                  }}
                  placeholder="Pilih Pembimbing"
                  search
                  searchInput={{
                    id: `data[${index}]pembimbing_id`,
                    name: `data[${index}]pembimbing_id`,
                  }}
                />
              </section>
              <section className="col-span-3 lg:col-span-1">
                <Form.Field
                  control={Input}
                  label="latitude"
                  placeholder="Ketikan latitude Santri"
                  name={`data[${index}].latitude`}
                  value={value?.latitude}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  fluid
                  type="text"
                />
              </section>
              <section className="col-span-3 lg:col-span-1">
                <Form.Field
                  control={Input}
                  label="longtitude"
                  placeholder="Ketikan longtitude Santri"
                  name={`data[${index}].longtitude`}
                  value={value?.longtitude}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  fluid
                  type="text"
                />
              </section>
            </div>
          ))}
          <Segment basic textAlign="center">
            {mode === "add" && (
              <Button
                basic
                fluid
                type="button"
                onClick={() => {
                  setFieldValue("data", [
                    ...values.data,
                    {
                      student_id: "",
                      // nama_siswa: "",
                      nama_perusahaan: "",
                      // guru_id: "",
                      // nama_guru: "",

                      pembimbing_id: "",
                      // nama_pembimbing: "",
                      penanggung_jawab_perusahaan: "",
                      alamat: "",
                      provinsi: "",
                      kota: "",
                      kecamatan: "",
                      desa: "",
                      rt: "",
                      rw: "",
                      kodepos: "",
                      no_hp: "",
                      longtitude: "",
                      latitude: "",
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

          <div className="grid grid-cols-3 gap-5">
            <div className="col-span-3 col-start-1 grid grid-cols-2 gap-x-5 lg:col-start-3">
              <Button
                content={"Batal"}
                type="button"
                fluid
                icon={() => <Icon name="cancel" />}
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
                content={mode === "update" ? "Perbarui" : "Simpan"}
                type="submit"
                fluid
                icon={() => <Icon name="save" />}
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
