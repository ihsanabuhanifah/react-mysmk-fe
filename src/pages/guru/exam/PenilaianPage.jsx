import React, { useState } from "react";
import { Button, Icon, Label, Table } from "semantic-ui-react";
import { usePenilaian, useRemidial } from "../../../api/guru/ujian";
import { TableLoading } from "../../../components";
import LayoutPage from "../../../module/layoutPage";
import { useParams } from "react-router-dom";
import { LabelStatus, LabelTipeUjian } from "../../../components/Label";
import { showFormattedDate } from "../../../utils";
import { formatWaktu } from "../../../utils/waktu";
import DataTable from "react-data-table-component";
import useCheckbox from "../../../hook/useCheckbox";
import Checkbox from "../../../components/Checkbox";

import { TableWrapper } from "../../../components/TableWrap";

function PenilaianPage() {
  const { id, mapel } = useParams();
  const { isLoading, data } = usePenilaian({
    ujian_id: id,
  });

  const mutate = useRemidial();
  const { handleCheck, isChecked, payload, setPayload } = useCheckbox();

  console.log("pau", payload);

  return (
    <LayoutPage title={"Penilaian"}>
      <section className="grid grid-cols-4 gap-5 mb-5">
        <Button
          content={"Remidial"}
          type="button"
          fluid
          loading={mutate.isLoading}
          disabled={mutate.isLoading || payload.length === 0}
          icon={() => <Icon name="filter" />}
          size="medium"
          color="teal"
          onClick={() => {
            mutate.mutate(payload, {
              onSuccess: () => {
                setPayload([]);
              },
            });
          }}
        />
      </section>

      <TableWrapper>
        <Table>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell></Table.HeaderCell>

              <Table.HeaderCell>No</Table.HeaderCell>
              <Table.HeaderCell>Nama Siswa</Table.HeaderCell>
              <Table.HeaderCell>Mata Pelajaran</Table.HeaderCell>

              <Table.HeaderCell>Jam Mulai</Table.HeaderCell>
              <Table.HeaderCell>Jam Selesai</Table.HeaderCell>
              <Table.HeaderCell>Status</Table.HeaderCell>
              <Table.HeaderCell>Nilai Ujian</Table.HeaderCell>
            
              <Table.HeaderCell>Nilai Akhir</Table.HeaderCell>
              <Table.HeaderCell>Keterangan</Table.HeaderCell>
              <Table.HeaderCell>Nilai Essay</Table.HeaderCell>
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
                  <Table.Cell>
                    <Checkbox
                      disabled={
                        item.status === "open" || item.status === "progress"
                      }
                      checked={isChecked(item.id)}
                      onChange={(e) => {
                        handleCheck(e, item.id);
                      }}
                    />
                  </Table.Cell>
                  <Table.Cell>{index + 1}</Table.Cell>
                  <Table.Cell>{item.siswa.nama_siswa}</Table.Cell>
                  <Table.Cell>{mapel}</Table.Cell>

                  <Table.Cell>{formatWaktu(item.jam_mulai)}</Table.Cell>
                  <Table.Cell>{formatWaktu(item.jam_submit)}</Table.Cell>
                  <Table.Cell>
                    <LabelStatus status={item.status} />
                  </Table.Cell>
                  <Table.Cell>{item.exam || "-"}</Table.Cell>
                  
                  <Table.Cell>{item.exam_result || "-"}</Table.Cell>
                  <Table.Cell>
                    <span className="text-xs"> {item.keterangan || "-"}</span>
                  </Table.Cell>
                  <Table.Cell>essay</Table.Cell>
                </Table.Row>
              ))}
            </TableLoading>
          </Table.Body>
        </Table>
      </TableWrapper>
    </LayoutPage>
  );
}

export default PenilaianPage;
