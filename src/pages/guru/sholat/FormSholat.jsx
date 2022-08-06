import { listSiswaOptions, listTahunAjaran } from "../../../api/list";

import { useQuery } from "react-query";
import {
  waktusholatOptions,
  alasanTidakSholatOptions,
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
  Icon
} from "semantic-ui-react";
import { DeleteButton } from "../../../components";
import { ReactSelectAsync, FormLabel } from "../../../components";
import dayjs from "dayjs";

export default function FormSholat({
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

  console.log(values);

  return (
    <Segment>
      <div className="p-0 lg:p-5">
        <Header>Form Pencatatan Sholat</Header>
        <Divider></Divider>
        <Form onSubmit={handleSubmit}>
          {values?.sholat?.map((value, index) => (
            <div
              key={index}
              className="grid grid-cols-1 lg:grid-cols-3 gap-2 border p-5 mt-3 shadow-md"
            >
              <div className="col-span-3 flex justify-end ">
                <DeleteButton
                  disabled={values.sholat.length <= 1}
                  onClick={() => {
                    let filtered = values.sholat.filter((i, itemIndex) => {
                      return itemIndex != index;
                    });

                    setFieldValue("sholat", filtered);
                  }}
                  size="small"
                />
              </div>
              <div className="col-span-3 lg:col-span-1">
             <Form.Field
                control={Input}
                label="Tanggal"
                placeholder="Tanggal"
                name={`sholat[${index}]tanggal`}
                onChange={handleChange}
                onBlur={handleBlur}
                value={dayjs(value?.tanggal).format("YYYY-MM-DD")}
                disabled={isSubmitting}
                fluid
                error={
                  errors.sholat?.[index]?.tanggal &&
                  touched.sholat?.[index]?.tanggal && {
                    content: `${errors?.sholat?.[index]?.tanggal}`,
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
                    errors?.sholat?.[index]?.student_id &&
                    touched?.sholat?.[index]?.student_id
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
                      setFieldValue(`sholat[${index}]nama_siswa`, data);
                      setFieldValue(`sholat[${index}]student_id`, data.value);
                    }}
                    error={
                      errors?.sholat?.[index]?.student_id &&
                      touched?.sholat?.[index]?.student_id
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
                  options={waktusholatOptions}
                  label={{
                    children: "Waktu",
                    htmlFor: `sholat[${index}]waktu`,
                    name: `sholat[${index}]waktu`,
                  }}
                  onChange={(event, data) => {
                    setFieldValue(`sholat[${index}]waktu`, data.value);
                  }}
                  onBlur={handleBlur}
                  value={value?.waktu}
                  placeholder="Pilih Waktu"
                  error={
                    errors?.sholat?.[index]?.waktu &&
                    touched?.sholat?.[index]?.waktu && {
                      content: `${errors?.sholat?.[index]?.waktu}`,
                      pointing: "above",
                    }
                  }
                  disabled={isSubmitting}
                  search
                  searchInput={{
                    id: `sholat[${index}]waktu`,
                    name: `sholat[${index}]waktu`,
                  }}
                />
              </div>

              <div className="col-span-3 lg:col-span-1">
                <Form.Field
                  control={Select}
                  options={alasanTidakSholatOptions}
                  label={{
                    children: "Jenis Pelanggaran",
                    htmlFor: `sholat[${index}]keterangan`,
                    name: `sholat[${index}]keterangan`,
                  }}
                  onChange={(event, data) => {
                    setFieldValue(`sholat[${index}]keterangan`, data.value);
                  }}
                  onBlur={handleBlur}
                  value={value?.keterangan}
                  placeholder="Pilih Katerangan"
                  error={
                    errors?.sholat?.[index]?.keterangan &&
                    touched?.sholat?.[index]?.keterangan && {
                      content: `${errors?.sholat?.[index]?.keterangan}`,
                      pointing: "above",
                    }
                  }
                  disabled={isSubmitting}
                  search
                  searchInput={{
                    id: `sholat[${index}]keterangan`,
                    name: `sholat[${index}]keterangan`,
                  }}
                />
              </div>

              <div className="col-span-3 col-start-1">
                <Form.Field
                  control={TextArea}
                  label="Alasan"
                  placeholder="Alasan"
                  name={`sholat[${index}]alasan`}
                  value={value?.alasan}
                  onChange={handleChange}
                  fluid
                  type="text"
                  disabled={isSubmitting}
                  error={
                    errors?.alasan?.[index]?.alasan &&
                    touched?.alasan?.[index]?.alasan && {
                      content: `${errors?.alasan?.[index]?.alasan}`,
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
                  setFieldValue("sholat", [
                    ...values.sholat,
                    {
                      tanggal: "",
                      student_id: "",
                      waktu: "",
                      alasan: "",
                      keterangan: "",
                    },
                  ]);
                }}
                
                color="teal"
                content="Tambah"
                
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
                icon={()=> <Icon name='cancel'/>}
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
                icon={()=> <Icon name='save'/>}
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
