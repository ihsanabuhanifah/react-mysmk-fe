import React from "react";
import { Table, Button, Icon } from "semantic-ui-react";
import { formatTanggalIndo } from "../../../utils/formatTanggal";
import { useNavigate } from "react-router-dom";
import dayjs from "dayjs";

const TableLaporan = ({ data }) => {
  const navigate = useNavigate();
  const today = dayjs().format("YYYY-MM-DD");

  return (
    <Table celled compact="very" className="no-gap-table" style={{ borderSpacing: 0 }}>
      <Table.Header>
        <Table.Row>
          <Table.HeaderCell>Judul Kegiatan</Table.HeaderCell>
          <Table.HeaderCell>Tanggal</Table.HeaderCell>
          <Table.HeaderCell>Status</Table.HeaderCell>
          <Table.HeaderCell>Aksi</Table.HeaderCell>
        </Table.Row>
      </Table.Header>
      <Table.Body>
        {data.map((item, index) => {
          const isSameDay = item.tanggal === today;
          return (
            <Table.Row key={index}>
              <Table.Cell>{item.judul_kegiatan}</Table.Cell>
              <Table.Cell>{formatTanggalIndo(item.tanggal)}</Table.Cell>
              <Table.Cell style={{ color: item.status === "hadir" ? "green" : "red", fontWeight: "bold" }}>
                {item.status}
              </Table.Cell>
              <Table.Cell>
                <Button color="blue" size="small" disabled={!isSameDay} onClick={() => navigate(`/siswa/laporan-pkl/laporan-diniyyah/${item.id}`)}>
                  Diniyyah
                </Button>
                <Button color="green" icon size="small" disabled={!isSameDay} onClick={() => navigate(`/siswa/laporan-pkl/update/${item.id}`)}>
                  <Icon name="edit" />
                </Button>
                <Button color="teal" icon size="small" onClick={() => navigate(`/siswa/laporan-pkl/detail/${item.id}`)}>
                  <Icon name="info circle" />
                </Button>
              </Table.Cell>
            </Table.Row>
          );
        })}
      </Table.Body>
    </Table>
  );
};

export default TableLaporan;
