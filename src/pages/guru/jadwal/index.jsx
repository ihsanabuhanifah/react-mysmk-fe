import React from "react";
import { useNavigate } from "react-router-dom";
import { listJadwal } from "../../../api/guru/absensi";
import LayoutPage from "../../../module/layoutPage";
import {
  Table,
  Dropdown,
  Button,
  Form,
  Select,
  Segment,
} from "semantic-ui-react";
import { useQuery, useQueryClient } from "react-query";
import { TableLoading } from "../../../components";
import {
  absensiManualCreate,
  halaqohManualCreate,
  listAbsensi,
} from "../../../api/guru/absensi";

import { formatHari, formatTahun } from "../../../utils";

import { toast } from "react-toastify";
export default function Jadwal() {
  const navigate = useNavigate();
  let date = new Date();
  let queryClient = useQueryClient();
  let [hari, setHari] = React.useState(formatHari(new Date()));
  const parameter = {
    ...(hari !== "semua" && {
      hari,
    }),
  };
  let [dariTanggal] = React.useState(formatTahun(date));
  let [sampaiTanggal] = React.useState(formatTahun(date));
  let { data, isFetching } = useQuery(
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

  const [loading, setLoading] = React.useState(false);
  let params = {
    dariTanggal,
    sampaiTanggal,
  };
  let { data: absensi } = useQuery(
    //query key
    ["absensi", params],
    //axios function,triggered when page/pageSize change
    () => listAbsensi(params),
    //configuration
    {
      keepPreviousData: true,
      select: (response) => response.data,
    }
  );


  const creeteJadwal = async () => {
    setLoading(true);
    try {
      const response = await absensiManualCreate();
      await halaqohManualCreate();
      setLoading(false);
      queryClient.invalidateQueries("jadwal");
      queryClient.invalidateQueries("notifikasi_absensi_halaqoh");
      queryClient.invalidateQueries("absensi");
      queryClient.invalidateQueries("notifikasi_absensi_kelas");
      return toast.success(response?.data?.msg, {
        position: "top-right",
        autoClose: 1000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
      });
    } catch (err) {
      console.log(err);
      setLoading(false);
      return toast.error("Ada Kesalahan", {
        position: "top-right",
        autoClose: 1000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
      });
    }
  };

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
      <Segment  style={{ overflow: "auto", maxWidth: '100%' }} padded>
        <Table celled selectable>
          <Table.Header >
            <Table.Row> 
              <Table.HeaderCell>No</Table.HeaderCell>
              <Table.HeaderCell>Hari</Table.HeaderCell>
              <Table.HeaderCell>Kelas</Table.HeaderCell>
              <Table.HeaderCell>Mata Pelajaran</Table.HeaderCell>
              <Table.HeaderCell>Jam_ke</Table.HeaderCell>
              <Table.HeaderCell>Semester</Table.HeaderCell>
              <Table.HeaderCell>Tahun Ajaran</Table.HeaderCell>
              <Table.HeaderCell>Aksi</Table.HeaderCell>
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
                  <Table.Cell>{index + 1}</Table.Cell>
                  <Table.Cell>
                    <span className="capitalize">{value?.hari}</span>
                  </Table.Cell>
                  <Table.Cell>{value?.kelas?.nama_kelas}</Table.Cell>
                  <Table.Cell>{value?.mapel?.nama_mapel}</Table.Cell>
                  <Table.Cell>{value?.jam_ke}</Table.Cell>
                  <Table.Cell>Semester {value?.semester}</Table.Cell>
                  <Table.Cell>
                    {value?.tahun_ajaran?.nama_tahun_ajaran}
                  </Table.Cell>
                  <Table.Cell>
                    <Button
                      content={"Absensi"}
                      type="button"
                      fluid
                      disabled={absensi?.absensi?.length === 0 ? true :false}
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
      {absensi?.absensi?.length === 0 && (
        <Segment >
          <Button
            content={"Buat Absensi"}
            type="submit"
            fluid
            loading={loading}
            size="medium"
            color="green"
            disabled={loading}
            onClick={creeteJadwal}
          />
        </Segment>
      )}
    </LayoutPage>
  );
}
