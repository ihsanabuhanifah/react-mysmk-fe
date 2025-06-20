import React from "react";
import { Table, Button, Input, Sidebar, Menu, Icon } from "semantic-ui-react";
import { rekapAbsensi } from "../../../api/guru/absensi";
import { useQuery } from "react-query";

import { TableLoading } from "../../../components";
import LayoutPage from "../../../module/layoutPage";
import { formatDay } from "../../../utils";
import PaginationTable from "../../../components/PaginationTable";
import FilterRekap from "./filter";
import { encodeURlFormat } from "../../../utils";
import usePage from "../../../hook/usePage";

import { downloadRekapAbsensi } from "../../../api/guru/absensi";
import useDownload from "../../../hook/useDownload";
export default function RekapAbsensi() {
  let [visible, setVisible] = React.useState(false);
  const [filter, setFilter] = React.useState({});
  let { page, pageSize, setPage, setPageSize } = usePage();
 
  const params = {
    page,
    pageSize,
    ...filter,
    nama_siswa: encodeURlFormat(filter?.nama_siswa?.label),
    nama_kelas: encodeURlFormat(filter?.nama_kelas),
    nama_guru: encodeURlFormat(filter?.nama_guru),
    nama_mapel: encodeURlFormat(filter?.nama_mapel),
    tahun_ajaran: encodeURlFormat(filter?.tahun_ajaran),
    status_kehadiran: encodeURlFormat(filter?.status_kehadiran),
  };
  let { data, isLoading } = useQuery(
    //query key
    ["rekap_absensi_kelas", params],
    //axios function,triggered when page/pageSize change
    () => rekapAbsensi(params),
    //configuration
    {
      refetchInterval: 1000 * 60 * 60,
      refetchOnWindowFocus : false,
      staleTime: 1000 * 60 * 60 * 5,
      select: (response) => {
        return response.data;
      },
    }
  );

  let { isLoadingDownload, handleDownload } = useDownload({
    filename: "rekap-absensi.xlsx",
    onDownload: () => {
      return downloadRekapAbsensi(params);
    },
  });

  const handleEvent = (event) => {


    if (event.key === "x") {
      console.log("ok", event);
    }
  };

  return (
    <LayoutPage
      title={"Rekap Absensi Kelas"}
      visible={visible}
      setVisible={setVisible}
    >
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
        <FilterRekap
          filter={filter}
          setFilter={setFilter}
          setVisible={setVisible}
        />
      </Sidebar>
      <section onKeyPress={handleEvent}  className="mt-5 pb-10 ">
        <section className="grid grid-cols-6 gap-5 ">
          <div className="col-span-6 lg:col-span-3 xl:col-span-3">
            <Input
              fluid
              loading={false}
              icon="search"
              iconPosition="left"
              placeholder="Search..."
            />
          </div>
          <div className="col-span-6 lg:col-span-1 xl:col-span-1">
            <Button
              content={"Filter"}
              type="button"
              fluid
              icon={() => <Icon name="filter" />}
              size="medium"
              color="teal"
              onClick={() => {
                setVisible(!visible);
              }}
            />
          </div>
          <div className="col-span-6 lg:col-span-1 xl:col-span-1">
            <Button
              content={"Download"}
              type="button"
              fluid
              icon={() => <Icon name="download" />}
              loading={isLoadingDownload}
              size="medium"
              color="linkedin"
              onClick={() => {
                handleDownload(params);
              }}
            />
          </div>
        </section>
        <Table celled selectable>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell>No</Table.HeaderCell>

              <Table.HeaderCell>Tanggal</Table.HeaderCell>
              <Table.HeaderCell>Nama Siswa</Table.HeaderCell>
              <Table.HeaderCell>Kelas </Table.HeaderCell>
              <Table.HeaderCell>Mata Pelajaran</Table.HeaderCell>
              <Table.HeaderCell>Nama Guru</Table.HeaderCell>
              <Table.HeaderCell>Status Kehadiran</Table.HeaderCell>
              <Table.HeaderCell>Keterangan</Table.HeaderCell>
              <Table.HeaderCell>Semester</Table.HeaderCell>
              <Table.HeaderCell>Tahun Pelajaran</Table.HeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            <TableLoading
              count={10}
              isLoading={isLoading}
              data={data?.absensi?.rows}
              messageEmpty={"Tidak Ditemukan Rekap pada filter yang dipilih"}
            >
              {data?.absensi?.rows?.map((value, index) => (
                <Table.Row key={index}>
                  <Table.Cell>{index + 1}</Table.Cell>
                  <Table.Cell>
                    <span className="capitalize">
                      {formatDay(value?.tanggal)}
                    </span>
                  </Table.Cell>
                  <Table.Cell>{value?.siswa?.nama_siswa}</Table.Cell>
                  <Table.Cell>{value?.kelas?.nama_kelas}</Table.Cell>
                  <Table.Cell>{value?.mapel?.nama_mapel}</Table.Cell>
                  <Table.Cell>{value?.teacher?.nama_guru}</Table.Cell>
                  <Table.Cell>
                    {value?.kehadiran?.nama_status_kehadiran}
                  </Table.Cell>
                  <Table.Cell>
                    {value?.keterangan === null ? "-" : value.keterangan}
                  </Table.Cell>
                  <Table.Cell>Semester {value?.semester}</Table.Cell>
                  <Table.Cell>
                    {value?.tahun_ajaran?.nama_tahun_ajaran}
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
          totalPages={data?.absensi?.count}
        />
      </section>
    </LayoutPage>
  );
}
