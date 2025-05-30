/* eslint-disable no-unused-vars */
import React from "react";
import { Button } from "../../../../components";
import { useNavigate, useParams } from 'react-router-dom'
import { TableWrapper } from "../../../../components/TableWrap";
import { Table } from "semantic-ui-react";
import { format } from 'date-fns'
import { LabelStatus } from "../../../../components/Label";
const NilaiDetailComponent = ({ nilaiDetailData, onBackClick }) => {
  const navigate = useNavigate()

  return (
    <div>
      <Button onClick={onBackClick}>Kembali</Button>

      <TableWrapper>
        <Table>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell>No</Table.HeaderCell>
              <Table.HeaderCell>Jenis</Table.HeaderCell>
              <Table.HeaderCell>Durasi</Table.HeaderCell>
              <Table.HeaderCell>Jam Mulai</Table.HeaderCell>
              <Table.HeaderCell>Jam Selesai</Table.HeaderCell>
              <Table.HeaderCell>Nilai Akhir</Table.HeaderCell>
              <Table.HeaderCell>Nilai Ujian</Table.HeaderCell>
              <Table.HeaderCell>Keterangan</Table.HeaderCell>{" "}
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {nilaiDetailData?.map((detail, index) => (
              <Table.Row key={detail.id}>
                <Table.Cell>{index + 1}</Table.Cell>
                <Table.Cell className='capitalize'><LabelStatus status={detail?.jenis_ujian}/></Table.Cell>
                <Table.Cell>{detail.ujian.durasi ?? "-"}</Table.Cell>
                <Table.Cell>
                  {format(new Date(detail.jam_mulai),'HH:mm' ?? "-")}
                </Table.Cell>
                <Table.Cell>
                  {format(new Date(detail.jam_selesai),'HH:mm' ?? "-")}
                </Table.Cell>
                <Table.Cell>{detail.exam_result ?? "-"}</Table.Cell>
                <Table.Cell>{detail.exam ? detail.exam.slice(1, -1) : "-"}</Table.Cell>
                <Table.Cell>{detail.keterangan ?? "-"}</Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table>
      </TableWrapper>
      {/* <Button onClick={onBackClick}>Kembali</Button>
      <h2>Detail Nilai</h2>
      {nilaiDetailData?.map((detail, index) => (
        <div key={index}>
          <h3>
            {detail.mapel.nama_mapel} - {detail.jenis_ujian}
          </h3>
          <p>Nilai: {detail.exam_result}</p>
          <p>Keterangan: {detail.keterangan}</p>
        </div>
      ))} */}
    </div>
  );
};

export default NilaiDetailComponent;
