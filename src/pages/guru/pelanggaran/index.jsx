import React from "react";
import LayoutPage from "../../../module/layoutPage";
import {
  Table,
  Dropdown,
  Input,
  Segment,
  Menu,
  Icon,
  Button,
} from "semantic-ui-react";
import { useQuery } from "react-query";
import FormPelanggaran from "./FormPelanggaran";
import { listPelanggaran } from "../../../api/guru/pelanggaran";

import {
  TableLoading,
  ModalFilter,
  EditButton,
  DeleteButton,
  ViewButton,
} from "../../../components";
import { handleViewNull, formatDate } from "../../../utils";

import useDebounce from "../../../hook/useDebounce";
import { pageSizeOptions } from "../../../utils/options";

export default function Pelanggaran() {
  let [page, setPage] = React.useState(1);
  let [pageSize, setPageSize] = React.useState(10);
  let [nama, setNama] = React.useState("");
  let debouncedName = useDebounce(nama, 600);

  let parameter = {
    page: page,
    pageSize: pageSize,
    nama_siswa: debouncedName,
  };

  let { data, isLoading, isFetching } = useQuery(
    //query key
    ["list_pelanggaran", parameter],
    //axios function,triggered when page/pageSize change
    () => listPelanggaran(parameter),
    //configuration
    {
      refetchInterval: 1000 * 60 * 60,
      select: (response) => {
        return response.data;
      },
    }
  );

  return (
    <LayoutPage title={"Pelanggaran"}>
      <FormPelanggaran data={data?.data?.rows} />
      <Segment>
        <div className="overflow-auto">
          <div className="space-x-2">
            <Input
              onChange={(e) => {
                setNama(e.target.value);
              }}
              value={nama}
              icon="search"
              placeholder="Nama Siswa..."
            />
            <Button
              type="button"
              color="teal"
              onClick={() => {
                return console.log("hhah");
              }}
              content="Buat Laporan"
            />
            <Table celled selectable>
              <Table.Header>
                <Table.Row>
                  <Table.HeaderCell textAlign="center">No</Table.HeaderCell>
                  <Table.HeaderCell>Nama Siswa</Table.HeaderCell>
                  <Table.HeaderCell>Tanggal</Table.HeaderCell>

                  <Table.HeaderCell>Nama Pelanggaran</Table.HeaderCell>
                  <Table.HeaderCell>Tipe Pelanggaran</Table.HeaderCell>
                  <Table.HeaderCell>Jenis Pelanggaran</Table.HeaderCell>
                  <Table.HeaderCell textAlign="center">Status</Table.HeaderCell>
                  <Table.HeaderCell content>Tindakan/Hukuman</Table.HeaderCell>
                  <Table.HeaderCell>Guru Pelapor</Table.HeaderCell>
                  <Table.HeaderCell>Guru Penindak</Table.HeaderCell>
                  <Table.HeaderCell>Semester</Table.HeaderCell>
                  <Table.HeaderCell singleLine>Tahun Ajaran</Table.HeaderCell>
                  <Table.HeaderCell singleLine>Aksi</Table.HeaderCell>
                </Table.Row>
              </Table.Header>
              <Table.Body>
                <TableLoading
                  count={13}
                  isLoading={isLoading}
                  data={data?.data?.rows}
                  messageEmpty={"Tidak Ada Pengajuan Izin"}
                >
                  {data?.data?.rows?.map((value, index) => (
                    <Table.Row key={index}>
                      <Table.Cell textAlign="center">{index + 1}</Table.Cell>
                      <Table.Cell>
                        <span className="capitalize">
                          {handleViewNull(value?.siswa?.nama_siswa)}
                        </span>
                      </Table.Cell>
                      <Table.Cell>{formatDate(value?.tanggal)}</Table.Cell>

                      <Table.Cell textAlign="left">
                        {handleViewNull(value?.pelanggaran?.nama_pelanggaran)}
                      </Table.Cell>
                      <Table.Cell textAlign="left">
                        <span className="capitalize">
                          {" "}
                          {handleViewNull(value?.pelanggaran?.tipe)}
                        </span>
                      </Table.Cell>
                      <Table.Cell textAlign="left">
                        <span className="capitalize">
                          {" "}
                          {handleViewNull(value?.pelanggaran?.kategori)}
                        </span>
                      </Table.Cell>
                      <Table.Cell textAlign="left">
                        {handleViewNull(value?.status)}
                      </Table.Cell>
                      <Table.Cell textAlign="left">
                        {handleViewNull(value?.tindakan)}
                      </Table.Cell>
                      <Table.Cell textAlign="left">
                        <span className="capitalize">
                          {" "}
                          {handleViewNull(value?.pelaporan?.nama_guru)}
                        </span>
                      </Table.Cell>
                      <Table.Cell textAlign="left">
                        <span className="capitalize">
                          {" "}
                          {handleViewNull(value?.penindakan?.nama_guru)}
                        </span>
                      </Table.Cell>
                      <Table.Cell textAlign="left">
                        {handleViewNull(value?.semester)}
                      </Table.Cell>
                      <Table.Cell textAlign="left">
                        {handleViewNull(value?.tahun_ajaran?.nama_tahun_ajaran)}
                      </Table.Cell>
                      <Table.Cell textAlign="left">
                        <div className="flex items-center">
                          {" "}
                          <EditButton />
                          <DeleteButton />
                          <ViewButton />
                        </div>
                      </Table.Cell>
                    </Table.Row>
                  ))}
                </TableLoading>
              </Table.Body>
              <Table.Footer>
                <Table.Row>
                  <Table.HeaderCell colSpan="13">
                    <Dropdown
                      value={pageSize}
                      selection
                      compact
                      className="absolute"
                      header
                      labeled
                      onChange={(e, data) => {
                        setPageSize(data.value);
                      }}
                      search
                      options={pageSizeOptions}
                    />
                    <Menu floated="right" pagination>
                      <Menu.Item as="a" icon>
                        <Icon name="chevron left" />
                      </Menu.Item>
                      <Menu.Item as="a">1</Menu.Item>
                      <Menu.Item as="a">2</Menu.Item>
                      <Menu.Item as="a">3</Menu.Item>
                      <Menu.Item as="a">4</Menu.Item>
                      <Menu.Item as="a" icon>
                        <Icon name="chevron right" />
                      </Menu.Item>
                    </Menu>
                  </Table.HeaderCell>
                </Table.Row>
              </Table.Footer>
            </Table>
          </div>
        </div>
      </Segment>
    </LayoutPage>
  );
}
