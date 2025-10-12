import { useEffect, useState } from "react";
import { Button } from "semantic-ui-react";
import htmr from "htmr";

export default function MultiTrueFalseStudent({
  soals,
  item,
  setPayload,
  payload,
}) {
  const [jawaban, setJawaban] = useState([]);

  console.log("jawab", jawaban)

  // Parse soal data
  const soalData = soals;

  // Dapatkan pernyataan yang ada (a, b, c, d, e)
  const pernyataan = [];
  if (soalData.a && soalData.a !== "null" && soalData.a.trim() !== "")
    pernyataan.push({ huruf: "A", teks: soalData.a });
  if (soalData.b && soalData.b !== "null" && soalData.b.trim() !== "")
    pernyataan.push({ huruf: "B", teks: soalData.b });
  if (soalData.c && soalData.c !== "null" && soalData.c.trim() !== "")
    pernyataan.push({ huruf: "C", teks: soalData.c });
  if (soalData.d && soalData.d !== "null" && soalData.d.trim() !== "")
    pernyataan.push({ huruf: "D", teks: soalData.d });
  if (soalData.e && soalData.e !== "null" && soalData.e.trim() !== "")
    pernyataan.push({ huruf: "E", teks: soalData.e });

  useEffect(() => {
    const detail = handleSoal(payload, item);
    // Inisialisasi jawaban dari payload yang sudah ada
    if (detail.soal[0]?.jawaban) {
      let existingJawaban = [];
      if (typeof detail.soal[0].jawaban === "string") {
        // Convert dari string "true,false,true" ke array
        existingJawaban = detail.soal[0].jawaban
          .split(",")
          .map((val) => val === "true");
      } else if (Array.isArray(detail.soal[0].jawaban)) {
        existingJawaban = detail.soal[0].jawaban.map((val) => val === "true");
      }
      setJawaban(existingJawaban);
    } else {
      // Inisialisasi dengan false semua
    //   setJawaban(Array(pernyataan.length).fill(false));
    }
  }, []);

  const handleJawabanChange = (index, value) => {
    const newJawaban = [...jawaban];
    newJawaban[index] = value;
    setJawaban(newJawaban);

    // Update payload
    const detail = handleSoal(payload, item);
    const jawabanString = newJawaban
      .map((val) => (val ? "true" : "false"))
      .join(",");

    setPayload((s) => {
      s.data[detail.index] = {
        ...detail.soal[0],
        jawaban: jawabanString,
      };
      return {
        ...s,
        data: s.data,
      };
    });
  };

  const handleSoal = (payload, item) => {
    const soal = payload.data.filter((x) => x.id === item.id);
    const index = payload.data.findIndex((x) => x.id === item.id);
    return { soal, index };
  };

  // Hitung jumlah yang sudah dijawab
  const jawabanTerisi = jawaban.filter(
    (val) => val !== null && val !== undefined,
  ).length;

  return (
    <div className="space-y-6">
      {/* Soal Utama */}
      <div className="rounded-lg border border-gray-300 bg-white p-6 shadow-sm">
       
        <div className="prose max-w-none text-gray-700">
          {htmr(
            `<div>${soalData.soal?.replace(
              "https://storage.devopsgeming.online",
              "https://bemysmk.smkmadinatulquran.sch.id",
            )}</div>`,
          )}
        </div>
      </div>

      {/* Tabel Pernyataan dan Jawaban */}
      <div className="overflow-hidden rounded-lg border border-gray-300 bg-white shadow-sm">
        {/* Header Tabel */}
        <div className="grid grid-cols-12 border-b border-gray-300 bg-gray-50 font-semibold">
          <div className="col-span-8 border-r border-gray-300 px-4 py-4 text-sm text-gray-700">
            Pernyataan
          </div>
          <div className="col-span-2 border-r border-gray-300 px-4 py-4 text-center text-sm text-gray-700">
            Benar
          </div>
          <div className="col-span-2 px-4 py-4 text-center text-sm text-gray-700">
            Salah
          </div>
        </div>

        {/* Body Tabel */}
        <div className="divide-y divide-gray-300">
          {pernyataan.map((item, index) => (
            <div
              key={index}
              className="grid grid-cols-12 transition-colors hover:bg-gray-50"
            >
              {/* Pernyataan */}
              <div className="col-span-8 border-r border-gray-300 px-4 py-4">
                <div className="flex items-start space-x-3">
                  <div className="mt-1 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded bg-gray-100 text-sm font-semibold text-gray-700">
                    {item.huruf}
                  </div>
                  <div className="prose max-w-none flex-1 text-gray-700">
                    {htmr(
                      `<div>${item.teks?.replace(
                        "https://storage.devopsgeming.online",
                        "https://bemysmk.smkmadinatulquran.sch.id",
                      )}</div>`,
                    )}
                  </div>
                </div>
              </div>

              {/* Checkbox BENAR */}
              <div className="col-span-2 flex items-center justify-center border-r border-gray-300 px-4 py-4">
                <label className="flex cursor-pointer items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={jawaban[index] === true}
                    onChange={(e) => {
                      if (e.target.checked) {
                        handleJawabanChange(index, true);
                      }
                    }}
                    className="h-5 w-5 rounded-full border-2 border-gray-300 bg-white text-green-600 focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
                  />
                </label>
              </div>

              {/* Checkbox SALAH */}
              <div className="col-span-2 flex items-center justify-center px-4 py-4">
                <label className="flex cursor-pointer items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={jawaban[index] === false}
                    onChange={(e) => {
                      if (e.target.checked) {
                        handleJawabanChange(index, false);
                      }
                    }}
                    className="h-5 w-5 rounded-full border-2 border-gray-300 bg-white text-red-600 focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                  />
                </label>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Validasi Checkbox */}
     

      {/* Status Jawaban */}
      <div className="rounded-lg border border-gray-300 bg-white p-4">
       

        {/* Progress Bar */}
        <div className="mt-3">
          <div className="mb-1 flex items-center justify-between">
            <span className="text-xs font-medium text-gray-700">
              Progress Jawaban
            </span>
            <span className="text-xs font-medium text-gray-700">
              {jawabanTerisi}/{pernyataan.length}
            </span>
          </div>
          <div className="h-2 w-full rounded-full bg-gray-200">
            <div
              className="h-2 rounded-full bg-blue-600 transition-all duration-300"
              style={{
                width: `${
                  pernyataan.length > 0
                    ? (jawabanTerisi / pernyataan.length) * 100
                    : 0
                }%`,
              }}
            ></div>
          </div>
        </div>
      </div>
    </div>
  );
}
