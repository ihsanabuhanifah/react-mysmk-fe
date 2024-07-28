import React from "react";
import { useNavigate } from "react-router-dom";
import LayoutPage from "../../../module/layoutPage";

import { Table, Button, Icon } from "semantic-ui-react";
import { handleViewNull, checkRole } from "../../../utils";
import { listHalaqohGroup } from "../../../api/guru/halaqoh";
// import AddSiswa from "./tambahSiswa";
import { useQuery } from "react-query";
import usePage from "../../../hook/usePage";
import useDebounce from "../../../hook/useDebounce";
import useList from "../../../hook/useList";
import {
  TableLoading,
  PaginationTable,
  // ModalFilter,
} from "../../../components";
import { useState } from "react";

export default function HalaqohSiswa() {
  let { page, pageSize, setPage, setPageSize, keyword, setKeyword } = usePage();
  let debouncedKeyword = useDebounce(keyword, 600);
  let parameter = {
    page: page,
    pageSize: pageSize,
    keyword: debouncedKeyword,
  };
  const { roles } = useList();
  let navigate = useNavigate();
  let { data, isLoading } = useQuery(
    //query key
    ["list_halaqoh_group", parameter],
    //axios function,triggered when page/pageSize change
    () => listHalaqohGroup(parameter),
    //configuration
    {
      // refetchInterval: 1000 * 60 * 60,
      select: (response) => {
        return response.data;
      },
    }
  );

  return (
    <LayoutPage title={"List Halaqoh Grup"}>
      {/* <ModalFilter open={open} setOpen={setOpen}>
        <AddSiswa />
      </ModalFilter> */}
      <section className="grid grid-cols-6 gap-5 mb-5">
        {/* <Input
          onChange={(e) => {
            setKeyword(e.target.value);
          }}
          fluid
          value={keyword}
          icon="search"
          placeholder="Nama Guru..."
        /> */}
        <div className=" col-span-3 lg:col-span-1">
          {checkRole(roles, "admin") && (
            <Button
              content={"Buat Jadwal"}
              type="submit"
              fluid
              icon={() => <Icon name="add" />}
              size="medium"
              color="linkedin"
              onClick={() => {
                // return setOpen(true);
                return navigate("tambah");
              }}
            />
          )}
        </div>
      </section>
      <section className="w-full">
        <Table celled selectable>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell>No</Table.HeaderCell>
              <Table.HeaderCell>Nama Siswa</Table.HeaderCell>
              <Table.HeaderCell>Pengampu Halaqoh</Table.HeaderCell>

              <Table.HeaderCell singleLine>Status</Table.HeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            <TableLoading
              count={10}
              isLoading={isLoading}
              data={data?.data?.rows}
              messageEmpty={"Kelompok Halaqoh belum dibuat"}
            >
              {data?.data?.rows?.map((value, index) => (
                <Table.Row key={index}>
                  <Table.Cell>{index + 1}</Table.Cell>
                  <Table.Cell>
                    <span className="capitalize">
                      {handleViewNull(value?.siswa?.nama_siswa)}
                    </span>
                  </Table.Cell>
                  <Table.Cell>
                    {handleViewNull(value?.halaqoh?.teacher?.nama_guru)}
                  </Table.Cell>

                  <Table.Cell textAlign="left">Aktif</Table.Cell>
                </Table.Row>
              ))}
            </TableLoading>
          </Table.Body>
        </Table>
        <PaginationTable
          page={page}
          pageSize={pageSize}
          setPageSize={setPageSize}
          setPage={setPage}
          totalPages={data?.data?.count}
        />
      </section>
    </LayoutPage>
  );
}
