import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import LayoutPage from "../../../module/layoutPage";
import {
  Table,
  Button,
  Form,
  Select,
  Icon,
  Tab,
  Sidebar,
  Menu,
} from "semantic-ui-react";
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
import {
  deleteUjian,
  listUjian,
  useListUjian,
  useListUjianBerjalan,
} from "../../../api/guru/ujian";
import dayjs from "dayjs";
import ModalKonfirmasi from "./ModalKonfirmasi";
import ModalPage from "../../../components/ModalPage";
import {
  LabelKeterangan,
  LabelStatus,
  LabelTingkat,
  LabelTipeUjian,
} from "../../../components/Label";
import useList from "../../../hook/useList";
import { CopyButton } from "../../../components/buttonAksi/editButton";
import Filter from "./filter";
import AnalisisPage from "./AnalisisPage";
import PenilaianModal from "./PenilaianModal";
import ModalUpdateUjian from "./ModalUpdateUjian";

export default function UjianBerjalan() {
  const navigate = useNavigate();
  let [visible, setVisible] = React.useState(false);
  let [open, setOpen] = useState(false);
  let { roles } = useList();
  let [analisiOpen, setAnalisisOpen] = useState(false);
  let [penilaianOpen, setPenilaianOpen] = useState(false);
  let [payload, setPayload] = useState({});
  let [view, setView] = useState({ id: null });
  let [idUpdate, setIdUpdate] = useState(null);
  let [updateOpen, setUpdateOpen] = useState(false);

  const {
    isLoading,
    data,
    isFetching,
    params,
    keyword,
    setParams,
    handleFilter,
    handleClear,
    handlePageSize,
    handlePage,
    filterParams,
    handleSearch,
    handlePayload,
    refetch,
  } = useListUjianBerjalan();

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

 
  return (
    <LayoutPage title="List Ujian Berjalan" isLoading={isFetching}>
      {analisiOpen && (
        <ModalPage open={analisiOpen} setOpen={setAnalisisOpen}>
          <AnalisisPage view={view} />
        </ModalPage>
      )}

      {penilaianOpen && (
        <ModalPage open={penilaianOpen} setOpen={setPenilaianOpen}>
          <PenilaianModal view={view} />
        </ModalPage>
      )}

      {updateOpen && (
        <ModalUpdateUjian
          id={idUpdate}
          open={updateOpen}
          setOpen={setUpdateOpen}
        />
      )}
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
        <Filter
          payload={params}
          handlePayload={handlePayload}
          setVisible={setVisible}
          handleClear={handleClear}
          onClick={handleFilter}
        />
      </Sidebar>
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

      <div className="space-y-5">
        <section className="flex items-center justify-between">
          <div>
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
          <div>
            {" "}
            <Button
              content={"Refresh"}
              type="button"
              icon={() => <Icon name="refresh" />}
              size="medium"
               color="facebook"
              onClick={() => {
                refetch();
              }}
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
                <Table.HeaderCell>Tujuan Pembelajaran</Table.HeaderCell>
                <Table.HeaderCell>Jenis Assesmen</Table.HeaderCell>
                <Table.HeaderCell>Tipe Assesmen</Table.HeaderCell>
                <Table.HeaderCell>Status</Table.HeaderCell>
                <Table.HeaderCell>Durasi</Table.HeaderCell>
                <Table.HeaderCell>Ujian dibuka</Table.HeaderCell>
                <Table.HeaderCell>Ujian ditutup</Table.HeaderCell>
                <Table.HeaderCell>Bertingkat</Table.HeaderCell>
                <Table.HeaderCell>Aksi</Table.HeaderCell>
                <Table.HeaderCell>Analisis</Table.HeaderCell>
                <Table.HeaderCell>Publish</Table.HeaderCell>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              <TableLoading
                count={20}
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
                      {value?.judul_ujian.slice(0, 20)}
                      {value?.judul_ujian?.length > 20 ? "..." : ""}
                    </Table.Cell>
                    <Table.Cell>
                      {<LabelStatus status={value?.jenis_ujian} />}
                    </Table.Cell>
                    <Table.Cell>
                      <LabelTipeUjian status={value?.tipe_ujian} />
                    </Table.Cell>
                    <Table.Cell>
                      <LabelTingkat status={value?.status} />
                    </Table.Cell>
                    <Table.Cell>{value?.durasi} Menit</Table.Cell>
                    <Table.Cell>
                      {dayjs(value.waktu_mulai)
                        .subtract(7, "hour")
                        .format("DD-MM-YY HH:mm:ss")}
                    </Table.Cell>
                    <Table.Cell>
                      {dayjs(value.waktu_selesai)
                        .subtract(7, "hour")
                        .format("DD-MM-YY HH:mm:ss")}
                    </Table.Cell>
                    <Table.Cell>
                      <LabelTingkat
                        status={
                          value?.is_hirarki === 1 ? value?.urutan : "Tidak"
                        }
                      />
                    </Table.Cell>
                    <Table.Cell>
                      <span className="flex items-center">
                        {" "}
                        <EditButton
                          onClick={() => {
                           setUpdateOpen(true)
                            setIdUpdate(value.id)
                          }}
                        />
                       
                      </span>
                    </Table.Cell>
                    <Table.Cell>
                      <Button
                        type="button"
                        color="twitter"
                        icon={() => <Icon name="chart line" />}
                        onClick={() => {
                          setView((s) => {
                            return {
                              ...s,
                              id: value.id,
                            };
                          });
                          setAnalisisOpen(true);
                        }}
                      />
                    </Table.Cell>
                    <Table.Cell>
                      {value?.status !== "draft" ? (
                        <Button
                          type="button"
                          color="facebook"
                          icon={() => <Icon name="laptop" />}
                          onClick={() => {
                            setView((s) => {
                              return {
                                ...s,
                                id: value.id,
                                mapel: value?.kelas?.nama_kelas,
                              };
                            });

                            console.log("pem", penilaianOpen);
                            setPenilaianOpen(true);
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
            page={params.page}
            pageSize={params.pageSize}
            setPage={handlePage}
            setPageSize={handlePageSize}
            totalPages={data?.data?.count}
          />
        </section>
      </div>
    </LayoutPage>
  );
}
