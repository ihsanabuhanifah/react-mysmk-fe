import React from "react";
import { useNavigate } from "react-router-dom";
import LayoutPage from "../../../module/layoutPage";
import { Table, Button, Form, Select, Icon } from "semantic-ui-react";
import { useQuery } from "react-query";
import { TableLoading } from "../../../components";

import {
  listGuruPiketToday,
  listLaporanGuruPiket,
} from "../../../api/guru/laporan";

import { formatHari, formatTahun } from "../../../utils";
import useList from "../../../hook/useList";
import usePage from "../../../hook/usePage";
import {PaginationTable} from "../../../components";
import { formatDay } from "../../../utils/waktu";

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

let {page, pageSize, setPage, setPageSize} = usePage()
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
     <div className="mt-5 space-y-5">
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
      <section style={{ overflow: "auto", maxWidth: "100%" }} padded>
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
      </section>

      <section>
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
              {listLaporan?.data?.rows?.map((value, index) => (
                <Table.Row key={index}>
                  <Table.Cell>{index + 1}</Table.Cell>
                  <Table.Cell>{formatDay(value?.tanggal)}</Table.Cell>
                  <Table.Cell>{value?.guru?.nama_guru}</Table.Cell>
                  <Table.Cell>
                    {value?.tahun_ajaran?.nama_tahun_ajaran}
                  </Table.Cell>

                  <Table.Cell>
                    {status === 1 ? (
                     <div className={`grid   grid-cols-1  lg:grid-cols-2 xl:grid-cols-2  2xl:grid-cols-2 gap-5`}>
                      <Button
                        content={"Lihat Laporan"}
                        type="button"
                        fluid
                        icon={() => <Icon name="eye" />}
                        // disabled={value?.teacher_id !== identitas?.teacher_id}
                        size="medium"
                        color="facebook"
                        onClick={() => {
                          return navigate(
                            `/guru/laporan-guru-piket/lihat-laporan/${
                              value.id
                            }/${formatTahun(value?.tanggal)}`
                          );
                        }}
                      />
                      <Button
                      content={"Ubah Laporan"}
                      type="button"
                      fluid
                      icon={() => <Icon name="edit" />}
                      disabled={value?.teacher_id !== identitas?.teacher_id}
                      size="medium"
                      color="teal"
                      onClick={() => {
                        return navigate(
                          `/guru/laporan-guru-piket/buat-laporan/${
                            value.id
                          }/${formatTahun(value?.tanggal)}`
                        );
                      }}
                    /></div>
                    ) : (
                      <Button
                        content={"Buat Laporan"}
                        type="button"
                        fluid
                        icon={() => <Icon name="edit" />}
                        disabled={value?.teacher_id !== identitas?.teacher_id}
                        size="medium"
                        color="teal"
                        onClick={() => {
                          return navigate(
                            `/guru/laporan-guru-piket/buat-laporan/${
                              value.id
                            }/${formatTahun(value?.tanggal)}`
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
        <PaginationTable
          page={page}
          pageSize={pageSize}
          setPageSize={setPageSize}
          setPage={setPage}
          totalPages={listLaporan?.data?.count}
        />
      </section>
     </div>
    </LayoutPage>
  );
}
