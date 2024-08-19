import { useParams } from "react-router-dom";
import { useAnalisisUjian } from "../../../api/guru/ujian";
import LayoutPage from "../../../module/layoutPage";
import Pg from "./PG";
import TF from "./TF";
import ES from "./ES";
import DonutChart from "../../../components/Chart/Donut";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { useRef } from "react";
import { Button } from "semantic-ui-react";

export default function AnalisisPage() {
  const { id, mapel } = useParams();
  const { isLoading, data } = useAnalisisUjian(id);
  const ref = useRef();

 
  return (
    <LayoutPage title={"Analisa Ujian "} isLoading={isLoading}>
      <section className="flex items-center justify-end mb-5">
        <Button
          onClick={async () => {
            handleDownloadPdf(ref);
          }}
        >
          Download Sebagai PDF
        </Button>
      </section>
      <section ref={ref}>
        {data &&
          data?.soal?.map((item, index) => {
            return (
              <section key={index} className="space-y-5">
                {item.tipe === "PG" && (
                  <section className="mb-5 border grid grid-cols-5 gap-5 shadow-lg rounded-lg  p-5">
                    <div className=" rounded-xl col-span-2 p-4 shadow-sm  ">
                      <Pg
                        nomor={index + 1}
                        soals={JSON.parse(item.soal)}
                        jawaban={[
                          {
                            id: item.id,
                            tipe: item.tipe,
                            jawaban: item.jawaban,
                          },
                        ]}
                        item={item}
                      />
                    </div>
                    <div className="col-span-3 space-y-2  ">
                      <div className=" rounded-xl  shadow-sm border ">
                        <DonutChart
                          title="Analisis Jawaban "
                          data={[
                            {
                              name: `Benar (${data.analisis[index].benar})`,
                              value: data.analisis[index].benar,
                            },
                            {
                              name: `Salah (${data.analisis[index].salah})`,
                              value: data.analisis[index].salah,
                            },
                            {
                              name: `Tidak Menjawab (${data.analisis[index].tidakMenjawab})`,
                              value: data.analisis[index].tidakMenjawab,
                            },
                          ]}
                        />
                        {/* <p>
                          Siswa Menjawab Benar : {data.analisis[index].benar} ({" "}
                          {data.analisis[index].persentaseBenar} %)
                        </p>
                        <p>
                          Siswa Menjawab Salah : {data.analisis[index].salah} ({" "}
                          {data.analisis[index].persentaseSalah} %)
                        </p>
                        <p>
                          Siswa Tidak Manjawab :{" "}
                          {data.analisis[index].tidakMenjawab} ({" "}
                          {data.analisis[index].persentaseTidakMenjawab} %)
                        </p> */}
                      </div>
                      <div className=" rounded-xl  shadow-sm border  ">
                        <DonutChart
                          title="Analisis Pilihan "
                          data={[
                            {
                              name: `Jawaban A (${data.analisis[index].pilihan.a.count})`,
                              value: data.analisis[index].pilihan.a.count,
                            },
                            {
                              name: `Jawaban B (${data.analisis[index].pilihan.b.count})`,
                              value: data.analisis[index].pilihan.b.count,
                            },
                            {
                              name: `Jawaban C (${data.analisis[index].pilihan.c.count})`,
                              value: data.analisis[index].pilihan.c.count,
                            },
                            {
                              name: `Jawaban D (${data.analisis[index].pilihan.d.count})`,
                              value: data.analisis[index].pilihan.d.count,
                            },
                            {
                              name: `Jawaban E (${data.analisis[index].pilihan.e.count})`,
                              value: data.analisis[index].pilihan.e.count,
                            },
                          ]}
                        />
                      </div>
                    </div>
                  </section>
                )}
                {item.tipe === "TF" && (
                  <section className="mb-5 border shadow-lg rounded-lg p-5 grid grid-cols-5 gap-5 ">
                    <div className="col-span-2">
                      <TF
                        nomor={index + 1}
                        soals={JSON.parse(item.soal)}
                        jawaban={[
                          {
                            id: item.id,
                            tipe: item.tipe,
                            jawaban: item.jawaban,
                          },
                        ]}
                        item={item}
                      />
                    </div>
                    <div className="col-span-3 ">
                      <DonutChart
                        title="Analisis Jawaban "
                        data={[
                          {
                            name: `Benar (${data.analisis[index].benar})`,
                            value: data.analisis[index].benar,
                          },
                          {
                            name: `Salah (${data.analisis[index].salah})`,
                            value: data.analisis[index].salah,
                          },
                          {
                            name: `Tidak Menjawab (${data.analisis[index].tidakMenjawab})`,
                            value: data.analisis[index].tidakMenjawab,
                          },
                        ]}
                      />
                    </div>
                  </section>
                )}
                {item.tipe === "ES" && (
                  <section className="mb-5 border shadow-lg rounded-lg p-5">
                    <ES
                      nomor={index + 1}
                      soals={JSON.parse(item.soal)}
                      jawaban={[
                        {
                          id: item.id,
                          tipe: item.tipe,
                          jawaban: item.jawaban,
                        },
                      ]}
                      item={item}
                    />
                  </section>
                )}
              </section>
            );
          })}
      </section>
    </LayoutPage>
  );
}

const handleDownloadPdf = async (printRef) => {
    const element = printRef.current;
  
    // Tentukan ukuran A4 dalam satuan titik (pt)
    const a4Width = 595.28; // 210mm dalam pt
    const a4Height = 841.89; // 297mm dalam pt
    const padding = 20; // padding dalam pt
  
    const canvas = await html2canvas(element, {
      scale: 1.5, // meningkatkan skala untuk resolusi yang lebih baik
      useCORS: true,
      width: element.scrollWidth,
      height: element.scrollHeight,
    });
  
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'pt',
      format: 'a4',
    });
  
    const imgWidth = a4Width - 2 * padding;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
  
    let heightLeft = imgHeight;
    let position = 0;
  
    while (heightLeft > 0) {
      pdf.addImage(imgData, 'PNG', padding, position, imgWidth, imgHeight);
      heightLeft -= a4Height - 2 * padding;
      position -= a4Height - 2 * padding;
      if (heightLeft > 0) {
        pdf.addPage();
      }
    }
  
    pdf.save(`Analisis-Jawaban-${new Date().toISOString().split('T')[0]}.pdf`);
  };
  