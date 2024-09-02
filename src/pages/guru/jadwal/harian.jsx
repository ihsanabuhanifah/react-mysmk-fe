import { Tab, Table, Label, Form } from "semantic-ui-react";
import { useAbsensiHarian } from "../../../api/guru/absensi";
import LayoutPage from "../../../module/layoutPage";
import { Input, TableLoading } from "../../../components";
import { izinOptions } from "../../../utils/options";
import { enIE } from "date-fns/locale";

export default function Harian() {
  const { isLoading, data, isFetching, setParams, params, refetch } =
    useAbsensiHarian();

  console.log("data", data);
  return (
    <LayoutPage title={"Rekap Harian"}>
      <div>
        <Form>
          <Form.Field
            control={Input}
            label="Tanggal"
            name="email"
            onChange={(e) => {
              setParams((v) => {
                return {
                  ...v,
                  tanggal: e.target.value,
                };
              });
            }}
            value={params.tanggal}
            type="date"
          />
        </Form>
      </div>
      <Table>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell>Mata Pelajaran</Table.HeaderCell>
            <Table.HeaderCell>Jam Ke-1</Table.HeaderCell>
            <Table.HeaderCell>Jam Ke-2</Table.HeaderCell>
            <Table.HeaderCell>Jam Ke-3</Table.HeaderCell>
            <Table.HeaderCell>Jam Ke-4</Table.HeaderCell>
            <Table.HeaderCell>Jam Ke-5</Table.HeaderCell>
            <Table.HeaderCell>Jam Ke-6</Table.HeaderCell>
            <Table.HeaderCell>Jam Ke-7</Table.HeaderCell>
            <Table.HeaderCell>Jam Ke-8</Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          <TableLoading
            count={8}
            isLoading={isLoading}
            data={data?.agenda}
            messageEmpty={
              "Tidak Terdapat Riwayat Absensi pada tanggal yang dipilih"
            }
          >
            {data &&
              data?.agenda?.map((item, index) => (
                <Table.Row key={index}>
                  <Table.Cell>{item.nama_kelas}</Table.Cell>
                  <Table.Cell>
                    <div className="grid grid-cols-1 gap-1">
                      <Label
                        size="tiny"
                        content={
                          item?.agendas?.filter(
                            (x) => x.agenda.jam_ke === 1
                          )?.[0]?.agenda?.materi || "-"
                        }
                        color="teal"
                        as={"a"}
                      />

                      <Label
                        size="tiny"
                        content={
                          item?.agendas?.filter(
                            (x) => x.agenda.jam_ke === 1
                          )?.[0]?.agenda?.mapel?.nama_mapel || "-"
                        }
                        color="blue"
                        as={"a"}
                      />
                      <Label
                        size="tiny"
                        content={
                          item?.agendas?.filter(
                            (x) => x.agenda.jam_ke === 1
                          )?.[0]?.agenda?.teacher?.nama_guru || "-"
                        }
                        color="olive"
                        as={"a"}
                      />

                      <Label
                        size="tiny"
                        content={
                          item?.agendas?.filter(
                            (x) => x.agenda.jam_ke === 1
                          )?.[0]?.agenda?.teacher?.nama_guru || "-"
                        }
                        color="olive"
                        as={"a"}
                      />

                      <Label
                        size="tiny"
                        color="green"
                        content={item?.agendas
                          ?.filter((x) => x.agenda.jam_ke === 1)?.[0]
                          ?.siswa?.map((y) => (
                            <i>
                              {y.siswa.nama_siswa} ({" "}
                              {
                                izinOptions.filter(
                                  (v) => v.value == y.status_kehadiran
                                )?.[0]?.["text"]
                              }
                              ),
                            </i>
                          ))}
                        as={"a"}
                      />
                    </div>
                  </Table.Cell>
                  <Table.Cell>
                    <div className="grid grid-cols-1 gap-1">
                      <Label
                        size="tiny"
                        content={
                          item?.agendas?.filter(
                            (x) => x.agenda.jam_ke === 2
                          )?.[0]?.agenda?.materi || "-"
                        }
                        color="teal"
                        as={"a"}
                      />

                      <Label
                        size="tiny"
                        content={
                          item?.agendas?.filter(
                            (x) => x.agenda.jam_ke === 2
                          )?.[0]?.agenda?.mapel?.nama_mapel || "-"
                        }
                        color="blue"
                        as={"a"}
                      />
                      <Label
                        size="tiny"
                        content={
                          item?.agendas?.filter(
                            (x) => x.agenda.jam_ke === 2
                          )?.[0]?.agenda?.teacher?.nama_guru || "-"
                        }
                        color="olive"
                        as={"a"}
                      />
                       <Label
                        size="tiny"
                        content={
                          item?.agendas?.filter(
                            (x) => x.agenda.jam_ke === 2
                          )?.[0]?.agenda?.teacher?.nama_guru || "-"
                        }
                        color="olive"
                        as={"a"}
                      />

                      <Label
                        size="tiny"
                        color="green"
                        content={item?.agendas
                          ?.filter((x) => x.agenda.jam_ke === 2)?.[0]
                          ?.siswa?.map((y) => (
                            <i>
                              {y.siswa.nama_siswa} ({" "}
                              {
                                izinOptions.filter(
                                  (v) => v.value == y.status_kehadiran
                                )?.[0]?.["text"]
                              }
                              ),
                            </i>
                          ))}
                        
                        as={"a"}
                      />
                    </div>
                  </Table.Cell>
                  <Table.Cell>
                    <div className="grid grid-cols-1 gap-1">
                      <Label
                        size="tiny"
                        content={
                          item?.agendas?.filter(
                            (x) => x.agenda.jam_ke === 3
                          )?.[0]?.agenda?.materi || "-"
                        }
                        color="teal"
                        as={"a"}
                      />

                      <Label
                        size="tiny"
                        content={
                          item?.agendas?.filter(
                            (x) => x.agenda.jam_ke === 3
                          )?.[0]?.agenda?.mapel?.nama_mapel || "-"
                        }
                        color="blue"
                        as={"a"}
                      />
                      <Label
                        size="tiny"
                        content={
                          item?.agendas?.filter(
                            (x) => x.agenda.jam_ke === 3
                          )?.[0]?.agenda?.teacher?.nama_guru || "-"
                        }
                        color="olive"
                        as={"a"}
                      />
                       <Label
                        size="tiny"
                        content={
                          item?.agendas?.filter(
                            (x) => x.agenda.jam_ke === 3
                          )?.[0]?.agenda?.teacher?.nama_guru || "-"
                        }
                        color="olive"
                        as={"a"}
                      />

                      <Label
                        size="tiny"
                        color="green"
                        content={item?.agendas
                          ?.filter((x) => x.agenda.jam_ke === 3)?.[0]
                          ?.siswa?.map((y) => (
                            <i>
                              {y.siswa.nama_siswa} ({" "}
                              {
                                izinOptions.filter(
                                  (v) => v.value == y.status_kehadiran
                                )?.[0]?.["text"]
                              }
                              ),
                            </i>
                          ))}
                        
                        as={"a"}
                      />
                    </div>
                  </Table.Cell>
                  <Table.Cell>
                    <div className="grid grid-cols-1 gap-1">
                      <Label
                        size="tiny"
                        content={
                          item?.agendas?.filter(
                            (x) => x.agenda.jam_ke === 4
                          )?.[0]?.agenda?.materi || "-"
                        }
                        color="teal"
                        as={"a"}
                      />

                      <Label
                        size="tiny"
                        content={
                          item?.agendas?.filter(
                            (x) => x.agenda.jam_ke === 4
                          )?.[0]?.agenda?.mapel?.nama_mapel || "-"
                        }
                        color="blue"
                        as={"a"}
                      />
                      <Label
                        size="tiny"
                        content={
                          item?.agendas?.filter(
                            (x) => x.agenda.jam_ke === 4
                          )?.[0]?.agenda?.teacher?.nama_guru || "-"
                        }
                        color="olive"
                        as={"a"}
                      />
                    </div>
                  </Table.Cell>
                  <Table.Cell>
                    <div className="grid grid-cols-1 gap-1">
                      <Label
                        size="tiny"
                        content={
                          item?.agendas?.filter(
                            (x) => x.agenda.jam_ke === 5
                          )?.[0]?.agenda?.materi || "-"
                        }
                        color="teal"
                        as={"a"}
                      />

                      <Label
                        size="tiny"
                        content={
                          item?.agendas?.filter(
                            (x) => x.agenda.jam_ke === 5
                          )?.[0]?.agenda?.mapel?.nama_mapel || "-"
                        }
                        color="blue"
                        as={"a"}
                      />
                      <Label
                        size="tiny"
                        content={
                          item?.agendas?.filter(
                            (x) => x.agenda.jam_ke === 5
                          )?.[0]?.agenda?.teacher?.nama_guru || "-"
                        }
                        color="olive"
                        as={"a"}
                      />
                    </div>
                  </Table.Cell>
                  <Table.Cell>
                    <div className="grid grid-cols-1 gap-1">
                      <Label
                        size="tiny"
                        content={
                          item?.agendas?.filter(
                            (x) => x.agenda.jam_ke === 6
                          )?.[0]?.agenda?.materi || "-"
                        }
                        color="teal"
                        as={"a"}
                      />

                      <Label
                        size="tiny"
                        content={
                          item?.agendas?.filter(
                            (x) => x.agenda.jam_ke === 6
                          )?.[0]?.agenda?.mapel?.nama_mapel || "-"
                        }
                        color="blue"
                        as={"a"}
                      />
                      <Label
                        size="tiny"
                        content={
                          item?.agendas?.filter(
                            (x) => x.agenda.jam_ke === 6
                          )?.[0]?.agenda?.teacher?.nama_guru || "-"
                        }
                        color="olive"
                        as={"a"}
                      />

                      <Label
                        size="tiny"
                        color="green"
                        content={item?.agendas
                          ?.filter((x) => x.agenda.jam_ke === 6)?.[0]
                          ?.siswa?.map((y) => (
                            <i>
                              {y.siswa.nama_siswa} ({" "}
                              {
                                izinOptions.filter(
                                  (v) => v.value == y.status_kehadiran
                                )?.[0]?.["text"]
                              }
                              ),
                            </i>
                          ))}
                        as={"a"}
                      />
                    </div>
                  </Table.Cell>
                  <Table.Cell>
                    <div className="grid grid-cols-1 gap-1">
                      <Label
                        size="tiny"
                        content={
                          item?.agendas?.filter(
                            (x) => x.agenda.jam_ke === 7
                          )?.[0]?.agenda?.materi || "-"
                        }
                        color="teal"
                        as={"a"}
                      />

                      <Label
                        size="tiny"
                        content={
                          item?.agendas?.filter(
                            (x) => x.agenda.jam_ke === 7
                          )?.[0]?.agenda?.mapel?.nama_mapel || "-"
                        }
                        color="blue"
                        as={"a"}
                      />
                      <Label
                        size="tiny"
                        content={
                          item?.agendas?.filter(
                            (x) => x.agenda.jam_ke === 7
                          )?.[0]?.agenda?.teacher?.nama_guru || "-"
                        }
                        color="olive"
                        as={"a"}
                      />
                    </div>
                  </Table.Cell>
                  <Table.Cell>
                    <div className="grid grid-cols-1 gap-1">
                      <Label
                        size="tiny"
                        content={
                          item?.agendas?.filter(
                            (x) => x.agenda.jam_ke === 8
                          )?.[0]?.agenda?.materi || "-"
                        }
                        color="teal"
                        as={"a"}
                      />

                      <Label
                        size="tiny"
                        content={
                          item?.agendas?.filter(
                            (x) => x.agenda.jam_ke === 8
                          )?.[0]?.agenda?.mapel?.nama_mapel || "-"
                        }
                        color="blue"
                        as={"a"}
                      />
                      <Label
                        size="tiny"
                        content={
                          item?.agendas?.filter(
                            (x) => x.agenda.jam_ke === 8
                          )?.[0]?.agenda?.teacher?.nama_guru || "-"
                        }
                        color="olive"
                        as={"a"}
                      />
                    </div>
                  </Table.Cell>
                </Table.Row>
              ))}
          </TableLoading>
        </Table.Body>
      </Table>
    </LayoutPage>
  );
}
