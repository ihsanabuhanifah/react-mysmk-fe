import React, { useState } from "react";
import { Button, Icon, Label, Table } from "semantic-ui-react";
import {
  usePenilaian,
  useRefreshCount,
  useRemidial,
  useSoal,
} from "../../../api/guru/ujian";
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
import ModalPenilaian from "./ModalPenilaian";

function PenilaianPage() {
  const { id, mapel } = useParams();
  const { isLoading, data } = usePenilaian({
    ujian_id: id,
  });

  const [open, setOpen] = useState(false);
  const [jawaban, setJawaban] = useState([]);
  const [item, setItem] = useState({});

  const { isLoading: isLoadingSoal, data: dataSoal } = useSoal(id);

  const mutate = useRemidial();
  const refresh = useRefreshCount();
  const { handleCheck, isChecked, payload, setPayload } = useCheckbox();

  console.log("pau", payload);

  return (
    <LayoutPage title={"Penilaian"}>
      {open && (
        <ModalPenilaian
        item={item}
        setItem={setItem}
          open={open}
          setOpen={setOpen}
          soal={dataSoal?.soal}
          jawaban={jawaban}
        />
      )}
      <section
        style={{
          zoom: "80%",
        }}
        className="grid grid-cols-4 gap-5 mb-5"
      >
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

        <Button
          content={"Izinkan Ujian Kembali"}
          type="button"
          fluid
          loading={refresh.isLoading}
          disabled={refresh.isLoading || payload.length === 0}
          icon={() => <Icon name="filter" />}
          size="medium"
          color="teal"
          onClick={() => {
            refresh.mutate(payload, {
              onSuccess: () => {
                setPayload([]);
              },
            });
          }}
        />
      </section>
      <section
        style={{
          zoom: "80%",
        }}
      >
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
                <Table.HeaderCell>Penilaian</Table.HeaderCell>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              <TableLoading
                count={8}
                isLoading={isLoading}
                data={data?.data}
                messageEmpty={"Tidak Terdapat Ujian pada id yang dipilih"}
              >
                {data?.data?.map((item, index) => (
                  <Table.Row key={index}>
                    <Table.Cell>
                      <Checkbox
                        disabled={
                          item.status === "open" ||
                          (item.status === "progress" && item.refresh_count > 0)
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
                    <Table.Cell>
                      <button
                        onClick={() => {
                          setOpen(true);

                          console.log("item", item);
                          setItem(item);
                          setJawaban(() => {
                            if (!!item.jawaban === false) {
                              return [];
                            }
                            return JSON.parse(item.jawaban);
                          });
                        }}
                      >
                        Lihat
                      </button>
                    </Table.Cell>
                  </Table.Row>
                ))}
              </TableLoading>
            </Table.Body>
          </Table>
        </TableWrapper>
      </section>
    </LayoutPage>
  );
}

export default PenilaianPage;
