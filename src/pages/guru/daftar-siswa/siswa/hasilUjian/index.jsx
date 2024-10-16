/* eslint-disable no-useless-escape */
import React, { useState } from "react";
import { Button, Icon, Loader, Menu, Sidebar, Table } from "semantic-ui-react";
import { useListHasilUjian } from "../profile";
import { useParams } from "react-router-dom";
import { TableLoading, PaginationTable } from "../../../../../components";
import { LabelStatus, LabelTipeUjian } from "../../../../../components/Label";
import Filter from "./filter";

export default function HasilUjian() {
  const { id } = useParams();
  const { data, isFetching, params, setParams, payload, handlePayload, handleParams, dataTa, dataMapel, dataJenis } = useListHasilUjian(id);
  const [visible, setVisible] = useState(false);


  console.log(data);
  console.log(useListHasilUjian);
  console.log(dataJenis);
  return (
    <div>
      {isFetching ? (
        <div className="ml-5 mt-[30px]">
          <Loader active inline="left" />
        </div>
      ) : (
        <div>
          <Sidebar
            as={Menu}
            animation="overlay"
            icon="labeled"
            inverted
            direction="right"
            onHide={() => setVisible(false)}
            vertical
            visible={visible}
            width="wide"
          >
            <Filter
              payload={payload}
              handlePayload={handlePayload}
              setVisible={setVisible}
              onClick={handleParams} // Fungsi untuk menerapkan filter
              setParams={setParams}
              params={params}
              dataMapel={dataMapel}
              dataTa={dataTa}
              dataJenis={data}
            />
          </Sidebar>

          <Button
            content={"Filter"}
            type="button"
            icon={() => <Icon name="filter" />}
            size="medium"
            color="teal"
            onClick={() => setVisible(true)}
          />
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
              totalPages={data?.count}
            />
            <p className="text-red-400">
              *Nilai Akhir diberikan oleh guru mapel
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
