import React, { useState } from "react";
import { Table, Button, Icon, Menu, Sidebar } from "semantic-ui-react";
import { useParams } from "react-router-dom";
import { usePelanggaranSiswa } from "../profile";
import LoadingPage from "../../../../../components/LoadingPage";
import { PaginationTable, TableLoading } from "../../../../../components";
import Filter from "./filter";

const PelanggaranComponent = () => {
  const { id } = useParams();
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [visible, setVisible] = useState(false);

  // State dan fungsi untuk mengelola filter
  const {
    data: pelanggaranData,
    isFetching,
    error,
    payload,
    handlePayload,
    handleParams,
    setParams,
    params,
    dataPelanggaran,
    dataTa,
  } = usePelanggaranSiswa(id);

  if (isFetching) {
    return <LoadingPage />;
  }

  if (error) {
    return <div>Error mengambil data pelanggaran</div>;
  }

  const totalCount = pelanggaranData?.totalCount || 0;
  
  console.log(pelanggaranData);

  return (
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
          dataPg={dataPelanggaran}
          dataTa={dataTa}
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

      <Table celled selectable>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell>No</Table.HeaderCell>
            <Table.HeaderCell>Tanggal</Table.HeaderCell>
            <Table.HeaderCell>Nama Siswa</Table.HeaderCell>
            <Table.HeaderCell>Pelanggaran</Table.HeaderCell>
            <Table.HeaderCell>Semester</Table.HeaderCell>
            <Table.HeaderCell>Tahun Ajaran</Table.HeaderCell>
            <Table.HeaderCell>Tindakan Sekolah</Table.HeaderCell>
            <Table.HeaderCell>Tipe Pelanggaran</Table.HeaderCell>
            <Table.HeaderCell>Kategori Pelanggaran</Table.HeaderCell>
            <Table.HeaderCell>Poin Pelanggaran</Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          <TableLoading
            count={10}
            isLoading={isFetching}
            data={pelanggaranData?.data?.rows}
            messageEmpty="Tidak ada data pelanggaran"
          >
            {pelanggaranData?.data?.rows?.map((pelanggaran, i) => (
              <Table.Row key={pelanggaran.id}>
                <Table.Cell>{i + 1}</Table.Cell>
                <Table.Cell>{pelanggaran.tanggal || "-"}</Table.Cell>
                <Table.Cell>{pelanggaran.siswa.nama_siswa}</Table.Cell>
                <Table.Cell>{pelanggaran.pelanggaran.nama_pelanggaran}</Table.Cell>
                <Table.Cell>{pelanggaran.semester}</Table.Cell>
                <Table.Cell>{pelanggaran.tahun_ajaran.nama_tahun_ajaran}</Table.Cell>
                <Table.Cell>{pelanggaran.tindakan || "-"}</Table.Cell>
                <Table.Cell>{pelanggaran.pelanggaran.tipe}</Table.Cell>
                <Table.Cell>{pelanggaran.pelanggaran.kategori}</Table.Cell>
                <Table.Cell>{pelanggaran.pelanggaran.point}</Table.Cell>
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
        totalPages={pelanggaranData.data.count}
      />
    </div>
  );
};

export default PelanggaranComponent;
