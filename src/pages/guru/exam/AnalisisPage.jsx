import { useParams } from "react-router-dom";
import { useAnalisisUjian } from "../../../api/guru/ujian";
import LayoutPage from "../../../module/layoutPage";
import Pg from "./PG";
import TF from "./TF";
import ES from "./ES";


export default function AnalisisPage() {
  const { id, mapel } = useParams();
  const { isLoading, data } = useAnalisisUjian(id);

  console.log("data", data);

  return (
    <LayoutPage title={"Analiis Ujian "} isLoading={isLoading}>
      <section>
        {data &&
          data?.soal?.map((item, index) => {
            return (
              <section key={index} className="space-y-5">
                {item.tipe === "PG" && (
                  <section className="mb-5 border grid grid-cols-3 gap-5 rounded-lg shadow-md p-5">
                    <div>
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
                    <div className="col-span-2 grid grid-cols-2 gap-5">
                      <div>
                        <p>
                          Siswa Menjawab Benar : {data.analisis[index].benar} ({" "}
                          {data.analisis[index].persentaseBenar} %)
                        </p>
                        <p>
                          Siswa Menjawab Salah : {data.analisis[index].salah} ({" "}
                          {data.analisis[index].persentaseSalah} %)
                        </p>
                        <p>
                          Siswa Tidak Manjawab : {data.analisis[index].tidakMenjawab} ({" "}
                          {data.analisis[index].persentaseTidakMenjawab} %)
                        </p>
                      </div>
                      <div>
                        <p>
                          Siswa Menjawab A : {data.analisis[index].pilihan.a.count} ({" "}
                          {data.analisis[index].pilihan.a.persentase} %)
                        </p>
                        <p>
                          Siswa Menjawab B : {data.analisis[index].pilihan.b.count} ({" "}
                          {data.analisis[index].pilihan.b.persentase} %)
                        </p>
                        <p>
                          Siswa Menjawab C : {data.analisis[index].pilihan.c.count} ({" "}
                          {data.analisis[index].pilihan.c.persentase} %)
                        </p>
                        <p>
                          Siswa Menjawab D : {data.analisis[index].pilihan.d.count} ({" "}
                          {data.analisis[index].pilihan.d.persentase} %)
                        </p>
                        <p>
                          Siswa Menjawab E : {data.analisis[index].pilihan.e.count} ({" "}
                          {data.analisis[index].pilihan.e.persentase} %)
                        </p>
                      </div>
                     
                    </div>
                  </section>
                )}
                {item.tipe === "TF" && (
                  <section className="mb-5 border rounded-lg shadow-md p-5 grid grid-cols-3 gap-5 ">
                  <div>
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
                  <div className="col-span-2 grid grid-cols-2 gap-5">
                      <div>
                        <p>
                          Siswa Menjawab Benar : {data.analisis[index].benar} ({" "}
                          {data.analisis[index].persentaseBenar} %)
                        </p>
                        <p>
                          Siswa Menjawab Salah : {data.analisis[index].salah} ({" "}
                          {data.analisis[index].persentaseSalah} %)
                        </p>
                        <p>
                          Siswa Tidak Manjawab : {data.analisis[index].tidakMenjawab} ({" "}
                          {data.analisis[index].persentaseTidakMenjawab} %)
                        </p>
                      </div>
                     
                    </div>
                  
                  </section>
                )}
                {item.tipe === "ES" && (
                  <section className="mb-5 border rounded-lg shadow-md p-5">
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
