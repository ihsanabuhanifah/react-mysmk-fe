import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import LayoutPage from "../../../module/layoutPage";
import { Table, Button, Form, Select, Icon, Input } from "semantic-ui-react";
import { useQuery } from "react-query";
import { TableLoading } from "../../../components";
import useDelete from "../../../hook/useDelete";
import {
  // eslint-disable-next-line no-unused-vars
  ModalFilter,
  EditButton,
  DeleteButton,
  // eslint-disable-next-line no-unused-vars
  ViewButton,
  ModalAlert,
} from "../../../components";
import useList from "../../../hook/useList";
import usePage from "../../../hook/usePage";
import { PaginationTable } from "../../../components";
import {
  deleteBankSoal,
  listBankSoal,
  useListBankSoal,
} from "../../../api/guru/bank_soal";
import { useQueryClient } from "react-query";
import { LabelStatus } from "../../../components/Label";
import { getOptions } from "../../../utils/format";
import ModalUpdateUjian from "./ModalUpdate";
export default function ListBankSoal() {
  const { dataMapel, dataKelas, dataTa } = useList();
  const navigate = useNavigate();
  let [id, setId]= useState(null)
    const [open, setOpen] = useState(false)

  let {
    isLoading,
    data,
    isFetching,
    setParams,
    payload,
    params,
    handlePayload,
    handleParams,
    handlePage,
    handlePageSize,
    handleParamsHit,
    handleSearch,
    keyword,
  } = useListBankSoal();
  let queryClient = useQueryClient();
  let {
    showAlertDelete,
    setShowAlertDelete,
    deleteLoading,
    confirmDelete,
    onConfirmDelete,
  } = useDelete({
    afterDeleted: () => queryClient.invalidateQueries("/bank-soal/list"),
    onDelete: (payload) => {
      return deleteBankSoal(payload);
    },
  });

  return (
    <LayoutPage title="Bank Soal">
        {open && <ModalUpdateUjian id={id} setOpen={setOpen} open={open}/>}
      <ModalAlert
        open={showAlertDelete}
        setOpen={setShowAlertDelete}
        loading={deleteLoading}
        onConfirm={onConfirmDelete}
        title={"Apakah yakin akan menghapus soal terpilih ?"}
      />
      <div className=" space-y-5">
        <section className="grid grid-cols-5 gap-5">
          <div className="col-span-1 lg:col-span-1">
            <Button
              type="button"
              color="teal"
              icon={() => <Icon name="add" />}
              onClick={() => {
                setOpen(true)
                setId(null)
              }}
              content="Tambah "
            />
          </div>
          <div className="col-span-4 flex items-center justify-end space-x-2">
          
              <Form.Field
                control={Input}
                placeholder="Cari ..."
                onChange={handleSearch}
                value={keyword}
              />
          

            <Form.Field
              clear
              control={Select}
              value={params?.mapel_id}
              options={getOptions(dataMapel?.data, "nama_mapel")}
              onChange={(event, data) => {
                handleParamsHit("mapel_id", data?.value);
              }}
              placeholder="Filter Mata Pelajaran"
              search
            />

            {/* <Form.Field
              clear
              control={Select}
              placeholder="Pilih"
              value={params?.is_all}
              options={[
                {
                  key: "1",
                  value: 1,
                  label: "Semua Guru",
                },
                { key: "2", value: 0 label: "Soal Saya" },
              ]}
              onChange={(event, data) => {
                handleParamsHit("is_all", data?.value);
              }}
              search
            /> */}
          </div>
        </section>
        <section>
          <Table celled selectable>
            <Table.Header>
              <Table.Row>
                <Table.HeaderCell>No</Table.HeaderCell>

                <Table.HeaderCell>Nama Guru</Table.HeaderCell>
                <Table.HeaderCell>Mata Pelajaran</Table.HeaderCell>
                <Table.HeaderCell>Materi</Table.HeaderCell>
                <Table.HeaderCell>Tipe</Table.HeaderCell>
                <Table.HeaderCell>Point</Table.HeaderCell>

                <Table.HeaderCell>Aksi</Table.HeaderCell>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              <TableLoading
                count={8}
                isLoading={isFetching}
                data={data?.data?.rows}
                messageEmpty={"Data Tidak Ditemukan"}
              >
                {data?.data?.rows?.map((value, index) => (
                  <Table.Row key={index}>
                    <Table.Cell>{index + 1}</Table.Cell>

                    <Table.Cell>{value?.teacher?.nama_guru}</Table.Cell>
                    <Table.Cell>{value?.mapel?.nama_mapel}</Table.Cell>
                    <Table.Cell>{value?.materi}</Table.Cell>
                    <Table.Cell>
                      <LabelStatus status={value?.tipe} />
                    </Table.Cell>
                    <Table.Cell>{value?.point}</Table.Cell>

                    <Table.Cell>
                      <span className="flex items-center justify-center">
                        {" "}
                        <EditButton
                          onClick={() => {
                           setId(value?.id)
                           setOpen(true)
                          }}
                        />
                        <DeleteButton
                          onClick={() => {
                            let payload = [value?.id];
                            confirmDelete(payload);
                          }}
                        />
                      </span>
                    </Table.Cell>
                  </Table.Row>
                ))}
              </TableLoading>
            </Table.Body>
          </Table>
          <PaginationTable
            page={params.page}
            pageSize={params.pageSize}
            setPageSize={handlePageSize}
            setPage={handlePage}
            totalPages={data?.data?.count}
          />
        </section>
      </div>
    </LayoutPage>
  );
}
