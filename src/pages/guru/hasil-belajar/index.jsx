import LayoutPage from "../../../module/layoutPage";
import React from "react";
import { Button, Form, Select, Table } from "semantic-ui-react";
import { FormLabel, ReactSelectAsync, TableLoading } from "../../../components";
import { TableWrapper } from "../../../components/TableWrap";
import { getOptions } from "../../../utils/format";
import useList from "../../../hook/useList";
import { listSiswaOptions } from "../../../api/list";
import { useGenerateReport, useListReport } from "../../../api/guru/report";

export default function HasilBelajar() {
  const { dataKelas, dataMapel, dataTa } = useList();
  const { data, isFetching, payload, handlePayload, handleParams } =
    useListReport();

  const mutate = useGenerateReport();
  return (
    <LayoutPage title={"Hasil Belajar"}>
      <Form>
        <section className=" grid grid-cols-4 gap-5 mb-5">
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
          <div className="">
            <Form.Field
              control={Select}
              value={payload?.ta_id}
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

          <div className="col-start-3">
            <Button
              color="blue"
              loading={isFetching}
              disabled={isFetching}
              onClick={handleParams}
              content="Filter"
            />
          </div>
          <div>
            <Button
              color="teal"
              loading={mutate.isLoading}
              disabled={
                mutate.isLoading ||
                (!!payload.kelas_id === false &&
                  !!payload.mapel_id === false &&
                  !!payload.ta_id === false)
              }
              onClick={() => {
                mutate.mutate(payload);
              }}
              content="Generate Hasil Akhir"
            />
          </div>
        </section>
      </Form>
      <TableWrapper>
        <Table>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell rowSpan={2}>No</Table.HeaderCell>
              <Table.HeaderCell rowSpan={2}>Nama Siswa</Table.HeaderCell>
              <Table.HeaderCell rowSpan={2}> Mata Pelajaran</Table.HeaderCell>
              <Table.HeaderCell rowSpan={2}>Guru</Table.HeaderCell>
              <Table.HeaderCell rowSpan={2}>Kelas</Table.HeaderCell>
              <Table.HeaderCell rowSpan={2}>Tahun Ajaran</Table.HeaderCell>
              <Table.HeaderCell textAlign="center" colSpan={7}>
                Nilai Rata-rata
              </Table.HeaderCell>

              <Table.HeaderCell rowSpan={2}>Nilai Akhir</Table.HeaderCell>
              <Table.HeaderCell rowSpan={2}>Deskripsi</Table.HeaderCell>
            </Table.Row>
            <Table.Row>
              <Table.HeaderCell>Harian</Table.HeaderCell>
              <Table.HeaderCell>Tugas</Table.HeaderCell>
              <Table.HeaderCell>Projek</Table.HeaderCell>

              <Table.HeaderCell>PTS</Table.HeaderCell>
              <Table.HeaderCell>PAS</Table.HeaderCell>
              <Table.HeaderCell>US</Table.HeaderCell>
              <Table.HeaderCell>Kehadiran</Table.HeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            <TableLoading
              count={20}
              isLoading={isFetching}
              data={data?.data}
              messageEmpty={"Tidak Terdapat Hasil Ujian"}
            >
              {data &&
                data?.data?.map((value, index) => (
                  <Table.Row key={index}>
                    <Table.Cell>{index + 1}</Table.Cell>
                    <Table.Cell>{value.siswa?.nama_siswa}</Table.Cell>
                    <Table.Cell>{value?.mapel?.nama_mapel}</Table.Cell>
                    <Table.Cell>{value?.teacher?.nama_guru}</Table.Cell>
                    <Table.Cell>{value?.kelas?.nama_kelas}</Table.Cell>
                    <Table.Cell>
                      {value?.tahun_ajaran?.nama_tahun_ajaran}
                    </Table.Cell>
                    <Table.Cell>{value?.rata_nilai_harian || "-"}</Table.Cell>
                    <Table.Cell>{value?.rata_nilai_tugas || "-"}</Table.Cell>
                    <Table.Cell>{value?.rata_nilai_projek || "-"}</Table.Cell>

                    <Table.Cell>{value?.rata_nilai_pts || "-"}</Table.Cell>
                    <Table.Cell>{value?.rata_nilai_pas || "-"}</Table.Cell>
                    <Table.Cell>{value?.rata_nilai_us || "-"}</Table.Cell>
                    <Table.Cell>
                      {value?.rata_nilai_kehadiran || "-"}
                    </Table.Cell>
                    <Table.Cell>{value?.nilai || "-"}</Table.Cell>
                    <Table.Cell>{value?.deskripsi || "-"}</Table.Cell>
                  </Table.Row>
                ))}
            </TableLoading>
          </Table.Body>
        </Table>
      </TableWrapper>
    </LayoutPage>
  );
}
