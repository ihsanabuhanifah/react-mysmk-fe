import React, { useState } from "react";
import LayoutPage from "../../../module/layoutPage";
import { Table } from "semantic-ui-react";
import { TableLoading } from "../../../components";
import { handleViewNull } from "../../../utils";
import { IoArrowBackOutline } from "react-icons/io5";

const LivePage = ({ handleClick, newKehadiran }) => {

  return (
    <>
      <button
        onClick={handleClick}
        className="flex items-center gap-2 hover:text-[#18a558]"
      >
        <IoArrowBackOutline size={20} />

        <h1 className="font-poppins m-0 text-2xl font-black capitalize">
          Kembali
        </h1>
      </button>

      <section className="mt-4 w-full">
        <Table celled selectable>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell>No</Table.HeaderCell>
              <Table.HeaderCell>Nama</Table.HeaderCell>
              <Table.HeaderCell>Kehadiran</Table.HeaderCell>
              <Table.HeaderCell singleLine>Status</Table.HeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            <TableLoading
              count={10}
              data={newKehadiran}
              messageEmpty={"Data Kehadiran Tidak Ada"}
            >
              {newKehadiran?.map((value, index) => (
                <Table.Row key={index}>
                  <Table.Cell>{index + 1}</Table.Cell>
                  <Table.Cell>
                    <span className="capitalize">
                      {handleViewNull(value?.name)}
                    </span>
                  </Table.Cell>
                  <Table.Cell>{handleViewNull(value?.kehadiran)}</Table.Cell>

                  <Table.Cell textAlign="left">
                    {value?.isTelat ? "Telat" : "Tepat Waktu"}
                  </Table.Cell>
                </Table.Row>
              ))}
            </TableLoading>
          </Table.Body>
        </Table>
      </section>
    </>
  );
};

export default LivePage;
