import { Tab, Table, Label, Form, Button, Icon } from "semantic-ui-react";
import { useAbsensiHarian } from "../../../api/guru/absensi";
import LayoutPage from "../../../module/layoutPage";
import { Input, TableLoading } from "../../../components";
import { izinOptions } from "../../../utils/options";
import { enIE } from "date-fns/locale";
import clsx from "clsx";

export default function Harian() {
  const { isLoading, data, isFetching, setParams, params, refetch } =
    useAbsensiHarian();

  console.log("data", data);
  return (
    <LayoutPage title={"Rekap Harian"}>
      <div className="grid grid-cols-5 gap-5 ">
        <div className="col-span-2">
          {" "}
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
        <div className="flex items-end">
          <Button
            content={"Refresh Data"}
            type="button"
            fluid
            icon={() => <Icon name="refresh" />}
            size="medium"
            color="blue"
            onClick={() => {
              return refetch();
            }}
          />
        </div>
      </div>
      <Table>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell>Rombel</Table.HeaderCell>
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
            isLoading={isFetching}
            data={data?.agenda}
            messageEmpty={
              "Tidak Terdapat Riwayat Absensi pada tanggal yang dipilih"
            }
          >
            {data &&
              data?.agenda?.map((item, index) => (
                <Table.Row className={clsx({'bg-gray-200' : index % 2 === 0})} key={index}>
                  <Table.Cell>{item.nama_kelas}</Table.Cell>
                  {[1, 2, 3, 4, 5, 6, 7, 8]?.map((i) => (
                    <Table.Cell >
                      <div className={clsx(`grid grid-cols-1 gap-1`, {
                        
                      })}>
                       <span  className="text-xs">{
                            item?.agendas?.filter(
                              (x) => x.agenda.jam_ke === i
                            )?.[0]?.agenda?.materi || "-"
                          }</span>

                        <span className="text-xs font-bold">
                        {`${
                            item?.agendas?.filter(
                              (x) => x.agenda.jam_ke === i
                            )?.[0]?.agenda?.mapel?.nama_mapel
                          } - ${
                            item?.agendas?.filter(
                              (x) => x.agenda.jam_ke === i
                            )?.[0]?.agenda?.teacher?.nama_guru
                          }`}
                        </span>

                        <span>{ item?.agendas?.filter(
                              (x) => x.agenda.jam_ke === i
                            )?.[0]?.siswa.length === 0
                              ? "-"
                              : item?.agendas
                                  ?.filter((x) => x.agenda.jam_ke === i)?.[0]
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
                                  ))}</span>
                      </div>
                    </Table.Cell>
                  ))}
                </Table.Row>
              ))}
          </TableLoading>
        </Table.Body>
      </Table>
    </LayoutPage>
  );
}