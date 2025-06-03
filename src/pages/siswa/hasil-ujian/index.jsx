import React, { useCallback, useEffect, useState } from "react";
import LayoutSiswa from "../../../module/layoutSiswa";
import {
  Button,
  Icon,
  Input,
  Loader,
  Menu,
  Select,
  Sidebar,
  Table,
} from "semantic-ui-react";
import { useListHasilUjian } from "../../../api/siswa/hasil_ujian";
import { PaginationTable, TableLoading } from "../../../components";
import {
  LabelStatus,
  LabelTingkat,
  LabelTipeUjian,
} from "../../../components/Label";
import { getOptionsText } from "../../../utils/format";
import { debounce } from "lodash";
import FilterHasilUjian from "./filterhasilujian";
import useList from "../../../hook/useList";
import dayjs from "dayjs";

export default function HasilUjian() {
  const {
    data,
    isFetching,
    params,
    setParams,
    loadMapel,
    dataMapel,
    loadKelas,
    dataKelas,
    handlePageSize,
    handlePage,
    refetch,
  } = useListHasilUjian();
  const [sMapel, setSMapel] = useState("Semua Mapel");
  let [visible, setVisible] = React.useState(false);
  const { dataGuru } = useList();

  const debouncedSearch = useCallback(
    debounce((value) => {
      setParams((prev) => ({
        ...prev,
        judul_ujian: value,
      }));
    }, 500),
    [setParams],
  );

  useEffect(() => {
    return () => {
      debouncedSearch.cancel();
    };
  }, [debouncedSearch]);

  return (
    <LayoutSiswa title="Hasil Ujian">
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
        <FilterHasilUjian
          params={params}
          setParams={setParams}
          setVisible={setVisible}
          dataMapel={dataMapel}
        />
      </Sidebar>
      <div className="mt-4 w-full px-5">
        <section className="grid grid-cols-4 gap-4">
          <div className="col-span-4 md:col-span-2">
            <Input
              fluid
              loading={false}
              icon="search"
              onChange={(e) => debouncedSearch(e.target.value)}
              iconPosition="left"
              placeholder="Search for judul ujian"
            />
          </div>
          <div className="col-span-2 md:col-span-1">
            <Button
              content={"Refetch"}
              type="button"
              fluid
              icon={() => <Icon name="refresh" />}
              size="medium"
              color="blue"
              onClick={() => {
                refetch();
              }}
            />
          </div>

          <div className="col-span-2 md:col-span-1">
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
      </div>
      {isFetching || loadMapel || loadKelas ? (
        <div className="ml-5 mt-[30px]">
          <Loader active inline="left" />
        </div>
      ) : (
        <div className="mt-4 w-full px-5">
          <Table className="ui celled structured table">
            <Table.Header>
              <Table.HeaderCell>No</Table.HeaderCell>
              <Table.HeaderCell>Mapel</Table.HeaderCell>
              <Table.HeaderCell>Nilai Ujian</Table.HeaderCell>
              <Table.HeaderCell>Nilai Akhir</Table.HeaderCell>

              <Table.HeaderCell>Ujian</Table.HeaderCell>
              <Table.HeaderCell>Nama Guru</Table.HeaderCell>
              <Table.HeaderCell>Kelas</Table.HeaderCell>
              <Table.HeaderCell>Bertingkat</Table.HeaderCell>
              <Table.HeaderCell>Status</Table.HeaderCell>
              <Table.HeaderCell>Durasi</Table.HeaderCell>
              <Table.HeaderCell>Ujian dibuka</Table.HeaderCell>
              <Table.HeaderCell>Ujian ditutup</Table.HeaderCell>
              <Table.HeaderCell>Tahun Ajaran</Table.HeaderCell>
            </Table.Header>
            <Table.Body>
              <TableLoading
                count={8}
                isLoading={isFetching}
                data={data?.data}
                messageEmpty="Data tidak ditemukan"
              >
                {data?.data.map((value, i) => (
                  <Table.Row key={i}>
                    <Table.Cell>{i + 1}</Table.Cell>
                    <Table.Cell>{value.mapel.nama_mapel}</Table.Cell>
                    <Table.Cell>
                      {!!value.exam === false
                        ? "-"
                        : value.exam
                            .replace(/[\[\]]/g, "")
                            .replace(/,\s*/g, " - ")}
                    </Table.Cell>
                    <Table.Cell>{value.exam_result}</Table.Cell>

                    <Table.Cell>
                      {<LabelStatus status={value.ujian.jenis_ujian} />}
                    </Table.Cell>
                    <Table.Cell>
                      {
                        dataGuru?.data?.filter(
                          (i) => i.id === value?.teacher_id,
                        )[0]["nama_guru"]
                      }
                    </Table.Cell>

                    <Table.Cell>
                      {value.kelas.nama_kelas.split(" ")[0]}
                    </Table.Cell>
                    <Table.Cell>
                      <LabelTingkat
                        status={
                          value?.is_hirarki === 1 ? value?.urutan : "Tidak"
                        }
                      />
                    </Table.Cell>
                    <Table.Cell>
                      <LabelTingkat status={value?.status} />
                    </Table.Cell>
                    <Table.Cell>{value?.ujian?.durasi} Menit</Table.Cell>
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
                      {value.tahun_ajaran.nama_tahun_ajaran}
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
            totalPages={data?.count}
          />
          <p className="text-red-400">*Nilai Akhir diberikan oleh guru</p>
        </div>
      )}
    </LayoutSiswa>
  );
}
