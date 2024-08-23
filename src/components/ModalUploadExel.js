import { useState } from "react";
import { Button, Header, Icon, Modal } from "semantic-ui-react";
import * as XLSX from 'xlsx'

const PDF_FILE_URL = "http://localhost:8085/rekap-absensi.xlsx";

export default function UploadExcel() {

  const [open, setOpen] = useState(false);
  const [data,setData] = useState([]);

  const handleDownload = (url) => {
    const fileName = url.split("/").pop();
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download",fileName)
    document.body.appendChild(link);
    link.click();
    link.remove();
  };
  const handleFileUpload = (e) =>{
    const reader = new FileReader();
    reader.readAsBinaryString(e.target.files[0]);
    reader.onload=(e) => {
      const data = e.targer.result;
      const workbook = XLSX.read(data,{type:"binary"});
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
      const parsedData = XLSX.utils.sheet_to_json(sheet);
      setData(parsedData);
    }
    
  }
  return (
    <div >
      <Button fluid size="medium" onClick={() => setOpen(true)} primary >
        Upload XLSX
      </Button>

      <Modal open={open} onClose={() => setOpen(false)} size="small" >
        <Header icon="file excel" content="Upload Langsung Banyak" />
        <Modal.Content>
          <input type="file" accept=".xlsx" />
        </Modal.Content>
        <Modal.Actions>
          <Button onClick={()=>{
            handleDownload(PDF_FILE_URL);
          }} secondary>
            <Icon name="download" /> Silahkan download contoh file excelnya
            disini
          </Button>
          <Button onClick={() => setOpen(false)} primary>
            Submit
          </Button>
        </Modal.Actions>
      </Modal>
    </div>
  );
}
