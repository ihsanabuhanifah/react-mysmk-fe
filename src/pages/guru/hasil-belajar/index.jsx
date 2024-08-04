import LayoutPage from "../../../module/layoutPage";
import React, { useState } from "react";
import {
  Button,
  Dropdown,
  Form,
  Icon,
  Input,
  Select,
  Table,
} from "semantic-ui-react";
import { FormLabel, ReactSelectAsync, TableLoading } from "../../../components";
import { LabelKeterangan, LabelStatus } from "../../../components/Label";

import { formatWaktu } from "../../../utils/waktu";

import Checkbox from "../../../components/Checkbox";

import { TableWrapper } from "../../../components/TableWrap";
import { waktuOptions } from "../../../utils/options";
import { getOptions } from "../../../utils/format";
import useList from "../../../hook/useList";
import { listSiswaOptions } from "../../../api/list";
import { useListReport } from "../../../api/guru/report";

export default function HasilBelajar() {
  const { dataKelas, dataMapel, dataTa } = useList();
  const { data, isFetching, payload, handlePayload } = useListReport();

 
  

  console.log("data report", data);
  return (
    <LayoutPage title={"Hasil Belajar"}>
      {JSON.stringify(payload)}
      <Form>
        <section className=" grid grid-cols-4 gap-5 mb-5">
          <div className="text-left">
            <Form.Field
              control={Select}
              //   value={payload?.nama_kelas}
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
              value={payload?.nama_mapel}
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
          <div className="">
            <Form.Field
              control={Select}
              // value={absen?.nama_guru}
              options={getOptions(dataTa?.data, "nama_tahun_ajaran")}
              label={{
                children: "Tahun Pelajaran",
                //   htmlFor: `laporan.guru.absen[${index}]nama_guru`,
                //   name: `laporan.guru.absen[${index}]nama_guru`,
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

          <div className=" col-span-1 block lg:flex items-center justify-center pt-0 lg:pt-4"></div>
        </section>
      </Form>
      <TableWrapper>
        <Table>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell></Table.HeaderCell>

              <Table.HeaderCell>No</Table.HeaderCell>
              <Table.HeaderCell>Mata Pelajaran</Table.HeaderCell>
              <Table.HeaderCell>Semester</Table.HeaderCell>

              <Table.HeaderCell>Jam Mulai</Table.HeaderCell>
              <Table.HeaderCell>Jam Selesai</Table.HeaderCell>
              <Table.HeaderCell>Status</Table.HeaderCell>
              <Table.HeaderCell>Nilai Ujian</Table.HeaderCell>

              <Table.HeaderCell>Nilai Akhir</Table.HeaderCell>
              <Table.HeaderCell>Keterangan</Table.HeaderCell>
              <Table.HeaderCell>Penilaian</Table.HeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            <TableLoading
              count={12}
              isLoading={false}
              data={0}
              messageEmpty={"Tidak Terdapat Ujian pada id yang dipilih"}
            ></TableLoading>
          </Table.Body>
        </Table>
      </TableWrapper>
    </LayoutPage>
  );
}
