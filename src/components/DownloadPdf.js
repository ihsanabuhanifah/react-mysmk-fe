import React, { useState, useRef } from "react";
// import {
//   Button,
//   CircularProgress,
//   Select,
//   MenuItem,
//   FormControl,
//   InputLabel,
// } from "@mui/material";
import html2pdf from "html2pdf.js";
import { useDownloadPdf } from "../api/siswa/laporan-pkl";
// import { useDownloadPdf } from "../api/siswa/laporan-pkl";
import axios from "axios";
import { Button } from "semantic-ui-react";

const GeneratePdfComponent = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [bulan, setBulan] = useState("");
  const [tahun] = useState(2024);
  const reportRef = useRef();
  const {
    data: dataPdf,
    isLoading: downloadPdfIsLoading,
    filterParams: downloadPdfFilterParams,
    handleClear: clearDownloadPdfFilter,
    handleFilter: applyDownloadPdfFilter,
    params: downloadPdfParams,
    setParams: setDownloadPdfParams,
  } = useDownloadPdf();
  // Function to fetch data and generate PDF
  const handleGeneratePdf = async () => {
    setLoading(true);
    try {
    //   mutate();
    //   setData();

      // Generate PDF
      const element = reportRef.current;
      const opt = {
        margin: 1,
        filename: "Laporan_PKL.pdf",
        image: { type: "jpeg", quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { unit: "in", format: "letter", orientation: "portrait" },
      };
      html2pdf().from(element).set(opt).save();
    } catch (error) {
      console.error("Error saat mendownload data:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div ref={reportRef} style={{ padding: "20px", backgroundColor: "#fff" }}>
        <h2>Laporan PKL</h2>

        {/* Display data if available */}
        {/* {data.length > 0 && (
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>No.</TableCell>
                  <TableCell>Judul Laporan</TableCell>
                  <TableCell>Isi Laporan</TableCell>
                  <TableCell>Tanggal Dibuat</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {data.map((row, index) => (
                  <TableRow key={index}>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>{row.judul}</TableCell>
                    <TableCell>{row.isi}</TableCell>
                    <TableCell>
                      {new Date(row.tanggal).toLocaleDateString()}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )} */}
      </div>

      {/* <FormControl fullWidth style={{ marginTop: "20px" }}>
        <InputLabel id="bulan-label">Pilih Bulan</InputLabel>
        <Select
          labelId="bulan-label"
          value={bulan}
          onChange={(e) => setBulan(e.target.value)}
          displayEmpty
        >
          <MenuItem value="">Semua Bulan</MenuItem>
          <MenuItem value="1">Januari</MenuItem>
          <MenuItem value="2">Februari</MenuItem>
          <MenuItem value="3">Maret</MenuItem>
          <MenuItem value="4">April</MenuItem>
          <MenuItem value="8">Agustus</MenuItem>
        </Select>
      </FormControl> */}

      <Button
        variant="contained"
        color="primary"
        onClick={handleGeneratePdf}
        style={{ marginTop: "20px" }}
        disabled={loading || !bulan}
      >
        {/* {loading ? <CircularProgress size={24} /> : "Download PDF"} */}
      </Button>
    </div>
  );
};

export default GeneratePdfComponent;
