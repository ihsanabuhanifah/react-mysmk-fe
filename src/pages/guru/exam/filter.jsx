import { Input, Select, Form, Button, Icon } from "semantic-ui-react";
import { Formik } from "formik";
import { getOptions, getOptionsText } from "../../../utils/format";
import { ReactSelectAsync, FormLabel } from "../../../components";
import { listSiswaOptions } from "../../../api/list";

import useList from "../../../hook/useList";
import { jenisOptions } from "../../../utils/options";

export default function Filter({
  payload,
  handlePayload,
  onClick,
  setVisible,
}) {
  const { dataKelas, dataMapel, dataTa, dataGuru } = useList();

  return (
    <section className="relative h-screen space-y-5 border bg-gray-50 p-5 shadow-2xl">
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
            <Form.Dropdown
              selection
              search
              label={{
                children: "Jenis Assesmen",
              }}
              placeholder="Pilih"
              options={jenisOptions}
              onChange={(e, data) => {
                handlePayload("jenis_ujian", data?.value);
              }}
              value={payload?.jenis_ujian}
            />
          </div>
          <div className="text-left">
            <Form.Field
              control={Select}
              value={payload?.teacher_id}
              options={getOptions(dataGuru?.data, "nama_guru")}
              label={{
                children: "Nama Guru",
              }}
              onChange={(event, data) => {
                console.log("data", data);
                handlePayload("teacher_id", data?.value);
              }}
              placeholder="Pilih"
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
              value={payload?.kelas_id}
              options={getOptions(dataKelas?.data, "nama_kelas")}
              label={{
                children: "Kelas",
              }}
              onChange={(event, data) => {
                console.log("data", data);
                handlePayload("kelas_id", data?.value);
              }}
              placeholder="Pilih"
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
              placeholder="Pilih"
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
              placeholder="Pilih"
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
        </section>
      </Form>

      <div className="absolute bottom-2 left-2 right-2 space-y-2 xl:bottom-12">
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
