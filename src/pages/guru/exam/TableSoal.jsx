import React from "react";

import { Icon, Table, Checkbox, Input } from "semantic-ui-react";

import { TableLoading, ViewButton } from "../../../components";

import { PaginationTable } from "../../../components";
import { LabelStatus, LabelTipeUjian } from "../../../components/Label";

const TableSoal = ({
  data,
  value,
  setFieldValue,
  isLoading,
  index,
  setPreview,
  setOpen,
  page,
  setPageSize,
  pageSize,
  setPage,
  isSoal,
  title,
  materi,
  setMateri,
}) => {
  return (
    <>
      <section className="flex items-center justify-between">
        <h1 className="text-xl capitalize  font-bold font-poppins">{title}</h1>

       {!isSoal && <>  <Input
        placeholder='Cari'
          value={materi}
          icon="search"
          onChange={(e) => {
            setMateri(e.target.value);
          }}
        /></>}
      </section>
      <Table celled selectable>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell></Table.HeaderCell>
            <Table.HeaderCell>No</Table.HeaderCell>
            {/* <Table.HeaderCell>Mata Pelajaran</Table.HeaderCell> */}
            {/* <Table.HeaderCell>Guru Pembuat</Table.HeaderCell> */}
            <Table.HeaderCell>Materi</Table.HeaderCell>
            <Table.HeaderCell>Tipe Soal</Table.HeaderCell>
            <Table.HeaderCell>Point</Table.HeaderCell>
            <Table.HeaderCell>View</Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          <TableLoading
            count={8}
            isLoading={isLoading}
            data={data?.data?.rows}
            messageEmpty={"Daftar Soal Tidak Ditemukan"}
          >
            {data?.data?.rows?.map((item, index2) => (
              <Table.Row key={index2}>
                <Table.Cell>
                  <Checkbox
                    checked={value.soal.some((item2) => item2.id === item.id)}
                    onChange={(e) => {
                      console.log(
                        "e",
                        value.soal.some((item2) => item2.id === item.id)
                      );

                      if (value.soal.some((item2) => item2.id === item.id)) {
                        let filtered = value.soal.filter(
                          (item3) => item3.id !== item.id
                        );

                        return setFieldValue(`payload[${index}]soal`, filtered);
                      }

                      let soal = [...value?.soal];
                      soal.push({
                        id: item.id,
                        jawaban: item.jawaban,
                        materi: item.materi,
                        point: item.point,
                        soal: item.soal,
                        tipe: item.tipe,
                      });

                      setFieldValue(`payload[${index}]soal`, soal);
                    }}
                  />
                </Table.Cell>
                <Table.Cell>{index2 + 1}</Table.Cell>
                {/* <Table.Cell>{item?.mapel?.nama_mapel}</Table.Cell> */}
                {/* <Table.Cell>{item?.teacher?.nama_guru}</Table.Cell> */}
                <Table.Cell>{item?.materi}</Table.Cell>
                <Table.Cell>{<LabelStatus status={item?.tipe} />}</Table.Cell>
                <Table.Cell>{item?.point}</Table.Cell>

                <Table.Cell>
                  <span className="flex items-center justify-center">
                    {" "}
                    <ViewButton
                      type="button"
                      color="teal"
                      size="md"
                      icon={() => <Icon name="laptop" />}
                      onClick={() => {
                        setPreview(item);
                        setOpen(true);
                      }}
                    />
                  </span>
                </Table.Cell>
              </Table.Row>
            ))}
          </TableLoading>
        </Table.Body>
      </Table>
      {!isSoal && (
        <PaginationTable
          page={page}
          pageSize={pageSize}
          setPageSize={setPageSize}
          setPage={setPage}
          totalPages={data?.data?.count}
        />
      )}
    </>
  );
};

export default TableSoal;
