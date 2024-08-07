import React, { useState } from "react";
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

import usePage from "../../../hook/usePage";
import { PaginationTable } from "../../../components";

import { useQueryClient } from "react-query";
import { deleteUjian, listUjian } from "../../../api/guru/ujian";
import dayjs from "dayjs";
import ModalKonfirmasi from "./ModalKonfirmasi";

import { LabelStatus, LabelTipeUjian } from "../../../components/Label";
import useList from "../../../hook/useList";

export default function ListExam() {
  const navigate = useNavigate();
  let [open, setOpen] = useState(false);
  let { roles } = useList();

  let [payload, setPayload] = useState({});
  let { page, pageSize, setPage, setPageSize } = usePage();
  let params = {
    page,
    pageSize,

    is_all: 1,
  };
  let { data, isLoading } = useQuery(
    //query key
    ["/ujian/list", params],
    //axios function,triggered when page/pageSize change
    () => listUjian(params),
    //configuration
    {
      // refetchInterval: 1000 * 60 * 60,
      staleTime: 100 * 60 * 5,
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
    afterDeleted: () => queryClient.invalidateQueries("/ujian/list"),
    onDelete: (id) => {
      return deleteUjian(id);
    },
  });

  {
    console.log("role", roles);
  }

  return (
    <LayoutPage title="List Ujian">
      <ModalAlert
        open={showAlertDelete}
        setOpen={setShowAlertDelete}
        loading={deleteLoading}
        onConfirm={onConfirmDelete}
        title={"Apakah yakin akan menghapus soal terpilih ?"}
      />
      {open && (
        <ModalKonfirmasi
          open={open}
          setOpen={setOpen}
          payload={payload}
          setPayload={setPayload}
        />
      )}

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
                <Table.HeaderCell>Kelas</Table.HeaderCell>
                <Table.HeaderCell>Jenis Ujian</Table.HeaderCell>
                <Table.HeaderCell>Tipe Ujian</Table.HeaderCell>
                <Table.HeaderCell>Status</Table.HeaderCell>
                <Table.HeaderCell>Durasi</Table.HeaderCell>
                <Table.HeaderCell>Waktu Mulai</Table.HeaderCell>
                <Table.HeaderCell>Waktu Selesai</Table.HeaderCell>
                <Table.HeaderCell>Aksi</Table.HeaderCell>
                <Table.HeaderCell>Publish</Table.HeaderCell>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              <TableLoading
                count={12}
                isLoading={isLoading}
                data={data?.data?.rows}
                messageEmpty={"Data Tidak Ditemukan"}
              >
                {data?.data?.rows?.map((value, index) => (
                  <Table.Row key={index}>
                    <Table.Cell>{index + 1}</Table.Cell>

                    <Table.Cell>{value?.teacher?.nama_guru}</Table.Cell>
                    <Table.Cell>{value?.mapel?.nama_mapel}</Table.Cell>
                    <Table.Cell>{value?.kelas?.nama_kelas}</Table.Cell>
                    <Table.Cell>
                      {<LabelStatus status={value?.jenis_ujian} />}
                    </Table.Cell>
                    <Table.Cell>
                      <LabelTipeUjian status={value?.tipe_ujian} />
                    </Table.Cell>
                    <Table.Cell>
                      <LabelTipeUjian status={value?.status} />
                    </Table.Cell>
                    <Table.Cell>{value?.durasi} Menit</Table.Cell>
                    <Table.Cell>
                      {dayjs(value.waktu_mulai).format("DD-MM-YY HH:mm:ss")}
                    </Table.Cell>
                    <Table.Cell>
                      {dayjs(value.waktu_selesai).format("DD-MM-YY HH:mm:ss")}
                    </Table.Cell>
                    <Table.Cell>
                      <span className="flex items-center">
                        {" "}
                        <EditButton
                          onClick={() => {
                            navigate(`update/${value.id}`, {
                              replace: true,
                            });
                          }}
                        />
                        <DeleteButton
                         disabled={
                          value?.status !== "draft" ||
                          value.teacher_id !== roles?.teacher_id
                        }
                          onClick={() => {
                            confirmDelete(value?.id);
                          }}
                        />
                      </span>
                    </Table.Cell>
                    <Table.Cell>
                      {value?.status !== "draft" ? (
                        <Button
                          type="button"
                          color="facebook"
                          icon={() => <Icon name="laptop" />}
                          onClick={() => {
                            navigate(
                              `penilaian/${value.id}/${value?.mapel?.nama_mapel}`,
                              {
                                replace: true,
                              }
                            );
                          }}
                        />
                      ) : (
                        <Button
                          disabled={
                            value?.status !== "draft" ||
                            value.teacher_id !== roles?.teacher_id
                          }
                          type="button"
                          color="teal"
                          icon={() => <Icon name="external alternate" />}
                          onClick={() => {
                            setPayload(() => {
                              return value;
                            });

                            setOpen(true);
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
            totalPages={data?.data?.count}
          />
        </section>
      </div>
    </LayoutPage>
  );
}
