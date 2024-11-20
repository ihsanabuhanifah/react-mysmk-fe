/* eslint-disable no-unused-vars */
import React from "react";
import LayoutPage from "../../../module/layoutPage";
import {
  DeleteButton,
  EditButton,
  Input,
  ModalAlert,
  PaginationTable,
  TableLoading,
} from "../../../components";
import usePage from "../../../hook/usePage";
import useDebounce from "../../../hook/useDebounce";
import { useQuery, useQueryClient } from "react-query";
import { Table } from "semantic-ui-react";
import { useNavigate } from "react-router-dom";
import { listWawancara } from "../../../api/guru/wawancara";
import { formatDate } from "../../../utils";
import useDelete from "../../../hook/useDelete";
import { deletePembayaranHandle } from "../../../api/guru/pembayaran";

export default function ListWawancara() {
  let [visible, setVisible] = React.useState(false);
  let navigate = useNavigate();
  let { page, pageSize, setPage, setPageSize } = usePage();
  let [keyword, setKeyword] = React.useState("");
  let debouncedKeyword = useDebounce(keyword, 500);
  const queryClient = useQueryClient();

  // Combine the keyword and filter params for API call
  const params = {
    page,
    pageSize,
    keyword: debouncedKeyword,
    status: 1,
  };

  let { data, isLoading } = useQuery(
    ["/list", params],
    () => listWawancara(params),
    {
      refetchOnWindowFocus: false,
      select: (response) => {
        return response.data;
      },
    }
  );

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
    afterDeleted: () => queryClient.invalidateQueries("/list"),
    onDelete: (id) => {
      return deletePembayaranHandle(id);
    },
  });

  return (
    <LayoutPage
      title={"List Wawancara calon Santri"}
      visible={visible}
      setVisible={setVisible}
    >
      <ModalAlert
        open={showAlertDelete}
        setOpen={setShowAlertDelete}
        loading={deleteLoading}
        onConfirm={onConfirmDelete}
        title={"Apakah yakin akan menghapus pembayaran ini ?"}
      />
      <section onKeyPress={handleEvent} className="pb-10">
        <section className="grid grid-cols-6 gap-5">
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
        </section>

        {/* Table */}
        <Table celled selectable>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell>No</Table.HeaderCell>
              <Table.HeaderCell>Nama Calon Santri</Table.HeaderCell>
              <Table.HeaderCell>Metode Wawancara</Table.HeaderCell>
              <Table.HeaderCell>Status Tes</Table.HeaderCell>
              <Table.HeaderCell>Catatan</Table.HeaderCell>
              <Table.HeaderCell>Pewawancara</Table.HeaderCell>
              <Table.HeaderCell>Apakah Lulus</Table.HeaderCell>
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
                <Table.Row key={value.id}>
                  {" "}
                  <Table.Cell>{index + 1}</Table.Cell>
                  <Table.Cell>
                    {value.informasi_calon_santri?.nama_siswa}
                  </Table.Cell>{" "}
                  <Table.Cell>{value.method}</Table.Cell>
                  <Table.Cell>{value.status_tes}</Table.Cell>
                  <Table.Cell>{value.catatan}</Table.Cell>
                  <Table.Cell>{value.guruWawancara.nama_guru}</Table.Cell>
                  <Table.Cell>
                    {value.is_lulus === "belum diumumkan"
                      ? "Belum Diumumkan"
                      : value.is_lulus === "tidak lulus"
                      ? "Tidak Lulus"
                      : "Lulus"}
                  </Table.Cell>
                  <Table.Cell>
                    <EditButton
                      onClick={() =>
                        navigate(`konfirmasi-wawancara/${value.id}`)
                      } // Perbaiki referensi ke id
                    />
                    <DeleteButton
                      onClick={() => confirmDelete(value?.id)} // Pastikan menggunakan id yang benar
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
