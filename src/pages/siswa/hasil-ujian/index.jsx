import React from "react";
import LayoutSiswa from "../../../module/layoutSiswa";
import { Loader, Table } from "semantic-ui-react";
import { useListHasilUjian } from "../../../api/siswa/hasil_ujian";
import { PaginationTable, TableLoading } from "../../../components";
import { LabelStatus, LabelTipeUjian } from "../../../components/Label";

export default function HasilUjian() {
  const { data, isFetching, params, setParams } = useListHasilUjian();

  return (
    <LayoutSiswa title="Hasil Ujain">
      {isFetching ? (
        <div className="ml-5 mt-[30px]">
          <Loader active inline="left" />
        </div>
      ) : (
        <div className="mt-4 w-full px-5">
          <Table className="ui celled structured table">
            <Table.Header>
              <Table.HeaderCell>No</Table.HeaderCell>
              <Table.HeaderCell>Mapel</Table.HeaderCell>
              <Table.HeaderCell>Judul Ujian</Table.HeaderCell>
              <Table.HeaderCell>Kriteria</Table.HeaderCell>
              <Table.HeaderCell>Kelas</Table.HeaderCell>
              <Table.HeaderCell>Tahun Ajaran</Table.HeaderCell>
              <Table.HeaderCell>Nilai</Table.HeaderCell>
              <Table.HeaderCell>Nilai Akhir</Table.HeaderCell>
            </Table.Header>
            <Table.Body>
              <TableLoading
                count={8}
                isLoading={isFetching}
                data={data?.data}
                messageEmpty="Data tidak ditemukan"
              >
                {data?.data.map((value, i) => (
                  <Table.Row key={i}>
                    <Table.Cell>{i + 1}</Table.Cell>
                    <Table.Cell>{value.mapel.nama_mapel}</Table.Cell>
                    <Table.Cell>{value.ujian.judul_ujian}</Table.Cell>
                    <Table.Cell className="flex">
                      <LabelStatus status={value.ujian.jenis_ujian} />
                      <LabelTipeUjian status={value.ujian.tipe_ujian} />
                    </Table.Cell>
                    <Table.Cell>{value.kelas.nama_kelas}</Table.Cell>
                    <Table.Cell>
                      {value.tahun_ajaran.nama_tahun_ajaran}
                    </Table.Cell>
                    <Table.Cell>
                      {value.exam
                        .replace(/[\[\]]/g, "")
                        .replace(/,\s*/g, " - ")}
                    </Table.Cell>
                    <Table.Cell>{value.exam_result}</Table.Cell>
                  </Table.Row>
                ))}
              </TableLoading>
            </Table.Body>
          </Table>
          <PaginationTable
            page={params.page}
            pageSize={params.pageSize}
            setPageSize={(e) => {
              setParams((prev) => {
                return {
                  ...prev,
                  pageSize: e,
                };
              });
            }}
            setPage={(e) => {
              setParams((prev) => {
                return {
                  ...prev,
                  page: e,
                };
              });
            }}
            totalPages={data?.totalPage}
            count={data.count}
          />
          <p className="text-red-400">*Nilai Akhir diberikan oleh guru</p>
        </div>
      )}
    </LayoutSiswa>
  );
}
