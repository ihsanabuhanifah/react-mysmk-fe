import React, { useState } from "react";
import {
  ModalContent,
  ModalActions,
  Button,
  Icon,
  Modal,
  ModalHeader,
  ModalDescription,
  Table,
} from "semantic-ui-react";
import { usePenilaian } from "../../../api/guru/ujian";
import { TableLoading } from "../../../components";

function ModalPenilaian({ open, setOpen, payload }) {
  const { isLoading, data } = usePenilaian({
    ujian_id: payload.ujian_id,
  });

  console.log("data", data);
  console.log("pay", payload);
  return (
    <Modal
      onClose={() => setOpen(false)}
      onOpen={() => setOpen(true)}
      open={open}
      size="large"
      p={5}
    >
      <ModalHeader>Penilaian</ModalHeader>

      <ModalContent>
        <ModalDescription>
          <Table>
            <Table.Header>
              <Table.Row>
                <Table.HeaderCell>No</Table.HeaderCell>
                <Table.HeaderCell>Nama Siswa</Table.HeaderCell>

                <Table.HeaderCell>Mata Pelajaran</Table.HeaderCell>
                <Table.HeaderCell>Jenis Ujian</Table.HeaderCell>
                <Table.HeaderCell>Tipe Ujian</Table.HeaderCell>
                <Table.HeaderCell>Status</Table.HeaderCell>

                <Table.HeaderCell>Mata Pelajaran</Table.HeaderCell>
                <Table.HeaderCell>Jenis Ujian</Table.HeaderCell>
                <Table.HeaderCell>No</Table.HeaderCell>
                <Table.HeaderCell>Nama Siswa</Table.HeaderCell>

                <Table.HeaderCell>Mata Pelajaran</Table.HeaderCell>
                <Table.HeaderCell>Jenis Ujian</Table.HeaderCell>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              <TableLoading
                count={8}
                isLoading={isLoading}
                data={data?.data}
                messageEmpty={
                  "Tidak Terdapat Riwayat Absensi pada tanggal yang dipilih"
                }
              >
                {data?.data?.map((item, index) => (
                  <Table.Row key={index}>
                    <Table.Cell>{index + 1}</Table.Cell>
                    <Table.Cell>{item.siswa.nama_siswa}</Table.Cell>
                    <Table.Cell>{payload.mapel}</Table.Cell>
                    <Table.Cell>{item.ujian.jenis_ujian}</Table.Cell>
                    <Table.Cell>{item.status}</Table.Cell>
                    <Table.Cell>{item.siswa.nama_siswa}</Table.Cell>
                    <Table.Cell>{payload.mapel}</Table.Cell>
                    <Table.Cell>{item.ujian.jenis_ujian}</Table.Cell>
                    <Table.Cell>{index + 1}</Table.Cell>
                    <Table.Cell>{item.siswa.nama_siswa}</Table.Cell>
                    <Table.Cell>{payload.mapel}</Table.Cell>
                    <Table.Cell>{item.ujian.jenis_ujian}</Table.Cell>
                  </Table.Row>
                ))}
              </TableLoading>
            </Table.Body>
          </Table>
        </ModalDescription>
      </ModalContent>

      <ModalActions>
        <Button color="red" inverted onClick={() => setOpen(false)}>
          <Icon name="remove" /> Tutup
        </Button>
      </ModalActions>
    </Modal>
  );
}

export default ModalPenilaian;
