import React from "react";
import LayoutSiswa from "../../../module/layoutSiswa";
import {
  Button,
  Icon,
  Input,
  Loader,
  Menu,
  Sidebar,
  Table,
  TableRow,
} from "semantic-ui-react";
import { TableLoading } from "../../../components";
import { useGetHasilBelajar } from "../../../api/siswa/hasil_belajar";
import { useNavigate } from "react-router-dom";
import { IoFilterOutline } from "react-icons/io5";
import FilterHasilBelajar from "./filter";
import { format, parseISO } from "date-fns";

export default function Rapor() {
  const navigate = useNavigate();
  const { data, isFetching, setParams, dataTa, params, dataKelas } =
    useGetHasilBelajar();
  let [visible, setVisible] = React.useState(false);

  return (
    <LayoutSiswa title="Rapor">
      <>
        {isFetching ? (
          <div className="mt-[30px] ml-5">
            <Loader active inline="left" />
          </div>
        ) : (
          <>
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
              <FilterHasilBelajar
                params={params}
                setParams={setParams}
                setVisible={setVisible}
                dataTa={dataTa}
                dataKelas={dataKelas}
              />
            </Sidebar>
            <div className="mt-4 w-full px-5">
              <section className="grid grid-cols-4 gap-4">
                <div className="col-span-4 md:col-span-3">
                  <Input
                    fluid
                    loading={false}
                    icon="search"
                    onChange={(e) => {
                      setParams((prev) => {
                        return {
                          ...prev,
                          nama_mapel: e.target.value,
                        };
                      });
                    }}
                    iconPosition="left"
                    placeholder="Search..."
                  />
                </div>
                <div className="col-span-4 md:col-span-1">
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
              <Table className="ui celled structured table">
                <Table.Header>
                  <TableRow>
                    <Table.HeaderCell rowspan={2}>No</Table.HeaderCell>
                    <Table.HeaderCell rowspan={2}>Mapel</Table.HeaderCell>
                    <Table.HeaderCell rowspan={2}>Kelas</Table.HeaderCell>
                    <Table.HeaderCell rowspan={2}>
                      Tahun Ajaran
                    </Table.HeaderCell>
                    <Table.HeaderCell colspan={5}>
                      Rata-Rata Nilai
                    </Table.HeaderCell>
                    <Table.HeaderCell rowspan={2}>Nilai Akhir</Table.HeaderCell>
                    <Table.HeaderCell rowspan={2}>Deskripsi</Table.HeaderCell>
                    <Table.HeaderCell rowspan={2}>Tanggal</Table.HeaderCell>
                    <Table.HeaderCell rowspan={2}>Aksi</Table.HeaderCell>
                  </TableRow>
                  <TableRow>
                    <Table.HeaderCell>Tugas</Table.HeaderCell>
                    <Table.HeaderCell>Harian</Table.HeaderCell>
                    <Table.HeaderCell>PTS</Table.HeaderCell>
                    <Table.HeaderCell>PAS</Table.HeaderCell>
                    <Table.HeaderCell>US</Table.HeaderCell>
                  </TableRow>
                </Table.Header>
                <Table.Body>
                  <TableLoading
                    count={13}
                    isLoading={isFetching}
                    data={data?.data}
                    messageEmpty="Data tidak ditemukan"
                  >
                    {data?.data.map((value, i) => (
                      <Table.Row key={i}>
                        <Table.Cell>{i + 1}</Table.Cell>
                        <Table.Cell>{value?.mapel?.nama_mapel}</Table.Cell>
                        <Table.Cell>{value?.kelas?.nama_kelas}</Table.Cell>
                        <Table.Cell>
                          {value?.tahun_ajaran?.nama_tahun_ajaran}
                        </Table.Cell>
                        <Table.Cell>
                          {value?.rata_nilai_tugas ?? "-"}
                        </Table.Cell>
                        <Table.Cell>
                          {value?.rata_nilai_harian ?? "-"}
                        </Table.Cell>
                        <Table.Cell>{value?.rata_nilai_pts ?? "-"}</Table.Cell>
                        <Table.Cell>{value?.rata_nilai_pas ?? "-"}</Table.Cell>
                        <Table.Cell>{value?.rata_nilai_us ?? "-"}</Table.Cell>
                        <Table.Cell>{value?.nilai ?? "-"}</Table.Cell>
                        <Table.Cell>{value?.deskripsi ?? "-"}</Table.Cell>
                        <Table.Cell>
                          {format(parseISO(value?.createdAt), "yyyy-MM-dd")}
                        </Table.Cell>
                        <Table.Cell>
                          <Button
                            onClick={() =>
                              navigate(
                                `/siswa/rapor/${value.mapel.id}/${value?.tahun_ajaran?.id}`,
                              )
                            }
                            content="Detail"
                            type="button"
                            size="medium"
                            color="green"
                          />
                        </Table.Cell>
                      </Table.Row>
                    ))}
                  </TableLoading>
                </Table.Body>
              </Table>
            </div>
          </>
        )}
      </>
    </LayoutSiswa>
  );
}
