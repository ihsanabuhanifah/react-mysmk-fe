import React from "react";
import { useNavigate } from "react-router-dom";
import { Table, Button, Form, Select, Icon } from "semantic-ui-react";
import LayoutPage from "../../../module/layoutPage";
import { useQuery } from "react-query";
import { listJadwalAll } from "../../../api/guru/absensi";
import { formatHari, checkRole } from "../../../utils";
import { dayOptions } from ".";
import { TableLoading } from "../../../components";
import useList from "../../../hook/useList";
export default function ListJadwal() {
  let [hari, setHari] = React.useState(formatHari(new Date()));
  let navigate = useNavigate();
  const parameter = {
    ...(hari !== "semua" && {
      hari,
    }),
  };
  const { roles } = useList();
  let { data, isLoading } = useQuery(
    //query key
    ["jadwal", parameter],
    //axios function,triggered when page/pageSize change
    () => listJadwalAll(parameter),
    //configuration
    {
      refetchInterval: 1000 * 60 * 60,
      select: (response) => {
        return response.data;
      },
    }
  );
  return (
    <LayoutPage title={"List Jadwal Aktif"}>
      <section className="grid grid-cols-6 gap-5 mb-5">
        <Form>
          <Form.Field
            control={Select}
            options={dayOptions}
            // label={{
            //   children: "Hari",
            //   htmlFor: "hari",
            //   name: "hari",
            // }}
            name="hari"
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
        <div className=" col-start-6">
          {checkRole(roles, "Admin") && (
            <Button
              content={"Buat Jadwal"}
              type="submit"
              fluid
              icon={() => <Icon name="add" />}
              size="medium"
              color="linkedin"
              onClick={() => {
                return navigate("tambah");
              }}
            />
          )}
        </div>
      </section>
      <section className="" style={{ maxWidth: "100%" }} padded>
        <Table>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell>No</Table.HeaderCell>
              <Table.HeaderCell>Hari</Table.HeaderCell>
              <Table.HeaderCell>Nama Guru</Table.HeaderCell>
              <Table.HeaderCell>Kelas</Table.HeaderCell>
              <Table.HeaderCell>Mata Pelajaran</Table.HeaderCell>
              <Table.HeaderCell>Jam_ke</Table.HeaderCell>
              <Table.HeaderCell>Jumlah Jam</Table.HeaderCell>
              <Table.HeaderCell>Semester</Table.HeaderCell>
              <Table.HeaderCell>Tahun Ajaran</Table.HeaderCell>
              <Table.HeaderCell>Aksi</Table.HeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            <TableLoading
              count={9}
              isLoading={isLoading}
              data={data?.data?.rows}
              messageEmpty={"Tidak Ada Jadwal Pelajaran"}
            >
              {data?.data?.rows?.map((value, index) => (
                <Table.Row key={index}>
                  <Table.Cell>{index + 1}</Table.Cell>
                  <Table.Cell>
                    <span className="capitalize">{value?.hari}</span>
                  </Table.Cell>
                  <Table.Cell>{value?.teacher?.nama_guru}</Table.Cell>
                  <Table.Cell>{value?.kelas?.nama_kelas}</Table.Cell>

                  <Table.Cell>{value?.mapel?.nama_mapel}</Table.Cell>
                  <Table.Cell>{value?.jam_ke}</Table.Cell>
                  <Table.Cell>{value?.jumlah_jam}</Table.Cell>
                  <Table.Cell>Semester {value?.semester}</Table.Cell>
                  <Table.Cell>
                    {value?.tahun_ajaran?.nama_tahun_ajaran}
                  </Table.Cell>
                  <Table.Cell>
                    <div className="flex">
                      <Button
                        icon={() => <Icon name="edit" />}
                        content={"Edit"}
                        type="button"
                        fluid
                        size="small"
                        color="teal"
                        onClick={() => navigate(`/guru/absensi/jadwal/update/${value.id}`)}
                      />
                      <Button
                        icon={() => <Icon name="delete" />}
                        content={"Hapus"}
                        type="button"
                        fluid
                        size="small"
                        color="red"
                      />
                    </div>
                  </Table.Cell>
                </Table.Row>
              ))}
            </TableLoading>
          </Table.Body>
        </Table>
      </section>
    </LayoutPage>
  );
}
