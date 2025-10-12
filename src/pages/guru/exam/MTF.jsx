import clsx from "clsx";
import htmr from "htmr";

export default function MultiTrueFalseView({ soals, jawaban, item, nomor }) {
  const jawabanSiswa = handleViewJawaban(jawaban, item.id);

  // Parse jawaban siswa
 let jawabanSiswaArray = [];
  if (jawabanSiswa?.jawaban) {
    if (typeof jawabanSiswa.jawaban === "string") {
      // Jika sudah string, split dan konversi ke string "true"/"false"
      jawabanSiswaArray = jawabanSiswa.jawaban.split(",").map(val => val.toString());
    } else if (Array.isArray(jawabanSiswa.jawaban)) {
      // Jika array, konversi setiap elemen ke string
      jawabanSiswaArray = jawabanSiswa.jawaban.map(val => val.toString());
    }
  }

  console.log("item", item.jawaban);
  console.log("jawaban siswa", jawabanSiswaArray);

  // Parse jawaban benar dari item
  let jawabanBenarArray = item.jawaban.split(",");

  // Parse soal data
  const soalData = soals;
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

  // Hitung score
  const calculateScore = () => {
    if (jawabanSiswaArray.length === 0 || jawabanBenarArray.length === 0) {
      return 0;
    }

    if (jawabanSiswaArray.length !== jawabanBenarArray.length) {
      return 0;
    }

    // Cek apakah semua jawaban siswa benar
    const semuaBenar = jawabanBenarArray.every(
      (jawaban, index) => jawaban === jawabanSiswaArray[index],
    );

    return semuaBenar ? item.point : 0;
  };

  const score = calculateScore();

  // Fungsi untuk menentukan style berdasarkan status jawaban
  const getJawabanStyle = (index) => {
    const jawabanBenar = jawabanBenarArray[index];
    const jawabanSiswa = jawabanSiswaArray[index];

    if (jawabanBenar === jawabanSiswa && jawabanSiswa === true) {
      return "bg-green-500 border-green-500 text-white"; // Benar dan dipilih benar
    } else if (jawabanBenar === jawabanSiswa && jawabanSiswa === false) {
      return "bg-green-500 border-green-500 text-white"; // Benar dan dipilih salah (jika jawaban benar adalah false)
    } else if (jawabanBenar !== jawabanSiswa && jawabanSiswa === true) {
      return "bg-red-500 border-red-500 text-white"; // Salah tapi dipilih benar
    } else if (jawabanBenar !== jawabanSiswa && jawabanSiswa === false) {
      return "bg-red-500 border-red-500 text-white"; // Salah tapi dipilih salah
    } else {
      return "bg-gray-100 border-gray-300 text-gray-700"; // Tidak dijawab
    }
  };

  // Fungsi untuk menentukan icon
  const getJawabanIcon = (index) => {
    const jawabanBenar = jawabanBenarArray[index];
    const jawabanSiswa = jawabanSiswaArray[index];

    if (jawabanBenar === jawabanSiswa) {
      return "✓"; // Benar
    } else if (jawabanSiswa !== undefined && jawabanSiswa !== null) {
      return "✗"; // Salah
    } else {
      return ""; // Tidak dijawab
    }
  };

  // Fungsi untuk menentukan label jawaban
  const getJawabanLabel = (index) => {
    const jawabanBenar = jawabanBenarArray[index];
    const jawabanSiswa = jawabanSiswaArray[index];

    if (jawabanBenar === jawabanSiswa && jawabanSiswa === true) {
      return "BENAR ✓";
    } else if (jawabanBenar === jawabanSiswa && jawabanSiswa === false) {
      return "SALAH ✓";
    } else if (jawabanBenar !== jawabanSiswa && jawabanSiswa === true) {
      return "BENAR ✗";
    } else if (jawabanBenar !== jawabanSiswa && jawabanSiswa === false) {
      return "SALAH ✗";
    } else {
      return "TIDAK DIJAWAB";
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Soal */}
      <section className="flex items-center justify-between">
        <div className="text-lg font-bold">Soal Nomor {nomor}</div>
        <div className="relative">
          <p className="absolute right-5 top-2 text-gray-500">/ {item.point}</p>
          <input
            className="rounded-md border p-2 text-center font-bold"
            style={{ width: "90px" }}
            disabled
            value={score}
          />
        </div>
      </section>

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
              className={clsx(
                `grid grid-cols-12 transition-colors `,
                {
                  "bg-red-400":
                    jawabanBenarArray[index] !== jawabanSiswaArray[index],
                },
              )}
            >
              {/* Pernyataan */}
              <div className="col-span-8 border-r border-gray-300 px-4 py-4">
                <div className="flex items-start space-x-3">
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

              {console.log("ja", jawabanBenarArray)}
              {/* Jawaban Benar */}
              <div className="col-span-2 flex items-center justify-center border-r border-gray-300 px-4 py-4">
                <label className="flex cursor-pointer items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={jawabanBenarArray[index] === "true"}
                    onChange={(e) => {
                      if (e.target.checked) {
                        // handleJawabanChange(index, true);
                      }
                    }}
                    className="h-5 w-5 rounded-full border-2 border-gray-300 bg-white text-green-600 focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
                  />
                </label>
              </div>

              {/* Jawaban Siswa */}
              <div className="col-span-2 flex items-center justify-center px-4 py-4">
                <label className="flex cursor-pointer items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={jawabanBenarArray[index] === "false"}
                    onChange={(e) => {
                      if (e.target.checked) {
                        // handleJawabanChange(index, false);
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
    </div>
  );
}

const handleViewJawaban = (data, id) => {
  const res = data.filter((item) => item.id === id);
  return res?.[0];
};
