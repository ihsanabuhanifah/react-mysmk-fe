import React from "react";
import { useNavigate } from "react-router-dom";
import { belumAbsen, listJadwal } from "../../../api/guru/absensi";
import LayoutPage from "../../../module/layoutPage";
import { Table, Button, Form, Select, Icon } from "semantic-ui-react";
import { useQuery, useQueryClient } from "react-query";
import { TableLoading } from "../../../components";
import { absensiManualCreate } from "../../../api/guru/absensi";

import { showFormattedDate, formatHari, formatTahun } from "../../../utils";

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

  let { data, isLoading } = useQuery(
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
  let { data: dataBelumAbsen, isLoading: isLoadingBelumAbsen } = useQuery(
    //query key
    ["belum_absensi", parameter],
    //axios function,triggered when page/pageSize change
    () => belumAbsen(),
    //configuration
    {
      refetchInterval: 1000 * 60 * 60,
      select: (response) => {
        return response.data;
      },
    }
  );

  const [loading, setLoading] = React.useState(false);

  const creeteJadwal = async () => {
    setLoading(true);
    try {
      const response = await absensiManualCreate();
      // await halaqohManualCreate();
      setLoading(false);

      queryClient.invalidateQueries("notifikasi_absensi_halaqoh");
      queryClient.invalidateQueries("belum_absensi");
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
      <div className="space-y-5">
        <section  style={{ maxWidth: "100%" }} padded>
          <section className="grid grid-cols-1 lg:grid-cols-5 gap-5">
            <div className="col-span-1">
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
            </div>
            <div >
              <Button
                content={"Buat Absensi"}
                type="submit"
                fluid
                icon={() => <Icon name="add" />}
                loading={loading}
                size="medium"
                color="linkedin"
                disabled={loading}
                onClick={creeteJadwal}
              />
            </div>
            <div >
              <Button
                content={"Rekap Absensi"}
                type="button"
                fluid
                icon={() => <Icon name="newspaper outline" />}
                size="medium"
                color="teal"
                onClick={() => {
                  return navigate("/guru/absensi/rekap-kehadiran");
                }}
              />
            </div>
            <div >
              <Button
                content={"Rekap Agenda"}
                type="button"
                fluid
                icon={() => <Icon name="file alternate outline" />}
                size="medium"
                color="teal"
                onClick={() => {
                  return navigate("/guru/absensi/rekap-agenda");
                }}
              />
            </div>
            <div >
              <Button
                content={"Jadwal"}
                type="submit"
                fluid
                icon={() => <Icon name="add" />}
                loading={loading}
                size="medium"
                color="linkedin"
                disabled={loading}
                onClick={() => {
                  return navigate("/guru/absensi/jadwal");
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
                        icon={() => <Icon name="edit" />}
                        content={"Absensi"}
                        type="button"
                        fluid
                        size="medium"
                        color="teal"
                        onClick={() => {
                          return navigate(
                            `/guru/absensi/${value?.kelas?.id}/${
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
        </section>

        <section>
          <h3 className="text-2xl font-poppins">List Guru Belum Absensi</h3>
          <Table celled selectable>
            <Table.Header>
              <Table.Row>
                <Table.HeaderCell>No</Table.HeaderCell>
                <Table.HeaderCell>Tanggal</Table.HeaderCell>
                <Table.HeaderCell>Nama Guru</Table.HeaderCell>
                <Table.HeaderCell>Kelas</Table.HeaderCell>

                <Table.HeaderCell>Mata Pelajaran</Table.HeaderCell>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              <TableLoading
                count={8}
                isLoading={isLoadingBelumAbsen}
                data={dataBelumAbsen?.data}
                messageEmpty={"Tidak Ada Guru Belum Absen"}
              >
                {dataBelumAbsen?.data?.map((value, index) => (
                  <Table.Row key={index}>
                    <Table.Cell>{index + 1}</Table.Cell>
                    <Table.Cell>{showFormattedDate(value?.tanggal)}</Table.Cell>
                    <Table.Cell>{value?.teacher?.nama_guru}</Table.Cell>
                    <Table.Cell>{value?.kelas?.nama_kelas}</Table.Cell>
                    <Table.Cell>{value?.mapel?.nama_mapel}</Table.Cell>
                  </Table.Row>
                ))}
              </TableLoading>
            </Table.Body>
          </Table>
        </section>
      </div>
    </LayoutPage>
  );
}

export const dayOptions = [
  { key: "1", value: "semua", text: "Semua" },
  { key: "2", value: "senin", text: "Senin" },
  { key: "3", value: "selasa", text: "Selasa" },
  { key: "4", value: "rabu", text: "Rabu" },
  { key: "5", value: "kamis", text: "Kamis" },
  { key: "6", value: "jumat", text: "Jumat" },
  { key: "7", value: "sabtu", text: "Sabtu" },
  { key: "8", value: "minggu", text: "Minggu" },
];
