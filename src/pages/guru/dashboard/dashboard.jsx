import { useNavigate } from "react-router-dom";
import LayoutPage from "../../../module/layoutPage";
import MapComponent from "../../../components/geocode";
import { Autoplace } from "../../../components/autoPlace";
import { useState } from "react";
import { Button, Header, Icon, Modal, Table } from "semantic-ui-react";
import * as XLSX from "xlsx";
import React from "react";
import { TableLoading } from "../../../components";

const PDF_FILE_URL = "http://localhost:8085/santriexcel.xlsx";
export default function Dashboard() {
  let navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [data, setData] = useState([]);


  const handleDownloadTemplate = (url) => {
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
      const data = e.target.result;
      const workbook = XLSX.read(data, { type: "binary" });
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
      const parsedData = XLSX.utils.sheet_to_json(sheet);
      setData(parsedData);
      setOpen(false)
    };
  };
  return (
    <LayoutPage title='Dashboard'>
      ini dashboard
      {/* <MapComponent></MapComponent> */}
      <Button fluid size="medium" onClick={() => setOpen(true)} primary>
        Upload File XLSX
      </Button>


      <Modal open={open} onClose={() => setOpen(false)} size="small" >
        <Header icon="file excel" content="Upload Langsung Banyak" />
        <Modal.Content className="flex flex-col  ">
          <input
            type="file"
            accept=".xlsx, .xls"
            onChange={handleFileUpload}
          ></input>
          <Button onClick={() => {
            handleDownloadTemplate(PDF_FILE_URL);
          }} secondary>
            <Icon name="download" /> Silahkan download contoh file excelnya
            disini
          </Button>
        </Modal.Content>
        <Modal.Actions>
          <Button onClick={() => setOpen(false)} color="red" >
            Cancel
          </Button>
          <Button onClick={() => setOpen(false)} primary>
            Submit
          </Button>
        </Modal.Actions>
      </Modal>

      {data.length > 0 && (
        <Table celled selectable >
          <Table.Header>
            <Table.Row>{Object.keys(data[0]).map((key) => (
              <Table.HeaderCell key={key}>{key}</Table.HeaderCell>
            ))}</Table.Row>
          </Table.Header>
          <Table.Body>
            {data.map((row, index) => (

              <Table.Row key={index}>
                {Object.values(row).map((value, index) => (
                  <Table.Cell key={index}>
                    {value}
                  </Table.Cell>
                ))}
              </Table.Row>
            ))}
          </Table.Body>

        </Table >
      )}



    </LayoutPage>
  );
}
