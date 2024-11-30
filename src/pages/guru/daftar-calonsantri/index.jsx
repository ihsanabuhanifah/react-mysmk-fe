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
import FilterSiswa from "../daftar-siswa/filter"; // Assuming this is your filter component
import { encodeURlFormat, checkRole } from "../../../utils";
import usePage from "../../../hook/usePage";
import useDelete from "../../../hook/useDelete";
import { downloadRekapAbsensi } from "../../../api/guru/absensi";
import useDownload from "../../../hook/useDownload";
import { deleteSiswaKelasHandle, listSiswa } from "../../../api/guru/siswa";
import useDebounce from "../../../hook/useDebounce";
import useList from "../../../hook/useList";
import { listCalonSiswa } from "../../../api/guru/calonSiswa";
import FilterCalonSantri from "./filterCalon";

export default function DaftarCalonSiswa() {
  let [visible, setVisible] = React.useState(false);
  let navigate = useNavigate();
  const { roles } = useList();
  let [keyword, setKeyword] = React.useState("");
  let debouncedKeyword = useDebounce(keyword, 500);
  const queryClient = useQueryClient();
  let { page, pageSize, setPage, setPageSize } = usePage();
  const [filter, setFilter] = React.useState({});

  // Gabungkan keyword dan filter params untuk API call
  const params = {
    page,
    pageSize,
    keyword: debouncedKeyword,
    status: 1,
    ...filter,
    nama_siswa: encodeURlFormat(filter?.nama_siswa), // Disesuaikan
    asal_sekolah: encodeURlFormat(filter?.asal_sekolah),
    tahun_ajaran: encodeURlFormat(filter?.tahun_ajaran),
  };

  // Log untuk memeriksa parameter yang dikirim
  console.log("Filter params:", params);

  let { data, isLoading } = useQuery(
    ["/list-calsan", params],
    () => listCalonSiswa(params),
    {
      refetchOnWindowFocus: false,
      select: (response) => {
        // Log response dari API
        console.log("API Response:", response);
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

  let {
    showAlertDelete,
    setShowAlertDelete,
    deleteLoading,
    confirmDelete,
    onConfirmDelete,
  } = useDelete({
    afterDeleted: () => queryClient.invalidateQueries("/list-calsan"),
    onDelete: (id) => {
      return deleteSiswaKelasHandle(id);
    },
  });

  return (
    <LayoutPage
      title={"Daftar Calon Santri"}
      visible={visible}
      setVisible={setVisible}
    >
      <ModalAlert
        open={showAlertDelete}
        setOpen={setShowAlertDelete}
        loading={deleteLoading}
        onConfirm={onConfirmDelete}
        title={"Apakah yakin akan menghapus siswa terpilih?"}
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
        {/* Filter Sidebar */}
        <FilterCalonSantri
          filter={filter}
          setFilter={setFilter}
          setVisible={setVisible}
        />
        <Menu.Item>
          <Input
            fluid
            icon="search"
            placeholder="Filter Nama Siswa"
            onChange={(e) => {
              setFilter({ ...filter, nama_siswa: e.target.value });
              setPage(1); // Reset ke halaman pertama saat filter diubah
            }}
          />
        </Menu.Item>
      </Sidebar>
      <section onKeyPress={handleEvent} className="pb-10">
        <section className="grid grid-cols-6 gap-5">
          <div className="col-span-6 lg:col-span-3 xl:col-span-3">
            {/* <Input
              fluid
              loading={false}
              icon="search"
              onChange={(e) => {
                setKeyword(e.target.value);
              }}
              iconPosition="left"
              placeholder="Search..."
            /> */}
          </div>
          <div className="col-span-6 lg:col-span-3 xl:col-span-3">
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
        </section>

        {/* Table */}
        <Table celled selectable>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell>No</Table.HeaderCell>
              <Table.HeaderCell>Nama Siswa</Table.HeaderCell>
              <Table.HeaderCell>Asal Sekolah</Table.HeaderCell>
              <Table.HeaderCell>Tanggal Lahir</Table.HeaderCell>
              <Table.HeaderCell>Tahun Ajaran</Table.HeaderCell>
              <Table.HeaderCell>Status Ujian</Table.HeaderCell>
              <Table.HeaderCell>Status Wawancara</Table.HeaderCell>
              <Table.HeaderCell>Aksi</Table.HeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            <TableLoading
              count={10}
              isLoading={isLoading}
              data={data?.data?.rows}
              messageEmpty={
                data?.data?.rows.length === 0
                  ? "Tidak Ditemukan Rekap pada filter yang dipilih"
                  : "Tidak ada data"
              }
            >
              {data?.data?.rows?.map((value, index) => (
                <Table.Row key={index}>
                  <Table.Cell>{index + 1}</Table.Cell>
                  <Table.Cell>{value?.nama_siswa}</Table.Cell>
                  <Table.Cell>{value?.sekolah_asal}</Table.Cell>
                  <Table.Cell>
                    {value?.tempat_lahir}, {formatDate(value?.tanggal_lahir)}
                  </Table.Cell>
                  <Table.Cell>{value?.ta_id}</Table.Cell>
                  <Table.Cell>{value?.status_ujian}</Table.Cell>
                  <Table.Cell>{value?.wawancara.status_tes}</Table.Cell>
                  <Table.Cell>
                    <EditButton
                      onClick={() =>
                        navigate(`detail/${value?.id}`)
                      }
                    />
                    <DeleteButton
                      onClick={() => confirmDelete(value?.id)}
                      className="button-spacing"
                    />
                  </Table.Cell>
                </Table.Row>
              ))}
            </TableLoading>
          </Table.Body>
        </Table>

        {/* Pagination */}
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