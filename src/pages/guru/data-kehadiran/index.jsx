import React, { useContext, useEffect, useState } from "react";
import LayoutPage from "../../../module/layoutPage";
import { Button, Select, Table } from "semantic-ui-react";
import { TableLoading } from "../../../components";
import { useListDataKehadiranSholat } from "../../../api/guru/kehadiransholat";
import { handleViewNull } from "../../../utils";
import { getOptionsText } from "../../../utils/format";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { format } from "date-fns";
import { SocketContext } from "../../siswa/SocketContext";
import LivePage from "./LivePage";

const DataKehadiran = () => {
  const { data, isLoading, params, setParams } = useListDataKehadiranSholat();
  const [startDate, setStartDate] = useState(new Date());
  const rows = data?.kehadiran ? JSON.parse(data.kehadiran) : [];
  const socket = useContext(SocketContext);
  const [isExistLive, setIsExistLive] = useState(false);
  const [isLivePage, setIsLivePage] = useState(false);
  const [newKehadiran, setNewKehadiran] = useState([])

  const waktuSholatOptions = [
    { key: "subuh", text: "Subuh" },
    { key: "dzuhur", text: "Dzuhur" },
    { key: "ashar", text: "Ashar" },
    { key: "maghrib", text: "Maghrib" },
    { key: "isya", text: "Isya" },
  ];

  const handleDateChange = (date) => {
    const formattedDate = format(date, "yyyy-MM-dd");
    setParams((prev) => ({
      ...prev,
      tanggal: formattedDate,
    }));
  };

  useEffect(() => {
    if (!socket) return;

    socket.on("isExistRoom", (data) => {
      if (!data) {
        setIsLivePage(false);
      }
      setIsExistLive(data);
    });

    socket.on("newKehadiran", (data) => {
      setNewKehadiran(data)
    });

    return () => {
      socket.off("isExistRoom");
      socket.off("newKehadiran");
    };
  }, [socket]);

  return (
    <LayoutPage title={"Data Kehadiran Sholat"}>
      {isLivePage ? (
        <LivePage
          handleClick={() => {
            setIsLivePage(false);
          }}
          newKehadiran={newKehadiran}
        />
      ) : (
        <>
          <div className="flex items-center gap-2">
            <Button
              onClick={() => {
                if (isExistLive) {
                  let ROOMCODE = new Date().toLocaleDateString();
                  if (socket) {
                    socket.emit("joinRoom", `${ROOMCODE}`);
                    alert("yaaa");
                  }
                  setIsLivePage(true);
                }
              }}
              content="LIVE"
              type="button"
              disabled={!isExistLive}
              size="medium"
              color={isExistLive ? "green" : "grey"}
            />
            <Select
              options={getOptionsText(waktuSholatOptions, "text")}
              value={params.waktu}
              label={{
                children: "Subuh",
              }}
              onChange={(event, data) => {
                setParams((prev) => {
                  return {
                    ...prev,
                    waktu: data?.value,
                  };
                });
              }}
            />
            <DatePicker
              selected={startDate}
              onChange={(date) => {
                setStartDate(date);
                handleDateChange(date);
              }}
            />
          </div>
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
                  isLoading={isLoading}
                  data={rows}
                  messageEmpty={"Data Kehadiran Tidak Ada"}
                >
                  {rows?.map((value, index) => (
                    <Table.Row key={index}>
                      <Table.Cell>{index + 1}</Table.Cell>
                      <Table.Cell>
                        <span className="capitalize">
                          {handleViewNull(value?.name)}
                        </span>
                      </Table.Cell>
                      <Table.Cell>
                        {handleViewNull(value?.kehadiran)}
                      </Table.Cell>

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
      )}
    </LayoutPage>
  );
};

export default DataKehadiran;
