import React from "react";
import { useNavigate } from "react-router-dom";
import LayoutPage from "../../../module/layoutPage";
import { Table, Button, Form, Select, Icon } from "semantic-ui-react";
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
import { deleteBankSoal, listBankSoal } from "../../../api/guru/bank_soal";
import { useQueryClient } from "react-query";
import { LabelStatus } from "../../../components/Label";
export default function ListBankSoal() {
  const navigate = useNavigate();

  let { page, pageSize, setPage, setPageSize } = usePage();

  let params = {
    page,
    pageSize,

    is_all: 1,
  };
  let { data, isLoading } = useQuery(
    //query key
    ["/bank-soal/list", params],
    //axios function,triggered when page/pageSize change
    () => listBankSoal(params),
    //configuration
    {
      staleTime : 1000 * 60 * 5,
      // refetchInterval: 1000 * 60 * 60,
      select: (response) => {
        return response.data;
      },
    }
  );
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
      <ModalAlert
        open={showAlertDelete}
        setOpen={setShowAlertDelete}
        loading={deleteLoading}
        onConfirm={onConfirmDelete}
        title={"Apakah yakin akan menghapus soal terpilih ?"}
      />
      <div className=" space-y-5">
        <section className="grid grid-cols-5 gap-5">
          <div className="col-span-4 lg:col-span-1">
            <Button
              type="button"
              color="teal"
              icon={() => <Icon name="add" />}
              onClick={() => {
                navigate("tambah", {
                  replace: true,
                });
              }}
              content="Tambah "
            />
          </div>
        </section>
        <section>
          <Table celled selectable>
            <Table.Header>
              <Table.Row>
                <Table.HeaderCell>No</Table.HeaderCell>

                <Table.HeaderCell>Nama Guru</Table.HeaderCell>
                <Table.HeaderCell>Mata Pelajaran</Table.HeaderCell>
                <Table.HeaderCell>Bab</Table.HeaderCell>
                <Table.HeaderCell>Tipe</Table.HeaderCell>
                <Table.HeaderCell>Point</Table.HeaderCell>
 
                <Table.HeaderCell >Aksi</Table.HeaderCell>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              <TableLoading
                count={8}
                isLoading={isLoading}
                data={data?.data}
                messageEmpty={"Data Tidak Ditemukan"}
              >
                {data?.data?.rows?.map((value, index) => (
                  <Table.Row key={index}>
                    <Table.Cell>{index + 1}</Table.Cell>

                    <Table.Cell>{value?.teacher?.nama_guru}</Table.Cell>
                    <Table.Cell>{value?.mapel?.nama_mapel}</Table.Cell>
                    <Table.Cell>{value?.materi}</Table.Cell>
                    <Table.Cell><LabelStatus status={value?.tipe}/></Table.Cell>
                    <Table.Cell>{value?.point}</Table.Cell>

                    <Table.Cell>
                      <span className="flex items-center justify-center">
                        {" "}
                        <EditButton
                          onClick={() => {
                            navigate(`update/${value.id}`, {
                              replace: true,
                            });
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
            page={page}
            pageSize={pageSize}
            setPageSize={setPageSize}
            setPage={setPage}
            totalPages={data?.data?.count}
          />
        </section>
      </div>
    </LayoutPage>
  );
}
