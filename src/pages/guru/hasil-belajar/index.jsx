import LayoutPage from "../../../module/layoutPage";
import React from "react";
import { Button, Form, Icon, Menu, Sidebar, Table } from "semantic-ui-react";
import { TableLoading } from "../../../components";
import { TableWrapper } from "../../../components/TableWrap";

import { useListReport } from "../../../api/guru/report";
import Filter from "./filter";

export default function HasilBelajar() {
  let [visible, setVisible] = React.useState(false);
  const { data, isFetching, payload, handlePayload, handleParams } =
    useListReport();

  return (
    <LayoutPage title={"Hasil Belajar"}>
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
          onClick={handleParams}
        />
      </Sidebar>
      <Form>
        <section className=" grid grid-cols-6 gap-5 mb-5">
          <div >
            <Button
              content={"Filter"}
              type="button"
              fluid
              icon={() => <Icon name="filter" />}
              size="medium"
              color="teal"
              onClick={() => {
                setVisible(true);
              }}
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
