import React from "react";
import { useNavigate } from "react-router-dom";
import LayoutPage from "../../../module/layoutPage";
import { Table, Button, Form, Select, Segment } from "semantic-ui-react";
import { useQuery } from "react-query";
import { TableLoading } from "../../../components";

import {
  listGuruPiketToday,
  listLaporanGuruPiket,
} from "../../../api/guru/laporan";

import { formatDate, formatHari, formatTahun } from "../../../utils";
import useList from "../../../hook/useList";

export default function ListGuruPiketToday() {
  const navigate = useNavigate();
  let date = new Date();

  let [hari, setHari] = React.useState(formatHari(new Date()));
  const parameter = {
    ...(hari !== "semua" && {
      hari,
    }),
  };

  let { data, isLoading } = useQuery(
    //query key
    ["list_guru_piket", parameter],
    //axios function,triggered when page/pageSize change
    () => listGuruPiketToday(parameter),
    //configuration
    {
      refetchInterval: 1000 * 60 * 60,
      select: (response) => {
        return response.data;
      },
    }
  );

  const { identitas } = useList();

  let [page, setPage] = React.useState(1);
  let [pageSize, setPageSize] = React.useState(10);
  let [status, setStatus] = React.useState(0);

  let params = {
    page,
    pageSize,
    status,
  };
  let { data: listLaporan, isLoading: isLoadingListLaporan } = useQuery(
    //query key
    ["list_laporan_guru_piket", params],
    //axios function,triggered when page/pageSize change
    () => listLaporanGuruPiket(params),
    //configuration
    {
      refetchInterval: 1000 * 60 * 60,
      select: (response) => {
        return response.data;
      },
    }
  );
  const dayOptions = [
    { key: "1", value: "semua", text: "Semua" },
    { key: "2", value: "senin", text: "Senin" },
    { key: "3", value: "selasa", text: "Selasa" },
    { key: "4", value: "rabu", text: "Rabu" },
    { key: "5", value: "kamis", text: "Kamis" },
    { key: "6", value: "jumat", text: "Jumat" },
    { key: "7", value: "sabtu", text: "Sabtu" },
    { key: "8", value: "minggu", text: "Minggu" },
  ];

  return (
    <LayoutPage title="Jadwal Guru Piket">
      <div>
        <Form>
          <Form.Field
            control={Select}
            options={dayOptions}
            label={{
              children: "Hari",
              htmlFor: "hari",
              name: "hari",
            }}
            me="hari"
            id="hari"
            onChange={(event, data) => {
              setHari(data.value);
            }}
            value={hari}
            placeholder="Pilih Hari"
            search
            searchInput={{ id: "hari", name: "hari" }}
          />
        </Form>
      </div>
      <Segment style={{ overflow: "auto", maxWidth: "100%" }} padded>
        <Table celled selectable>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell>No</Table.HeaderCell>
              <Table.HeaderCell>Hari</Table.HeaderCell>

              <Table.HeaderCell>Nama Guru</Table.HeaderCell>

              <Table.HeaderCell>Tahun Ajaran</Table.HeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            <TableLoading
              count={8}
              isLoading={isLoading}
              data={data?.data?.rows}
              messageEmpty={"Tidak Ada Jadwal Pelajaran"}
            >
              {data?.data?.rows?.map((value, index) => (
                <Table.Row key={index}>
                  <Table.Cell>{index + 1}</Table.Cell>
                  <Table.Cell>
                    <span className="capitalize">{value?.hari}</span>
                  </Table.Cell>
                  <Table.Cell>{value?.guru?.nama_guru}</Table.Cell>
                  <Table.Cell>
                    {value?.tahun_ajaran?.nama_tahun_ajaran}
                  </Table.Cell>
                </Table.Row>
              ))}
            </TableLoading>
          </Table.Body>
        </Table>
      </Segment>

      <Segment>
        <div className="flex items-center justify-between ">
          <div>
            <h3 className="text-2xl font-poppins">
              {status === 0
                ? "List Guru Piket Belum"
                : "List Laporan Guru Piket"}
            </h3>
          </div>
          <div className="flex items-center space-x-2">
            <input
              checked={status === 0}
              onChange={() => {
                if (status === 0) {
                  setStatus(1);
                }
                if (status === 1) {
                  setStatus(0);
                }
              }}
              type={"checkbox"}
            />
            <label>Belum Laporan</label>
          </div>
        </div>
        <Table celled selectable>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell>No</Table.HeaderCell>
              <Table.HeaderCell>Tanggal</Table.HeaderCell>
              <Table.HeaderCell>Nama Guru</Table.HeaderCell>
              <Table.HeaderCell>Tahun Pelajaran</Table.HeaderCell>

              <Table.HeaderCell>Aksi</Table.HeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            <TableLoading
              count={8}
              isLoading={isLoadingListLaporan}
              data={listLaporan?.data}
              messageEmpty={
                status === 0
                  ? "Tidak Ada Guru Piket yang belum buat Laporan"
                  : "Belum ada laporan piket yang masuk"
              }
            >
              {listLaporan?.data?.map((value, index) => (
                <Table.Row key={index}>
                  <Table.Cell>{index + 1}</Table.Cell>
                  <Table.Cell>{formatDate(value?.tanggal)}</Table.Cell>
                  <Table.Cell>{value?.guru?.nama_guru}</Table.Cell>
                  <Table.Cell>
                    {value?.tahun_ajaran?.nama_tahun_ajaran}
                  </Table.Cell>

                  <Table.Cell>
                    {status === 1 ? (
                      <Button
                        content={"Lihat Laporan"}
                        type="button"
                        fluid
                        disabled={value?.teacher_id !== identitas?.teacher_id}
                        size="medium"
                        color="blue"
                        onClick={() => {
                          return navigate(
                            `/guru/laporan-guru-piket/lihat-laporan/${
                              value.id
                            }/${formatTahun(date)}`
                          );
                        }}
                      />
                    ) : (
                      <Button
                        content={"Buat Laporan"}
                        type="button"
                        fluid
                        disabled={value?.teacher_id !== identitas?.teacher_id}
                        size="medium"
                        color="green"
                        onClick={() => {
                          return navigate(
                            `/guru/laporan-guru-piket/buat-laporan/${
                              value.id
                            }/${formatTahun(date)}`
                          );
                        }}
                      />
                    )}
                  </Table.Cell>
                </Table.Row>
              ))}
            </TableLoading>
          </Table.Body>
        </Table>
      </Segment>
    </LayoutPage>
  );
}
