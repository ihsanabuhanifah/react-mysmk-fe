import React, { useState } from "react";
import { Table, Button, Form } from "semantic-ui-react";
import Select from "react-select";
import { useParams } from "react-router-dom";
import { useNilaiSiswa, useNilaiDetail } from "./profile";
import LoadingPage from "../../../../components/LoadingPage";
import { TableWrapper } from "../../../../components/TableWrap";
import NilaiDetailComponent from "./detailNilai";

const NilaiComponent = () => {
  const { id } = useParams();
  const [selectedDetail, setSelectedDetail] = useState(null);
  const [filters, setFilters] = useState({
    mapel_id: null,
    ta_id: null,
  });

  const {
    data: nilaiData,
    isLoading: isLoadingNilai,
    error: errorNilai,
  } = useNilaiSiswa(id);

  const handleDetailClick = (mapelId) => {
    setSelectedDetail(mapelId);
  };

  const handleBackClick = () => {
    setSelectedDetail(null);
  };

  const handleFilterChange = (key, value) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      [key]: value,
    }));
  };

  const filteredNilaiData = nilaiData?.data?.filter((nilai) => {
    return (
      (!filters.mapel_id || nilai.id === filters.mapel_id) &&
      (!filters.ta_id ||
        nilai.hasil_belajar.some((hb) => hb.ta_id === filters.ta_id))
    );
  });

  if (isLoadingNilai) {
    return <LoadingPage />;
  }

  if (errorNilai) {
    return <div>Error fetching nilai data</div>;
  }

  return (
    <div>
      {!selectedDetail ? (
        <div>
          <Form>
            <Form.Group widths="equal">
              <Form.Field>
                <label>Mata Pelajaran</label>
                <Select
                  options={nilaiData?.data?.map((nilai) => ({
                    value: nilai.id,
                    label: nilai.nama_mapel,
                  }))}
                  placeholder="Pilih Mata Pelajaran"
                  onChange={(selectedOption) =>
                    handleFilterChange("mapel_id", selectedOption?.value || null)
                  }
                  isClearable
                  styles={{
                    menu: (provided) => ({ ...provided, zIndex: 9999}),
                  }}
                />
              </Form.Field>
            </Form.Group>
          </Form>

          <TableWrapper>
            <Table>
              <Table.Header>
                <Table.Row>
                  <Table.HeaderCell>No</Table.HeaderCell>
                  <Table.HeaderCell>Mata Pelajaran</Table.HeaderCell>
                  <Table.HeaderCell>Tugas</Table.HeaderCell>
                  <Table.HeaderCell>Harian</Table.HeaderCell>
                  <Table.HeaderCell>PTS</Table.HeaderCell>
                  <Table.HeaderCell>PAS</Table.HeaderCell>
                  <Table.HeaderCell>US</Table.HeaderCell>
                  <Table.HeaderCell>Nilai Akhir</Table.HeaderCell>
                  <Table.HeaderCell>Aksi</Table.HeaderCell>
                </Table.Row>
              </Table.Header>
              <Table.Body>
                {filteredNilaiData?.map((nilai, index) => (
                  <Table.Row key={nilai.id}>
                    <Table.Cell>{index + 1}</Table.Cell>
                    <Table.Cell>{nilai.nama_mapel}</Table.Cell>
                    <Table.Cell>{nilai.hasil_belajar[0]?.rata_nilai_tugas ?? '-'}</Table.Cell>
                    <Table.Cell>{nilai.hasil_belajar[0]?.rata_nilai_harian ?? '-'}</Table.Cell>
                    <Table.Cell>{nilai.hasil_belajar[0]?.rata_nilai_pts ?? '-'}</Table.Cell>
                    <Table.Cell>{nilai.hasil_belajar[0]?.rata_nilai_pas ?? '-'}</Table.Cell>
                    <Table.Cell>{nilai.hasil_belajar[0]?.rata_nilai_us ?? '-'}</Table.Cell>
                    <Table.Cell>{nilai.hasil_belajar[0]?.nilai ?? '-'}</Table.Cell>
                    <Table.Cell>
                      <Button
                        content="Detail"
                        color="teal"
                        onClick={() => handleDetailClick(nilai.id)}
                      />
                    </Table.Cell>
                  </Table.Row>
                ))}
              </Table.Body>
            </Table>
          </TableWrapper>
        </div>
      ) : (
        <NilaiDetailContainer
          mapelId={selectedDetail}
          siswaId={id}
          onBackClick={handleBackClick}
        />
      )}
    </div>
  );
};

const NilaiDetailContainer = ({ mapelId, siswaId, onBackClick }) => {
  const { data: nilaiDetailData, isLoading, error } = useNilaiDetail(mapelId, siswaId);

  if (isLoading) {
    return <LoadingPage />;
  }

  if (error) {
    return <div>Error fetching detail data</div>;
  }

  return (
    <NilaiDetailComponent
      nilaiDetailData={nilaiDetailData?.data}
      onBackClick={onBackClick}
    />
  );
};

export default NilaiComponent;
