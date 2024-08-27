import React from "react";
import LayoutSiswa from "../../../module/layoutSiswa";
import { Button, Table } from "semantic-ui-react";
import { TableLoading } from "../../../components";
import { useGetHasilBelajar } from "../../../api/siswa/hasil_belajar";
import { useNavigate } from "react-router-dom";

export default function HasilBelajar() {
  const navigate = useNavigate();
  const { data, isFetching } = useGetHasilBelajar();

  console.log(data);

  return (
    <LayoutSiswa title="Hasil Belajar">
      <div className="h-full pl-2 pr-5 w-full">
        <Table called basic>
          <Table.Header>
            <Table.HeaderCell>No</Table.HeaderCell>
            <Table.HeaderCell>Mapel</Table.HeaderCell>
            <Table.HeaderCell>Rata Nilai Tugas</Table.HeaderCell>
            <Table.HeaderCell>Rata Nilai Harian</Table.HeaderCell>
            <Table.HeaderCell>Rata Nilai PTS</Table.HeaderCell>
            <Table.HeaderCell>Rata Nilai PAS</Table.HeaderCell>
            <Table.HeaderCell>Rata Nilai US</Table.HeaderCell>
            <Table.HeaderCell>Nilai Akhir</Table.HeaderCell>
            <Table.HeaderCell>Deskripsi</Table.HeaderCell>
            <Table.HeaderCell>Aksi</Table.HeaderCell>
          </Table.Header>
          <Table.Body>
            <TableLoading
              count={10}
              isLoading={isFetching}
              data={data?.data}
              messageEmpty="Data tidak ditemukan"
            >
              {data?.data.map((value, i) => (
                <Table.Row key={i}>
                  <Table.Cell>{i + 1}</Table.Cell>
                  <Table.Cell>{value?.nama_mapel}</Table.Cell>
                  <Table.Cell>
                    {value?.hasil_belajar[0]?.rata_nilai_tugas ?? "-"}
                  </Table.Cell>
                  <Table.Cell>
                    {value?.hasil_belajar[0]?.rata_nilai_harian ?? "-"}
                  </Table.Cell>
                  <Table.Cell>
                    {value?.hasil_belajar[0]?.rata_nilai_pts ?? "-"}
                  </Table.Cell>
                  <Table.Cell>
                    {value?.hasil_belajar[0]?.rata_nilai_pas ?? "-"}
                  </Table.Cell>
                  <Table.Cell>
                    {value?.hasil_belajar[0]?.rata_nilai_us ?? "-"}
                  </Table.Cell>
                  <Table.Cell>
                    {value?.hasil_belajar[0]?.nilai ?? "-"}
                  </Table.Cell>
                  <Table.Cell>
                    {value?.hasil_belajar[0]?.deskripsi ?? "-"}
                  </Table.Cell>
                  <Table.Cell>
                    <Button
                      onClick={() =>
                        navigate(`/siswa/hasil-belajar/${value.id}`)
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
    </LayoutSiswa>
  );
}
