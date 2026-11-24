import React from "react";
import { Table, Button, Label } from "semantic-ui-react";
import { formatTanggalIndo } from "../../../utils/formatTanggal";
import dayjs from "dayjs";

// onDetail(item), onEdit(item), onDiniyyah(item): membuka modal di halaman Laporan PKL
const TableLaporan = ({ data, onDetail, onEdit, onDiniyyah }) => {
  const today = dayjs().format("YYYY-MM-DD");

  return (
    <Table celled unstackable selectable>
      <Table.Header>
        <Table.Row>
          <Table.HeaderCell>Judul Kegiatan</Table.HeaderCell>
          <Table.HeaderCell>Tanggal</Table.HeaderCell>
          <Table.HeaderCell>Status</Table.HeaderCell>
          <Table.HeaderCell collapsing>Aksi</Table.HeaderCell>
        </Table.Row>
      </Table.Header>
      <Table.Body>
        {data.map((item) => {
          // edit & laporan diniyyah hanya bisa di hari yang sama
          const hariIni = item.tanggal === today;
          return (
            <Table.Row key={item.id}>
              <Table.Cell>
                <button
                  type="button"
                  className="text-left font-medium text-gray-800 hover:underline"
                  onClick={() => onDetail(item)}
                >
                  {item.judul_kegiatan}
                </button>
              </Table.Cell>
              <Table.Cell className="whitespace-nowrap">{formatTanggalIndo(item.tanggal)}</Table.Cell>
              <Table.Cell>
                <Label size="tiny" color={item.status === "hadir" ? "green" : "red"} className="capitalize">
                  {item.status}
                </Label>
              </Table.Cell>
              <Table.Cell>
                <div className="flex items-center gap-1 whitespace-nowrap">
                  <Button
                    size="tiny"
                    color="blue"
                    disabled={!hariIni}
                    title={hariIni ? "Isi laporan diniyyah" : "Hanya bisa diisi di hari yang sama"}
                    onClick={() => onDiniyyah(item)}
                    content="Diniyyah"
                  />
                  <Button
                    size="tiny"
                    icon="edit"
                    color="green"
                    disabled={!hariIni}
                    title={hariIni ? "Edit laporan" : "Hanya bisa diedit di hari yang sama"}
                    onClick={() => onEdit(item)}
                  />
                  <Button size="tiny" icon="info circle" color="teal" title="Detail" onClick={() => onDetail(item)} />
                </div>
              </Table.Cell>
            </Table.Row>
          );
        })}
      </Table.Body>
    </Table>
  );
};

export default TableLaporan;
