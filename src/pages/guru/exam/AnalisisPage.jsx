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
import { saveAs } from "file-saver";
import { LoadingPage } from "../../../components";

export default function AnalisisPage({view}) {
  
 
  const { isLoading, data } = useAnalisisUjian(view.id);
  const ref = useRef();



  console.log('data', data)

  if(isLoading){
    return <LoadingPage/>
  }
  return (
    <>
      <section className="mb-5 flex items-center justify-end">
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
                  <section className="mb-5 grid grid-cols-5 gap-5 rounded-lg border p-5 shadow-lg">
                    <div className="col-span-2 rounded-xl p-4 shadow-sm">
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
                    <div className="col-span-3 space-y-2">
                      <div className="rounded-xl border shadow-sm">
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
                      <div className="rounded-xl border shadow-sm">
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
                  <section className="mb-5 grid grid-cols-5 gap-5 rounded-lg border p-5 shadow-lg">
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
                    <div className="col-span-3">
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

                {console.log("item", item?.soal)}
                {item.tipe === "ES" && (
                  <section className="mb-5 rounded-lg border p-5 shadow-lg">
                    <ES
                      nomor={index + 1}
                      soals={JSON.parse(item?.soal)}
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
    </>
  );
}

const handleDownloadPdf = async (printRef) => {
  try {
    const element = printRef.current;
    const canvas = await html2canvas(element, {
      scale: Math.min(2, window.devicePixelRatio || 1),
      logging: true,
      width: element.scrollWidth,
      height: element.scrollHeight,
    });

    const imgData = canvas.toDataURL("image/jpeg", 0.8); // 80% quality
    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "pt",
      format: [canvas.width, canvas.height],
    });

    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();
    const imgWidth = canvas.width;
    const imgHeight = canvas.height;

    // Calculate the number of pages needed
    let heightLeft = imgHeight;
    let position = 0;

    // Add pages
    while (heightLeft > 0) {
      pdf.addImage(imgData, "JPEG", 0, position, pdfWidth, pdfHeight);
      heightLeft -= pdfHeight;
      position -= pdfHeight;

      if (heightLeft > 0) {
        pdf.addPage();
      }
    }

    // Save the PDF
    const fileName = `Analisis-Jawaban-${new Date().toISOString().split("T")[0]}.pdf`;
    pdf.save(fileName);
  } catch (error) {
    console.error("Error generating PDF:", error);
  }
};

