import { Input, Select, Form, Button, Icon } from "semantic-ui-react";
import { Formik } from "formik";
import { getOptions, getOptionsText } from "../../../utils/format";
import { ReactSelectAsync, FormLabel } from "../../../components";
import { listSiswaOptions } from "../../../api/list";

import useList from "../../../hook/useList";
import { useGenerateReport } from "../../../api/guru/report";

export default function Filter({
  payload,
  handlePayload,
  onClick,
  setVisible,
}) {
  const { dataKelas, dataMapel, dataTa } = useList();
  const mutate = useGenerateReport();
  return (
    <section className="p-5 bg-gray-50 border shadow-2xl h-screen space-y-5 relative">
      <section className="flex items-center justify-between">
      <button
        type="b"
        onClick={() => {
          setVisible(false);
        }}
        className="text-lg"
      >
        Tutup
      </button>
      </section>

      <Form>
        <section className="space-y-5">
          <div className="text-left">
            <Form.Field
              control={Select}
              value={payload?.kelas_id}
              options={getOptions(dataKelas?.data, "nama_kelas")}
              label={{
                children: "Kelas",
              }}
              onChange={(event, data) => {
                console.log("data", data);
                handlePayload("kelas_id", data?.value);
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
              value={payload?.mapel_id}
              options={getOptions(dataMapel?.data, "nama_mapel")}
              label={{
                children: "Mata Pelajaran",
              }}
              onChange={(event, data) => {
                handlePayload("mapel_id", data?.value);
              }}
              placeholder="Mata Pelajaran"
              search
              clearable
            />
          </div>
          <div className="text-left">
            <Form.Field
              control={Select}
              value={payload?.ta_id}
              options={getOptions(dataTa?.data, "nama_tahun_ajaran")}
              label={{
                children: "Tahun Pelajaran",
              }}
              onChange={(event, data) => {
                handlePayload("ta_id", data?.value);
              }}
              placeholder="Tahun Pelajaran"
              search
              // value={values?.tahun_ajaran}
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
                value={payload?.student_id}
                onChange={(data) => {
                  handlePayload("student_id", data);
                }}
                loadOptions={listSiswaOptions}
                isClearable
                placeholder="Nama Siswa"
                additional={{
                  page: 1,
                }}
              />
            </FormLabel>
          </div>
        </section>
      </Form>

      <div className="absolute bottom-2 xl:bottom-12 right-2 space-y-2 left-2">
        <Button
          color="facebook"
          fluid
          icon={() => <Icon name="filter" />}
          loading={mutate.isLoading}
          disabled={
            mutate.isLoading ||
            (!!payload.kelas_id === false &&
              !!payload.mapel_id === false &&
              !!payload.ta_id === false)
          }
          onClick={() => {
            mutate.mutate(payload, {
              onSuccess: () => {
                onClick();
              },
            });
          }}
          content="Generate Hasil Akhir"
        />

        <Button
          icon={() => <Icon name="filter" />}
          type="submit"
          content="Filter"
          fluid
          onClick={onClick}
          color="teal"
        />
      </div>
    </section>
  );
}
