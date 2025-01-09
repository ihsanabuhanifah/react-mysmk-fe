import { useState } from "react";
import { Button, Header, Icon, Modal, Table } from "semantic-ui-react";
import * as XLSX from "xlsx";
import React from "react";
import { TableLoading } from "./TableLoading";
const PDF_FILE_URL = "http://localhost:8085/rekap-absensi.xlsx";

export default function FileCoba() {
  const [open, setOpen] = useState(false);
  const [data, setData] = useState([]);
  const handleDownload = (url) => {
    const fileName = url.split("/").pop();
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", fileName);
    document.body.appendChild(link);
    link.click();
    link.remove();
  };
  const handleFileUpload = (e) => {
    const reader = new FileReader();
    reader.readAsBinaryString(e.target.files[0]);
    reader.onload = (e) => {
      const data = e.targer.result;
      const workbook = XLSX.read(data, { type: "binary" });
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
      const parsedData = XLSX.utils.sheet_to_json(sheet);
      setData(parsedData);
    };
  };
  return (
    <div className="App">
      <Modal.Content>
        <input
          type="file"
          accept=".xlsx, .xls"
          onChange={handleFileUpload}
        ></input>
      </Modal.Content>
      {data.length > 0 && (
        <Table celled selectable>
          <Table.Header>
            <Table.Row >
              {Object.keys(data[0]).map((key) => (
                <Table.HeaderCell key={key}>{key}</Table.HeaderCell>
              ))}
            </Table.Row>
          </Table.Header>
          <Table.Body>
            <TableLoading
              count={8}
            //   isLoading={isLoading}
              data={data?.data}
              messageEmpty={"Data Tidak Ditemukan"}
            >
              {data.map((row, index) => (
                <Table.Row key={index}>
                  {Object.values(row).map((value,index) => (
                    <Table.Cell key={index}>
                      {value}
                    </Table.Cell>
                  ))}
                  
                  {/* <Table.Cell>
                    <EditButton
                      onClick={() =>
                        navigate(`update/${value?.id}`, { replace: true })
                      }
                    />
                    <DeleteButton onClick={() => confirmDelete(value?.id)} />
                  </Table.Cell> */}
                </Table.Row>
              ))}
            </TableLoading>
          </Table.Body>
        </Table>
      )}
    </div>
  );
}
