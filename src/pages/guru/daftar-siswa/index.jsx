/* eslint-disable no-unused-vars */
import React from "react";
import { Table, Button, Input, Sidebar, Menu, Icon } from "semantic-ui-react";
import { useNavigate } from "react-router-dom";
import { useQuery, useQueryClient } from "react-query";

import {
  DeleteButton,
  EditButton,
  ModalAlert,
  TableLoading,
  ViewButton,
} from "../../../components";
import LayoutPage from "../../../module/layoutPage";
import { formatDate } from "../../../utils";
import PaginationTable from "../../../components/PaginationTable";
import FilterSiswa from "./filter";
import { encodeURlFormat, checkRole } from "../../../utils";
import usePage from "../../../hook/usePage";
import useDelete from "../../../hook/useDelete";
import { downloadRekapAbsensi } from "../../../api/guru/absensi";
import useDownload from "../../../hook/useDownload";
import { deleteSiswaKelasHandle, listSiswa } from "../../../api/guru/siswa";
import useDebounce from "../../../hook/useDebounce";
import useList from "../../../hook/useList";
export default function DaftarSiswa() {
  let [visible, setVisible] = React.useState(false);
  let navigate = useNavigate();
  const { roles } = useList();
  let [keyword, setKeyword] = React.useState("");
  let debouncedKeyword = useDebounce(keyword, 500);
  const queryClient = useQueryClient();
  let { page, pageSize, setPage, setPageSize } = usePage();
  const [filter, setFilter] = React.useState({});

  const params = {
    page,
    pageSize,
    keyword: debouncedKeyword,
    status: 1,
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
    ["siswa/list", params],
    //axios function,triggered when page/pageSize change
    () => listSiswa(params),
    //configuration
    {
      refetchOnWindowFocus: false,
      select: (response) => {
        console.log(response.data)
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
    console.log("ee", event);
    if (event.key === "x") {
      console.log("ok", event);
    }
  };

  let {
    showAlertDelete,
    setShowAlertDelete,
    deleteLoading,
    confirmDelete,
    onConfirmDelete,
  } = useDelete({
    afterDeleted: () => queryClient.invalidateQueries("siswa/list"),
    onDelete: (id) => {
      return deleteSiswaKelasHandle(id);
    },
  });

  return (
    <LayoutPage
      title={"Daftar Siswa"}
      visible={visible}
      setVisible={setVisible}
    >
      <ModalAlert
        open={showAlertDelete}
        setOpen={setShowAlertDelete}
        loading={deleteLoading}
        onConfirm={onConfirmDelete}
        title={"Apakah yakin akan menghapus siswa terpilih ?"}
      />
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
        <FilterSiswa
          filter={filter}
          setFilter={setFilter}
          setVisible={setVisible}
        />
      </Sidebar>
      <section onKeyPress={handleEvent} className=" pb-10 ">
        <section className="grid grid-cols-6 gap-5 ">
          <div className="col-span-6 lg:col-span-3 xl:col-span-3">
            <Input
              fluid
              loading={false}
              icon="search"
              onChange={(e) => {
                setKeyword(e.target.value);
              }}
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
          <div className="col-span-6 lg:col-span-1 xl:col-span-1">
            {checkRole(roles, "Admin") && (
              <Button
                content={"Kelas"}
                type="submit"
                fluid
                icon={() => <Icon name="add" />}
                size="medium"
                color="linkedin"
                onClick={() => {
                  return navigate("tambah-kelas");
                }}
              />
            )}
          </div>
        </section>
        <Table celled selectable>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell>No</Table.HeaderCell>

              <Table.HeaderCell>Nama Siswa</Table.HeaderCell>
              <Table.HeaderCell>NIS</Table.HeaderCell>
              <Table.HeaderCell>NISN</Table.HeaderCell>
              <Table.HeaderCell>Email</Table.HeaderCell>
              <Table.HeaderCell>Tempat Tanggal Lahir </Table.HeaderCell>
              <Table.HeaderCell>Kelas </Table.HeaderCell>
              <Table.HeaderCell>Diterima Tanggal</Table.HeaderCell>

              <Table.HeaderCell>Tahun Pelajaran</Table.HeaderCell>
              <Table.HeaderCell>Aksi</Table.HeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            <TableLoading
              count={10}
              isLoading={isLoading}
              data={data?.data?.rows}
              messageEmpty={"Tidak Ditemukan Rekap pada filter yang dipilih"}
            >
              {data?.data?.rows?.map((value, index) => (
                <Table.Row key={index}>
                  <Table.Cell>{index + 1}</Table.Cell>

                  <Table.Cell>{value?.siswa?.nama_siswa}</Table.Cell>

                  <Table.Cell>{value?.siswa?.nis}</Table.Cell>
                  <Table.Cell>{value?.siswa?.nisn}</Table.Cell>
                  <Table.Cell>{value?.siswa?.user?.email}</Table.Cell>

                  <Table.Cell>
                    {value?.siswa?.tempat_lahir},{" "}
                    {formatDate(value?.siswa?.tanggal_lahir)}
                  </Table.Cell>
                  <Table.Cell>{value?.kelas?.nama_kelas}</Table.Cell>

                  <Table.Cell>
                    {formatDate(value?.siswa?.tanggal_diterima)}
                  </Table.Cell>

                  <Table.Cell>
                    {value?.tahun_ajaran?.nama_tahun_ajaran}
                  </Table.Cell>
                  <Table.Cell>
                    {/* <>
                      <DeleteButton onClick={() => confirmDelete(value?.id)} />
                      <EditButton
                        onClick={() => navigate(`/update-siswa/${value?.id}`)}
                      />
                    </> */}
                    <>
                      {/* <EditButton
                        onClick={() => navigate(`update-siswa/${value?.id}/`)}
                      /> */}
                      <EditButton
                        onClick={() =>
                          window.open(`daftar-siswa/update-siswa/${value?.siswa?.id}`)
                        }
                      />
                      <DeleteButton
                        onClick={() => confirmDelete(value?.id)}
                        className="button-spacing"
                      />
                    </>
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
          totalPages={data?.data?.count}
        />
      </section>
    </LayoutPage>
  );
}
