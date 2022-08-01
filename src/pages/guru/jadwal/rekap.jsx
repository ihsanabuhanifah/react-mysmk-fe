import React from "react";
import {
  Table,
  Dropdown,
  Button,
  Form,
  Select,
  Segment,
  Input,
  Sidebar,
  Menu,
  Icon,
} from "semantic-ui-react";
import Filter from "./filter";

import { TableLoading } from "../../../components";
import LayoutPage from "../../../module/layoutPage";
export default function RekapAbsensi(  ) {
    let [visible, setVisible] = React.useState(false);
  return (
    <LayoutPage
      title={"Rekap Absensi"}
      visible={visible}
      setVisible={setVisible}
    >
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
        <Filter  />
      </Sidebar>
      <Segment>
        <section className="grid grid-cols-6 gap-5">
          <div className="col-span-2">
            <Input
              classN
              fluid
              loading={false}
              icon="search"
              iconPosition="left"
              placeholder="Search..."
            />
          </div>
          <div className="">
            <Button
              content={"Filter"}
              type="button"
              fluid
              size="medium"
              color="teal"
              onClick={() => {
                setVisible(!visible);
              }}
            />
          </div>
        </section>
        <Table celled selectable>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell>No</Table.HeaderCell>
              <Table.HeaderCell>Hari</Table.HeaderCell>
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
              count={8}
              //   isLoading={isLoading}
              //   data={data?.data?.rows}
              messageEmpty={"Tidak Ada Jadwal Pelajaran"}
            >
              {/* {data?.data?.rows?.map((value, index) => (
                <Table.Row key={index}>
                  <Table.Cell>{index + 1}</Table.Cell>
                  <Table.Cell>
                    <span className="capitalize">{value?.hari}</span>
                  </Table.Cell>
                  <Table.Cell>{value?.kelas?.nama_kelas}</Table.Cell>
                  <Table.Cell>{value?.mapel?.nama_mapel}</Table.Cell>
                  <Table.Cell>{value?.jam_ke}</Table.Cell>
                  <Table.Cell>{value?.jumlah_jam}</Table.Cell>
                  <Table.Cell>Semester {value?.semester}</Table.Cell>
                  <Table.Cell>
                    {value?.tahun_ajaran?.nama_tahun_ajaran}
                  </Table.Cell>
                  <Table.Cell>
                    <Button
                      content={"Absensi"}
                      type="button"
                      fluid
                      // disabled={absensi?.absensi?.length === 0 ? true : false}
                      size="medium"
                      color="green"
                      onClick={() => {
                        // return navigate(
                        //   `/guru/jadwal/absensi/${value?.kelas?.id}/${
                        //     value?.mapel?.id
                        //   }/${formatTahun(date)}`
                        // );
                      }}
                    />
                  </Table.Cell>
                </Table.Row>
              ))} */}
            </TableLoading>
          </Table.Body>
        </Table>
      </Segment>
    </LayoutPage>
  );
}
