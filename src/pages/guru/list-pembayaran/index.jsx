/* eslint-disable no-unused-vars */
import React from "react";
import LayoutPage from "../../../module/layoutPage";
import {
  DeleteButton,
  EditButton,
  Input,
  PaginationTable,
  TableLoading,
} from "../../../components";
import usePage from "../../../hook/usePage";
import useDebounce from "../../../hook/useDebounce";
import { useQuery, useQueryClient } from "react-query";
import { Table } from "semantic-ui-react";
import { useNavigate } from "react-router-dom";
import { listPembayaran } from "../../../api/guru/pembayaran";
import { formatDate } from "../../../utils";
import useDelete from "../../../hook/useDelete";
import { deleteSiswaKelasHandle } from "../../../api/guru/siswa";

export default function ListPembayaran() {
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
    () => listPembayaran(params),
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
      return deleteSiswaKelasHandle(id);
    },
  });

  return (
    <LayoutPage
      title={"List Pembayaran"}
      visible={visible}
      setVisible={setVisible}
    >
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
              <Table.HeaderCell>Nama User</Table.HeaderCell>
              <Table.HeaderCell>Bukti Transfer</Table.HeaderCell>
              <Table.HeaderCell>Keterangan</Table.HeaderCell>
              <Table.HeaderCell>Status</Table.HeaderCell>
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
                  <Table.Cell>{value.user?.name}</Table.Cell>{" "}
                  <Table.Cell>
                    <a
                      href={value.bukti_tf}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {value.bukti_tf}
                    </a>{" "}
                    {/* Menampilkan bukti transfer sebagai link */}
                  </Table.Cell>
                  <Table.Cell>{value.keterangan}</Table.Cell>
                  <Table.Cell>
                    {value.status === 0
                      ? "Belum Terverifikasi"
                      : "Terverifikasi"}
                  </Table.Cell>{" "}
                  <Table.Cell>
                    <EditButton
                      onClick={() => navigate(`konfirmasi-pembayaran/${value.id}`)} // Perbaiki referensi ke id
                    />
                    <DeleteButton
                      onClick={() => confirmDelete(value.id)} // Pastikan menggunakan id yang benar
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
