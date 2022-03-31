import React from "react";
import { useNavigate } from "react-router-dom";
import { listJadwal } from "../../api/guru/absensi";
import LayoutPage from "../../module/layoutPage";
import { Table, Dropdown, Button, Form, Select, Segment } from "semantic-ui-react";
import { useQuery } from "react-query";
import { TableLoading } from "../../components";

import { formatHari, formatTahun } from "../../utils";
export default function Jadwal() {
  const navigate = useNavigate();
  let date = new Date();
  let [hari, setHari] = React.useState(formatHari(new Date()));
  const parameter = {
    ...(hari !== "semua" && {
      hari,
    }),
  };
  let { data, isLoading, isFetching } = useQuery(
    //query key
    ["jadwal", parameter],
    //axios function,triggered when page/pageSize change
    () => listJadwal(parameter),
    //configuration
    {
      refetchInterval: 1000 * 60 * 60,
      select: (response) => {
        return response.data;
      },
    }
  );
  const dayOptions = [
    { key: "1", value: "semua", text: "Semua" },
    { key: "2", value: "senin", text: "Senin" },
    { key: "3", value: "selasa", text: "Selasa" },
    { key: "4", value: "rabu", text: "Rabu" },
    { key: "5", value: "kamis", text: "Kamis" },
    { key: "6", value: "jumat", text: "Jumat" },
    { key: "7", value: "sabtu", text: "Sabtu" },
    { key: "8", value: "minggu", text: "Minggu" },
  ];

  return (
    <LayoutPage title="jadwal">
      <div>
        <Form>
          <Form.Field
            control={Select}
            options={dayOptions}
            label={{
              children: "Hari",
              htmlFor: "hari",
              name: "hari",
            }}
            me="hari"
            id="hari"
            onChange={(event, data) => {
              setHari(data.value);
            }}
            value={hari}
            placeholder="Pilih Hari"
            search
            
            searchInput={{ id: "hari", name: "hari" }}
          />
        </Form>
      </div>
     <Segment raised> 
     <Table celled selectable>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell textAlign="center">No</Table.HeaderCell>
            <Table.HeaderCell>Hari</Table.HeaderCell>
            <Table.HeaderCell>Kelas</Table.HeaderCell>
            <Table.HeaderCell>Mata Pelajaran</Table.HeaderCell>
            <Table.HeaderCell textAlign="center">Jam_ke</Table.HeaderCell>
            <Table.HeaderCell>Semester</Table.HeaderCell>
            <Table.HeaderCell>Tahun Ajaran</Table.HeaderCell>
            <Table.HeaderCell textAlign="center">Aksi</Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          <TableLoading
            count={8}
            isLoading={isFetching}
            data={data?.data?.rows}
            messageEmpty={"Tidak Ada Jadwal Pelajaran"}
          >
            {data?.data?.rows?.map((value, index) => (
              <Table.Row key={index}>
                <Table.Cell textAlign="center">{index + 1}</Table.Cell>
                <Table.Cell>
                  <span className="capitalize">{value?.hari}</span>
                </Table.Cell>
                <Table.Cell>{value?.kelas?.nama_kelas}</Table.Cell>
                <Table.Cell>{value?.mapel?.nama_mapel}</Table.Cell>
                <Table.Cell textAlign="center">{value?.jam_ke}</Table.Cell>
                <Table.Cell>Semester {value?.semester}</Table.Cell>
                <Table.Cell>
                  {value?.tahun_ajaran?.nama_tahun_ajaran}
                </Table.Cell>
                <Table.Cell>
                  <Button
                    content={"Absensi"}
                    type="button"
                    fluid
                    size="medium"
                    color="green"
                    onClick={() => {
                      return navigate(
                        `/guru/jadwal/absensi/${value?.kelas?.id}/${
                          value?.mapel?.id
                        }/${formatTahun(date)}`
                      );
                    }}
                  />
                </Table.Cell>
              </Table.Row>
            ))}
          </TableLoading>
        </Table.Body>
      </Table>
     </Segment>
    </LayoutPage>
  );
}
