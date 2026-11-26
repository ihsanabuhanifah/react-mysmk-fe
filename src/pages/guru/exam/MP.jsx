import clsx from "clsx";
import htmr from "htmr";

export default function MultipleChoiceView({ soals, jawaban, item, nomor }) {
  // ✅ Pastikan data utama tidak undefined/null
  if (!soals || !item) {
    return (
      <div className="p-4 text-red-600 border border-red-300 rounded-md bg-red-50">
        Data soal tidak ditemukan atau belum dimuat.
      </div>
    );
  }

  // Kunci di DB berupa string "c,b"; jawaban siswa berupa array ["c","a"].
  // Normalisasi keduanya sama seperti backend (utils/penilaianUjian.js).
  const jawabanBenar = keArray(item.jawaban);
  const siswaRaw = handleViewJawaban(jawaban, item.id);
  const jawabanSiswa = {
    ...siswaRaw,
    jawaban: siswaRaw?.jawaban === undefined ? undefined : keArray(siswaRaw.jawaban),
  };

  // ✅ Log aman (tidak akan error meskipun undefined)
  console.log("Jawaban benar:", jawabanBenar);
  console.log("Jawaban siswa:", jawabanSiswa?.jawaban);

  // ✅ Hitung score dengan pengecekan error
  const calculateScore = () => {
    try {
      if (!jawabanSiswa?.jawaban || !Array.isArray(jawabanSiswa.jawaban)) {
        return 0;
      }

      const jawabanSiswaArray = jawabanSiswa.jawaban;
      const jawabanBenarArray = jawabanBenar;

      if (
        jawabanBenarArray.length === 0 ||
        jawabanSiswaArray.length !== jawabanBenarArray.length
      ) {
        return 0;
      }

      const semuaBenar = jawabanBenarArray.every((j) =>
        jawabanSiswaArray.includes(j)
      );

      return semuaBenar ? item.point ?? 0 : 0;
    } catch (err) {
      console.error("Error menghitung skor:", err);
      return 0;
    }
  };

  const score = calculateScore();

  // ✅ Error-safe checkbox style
  const getCheckboxStyle = (pilihan) => {
    try {
      const isJawabanBenar = jawabanBenar.includes(pilihan);
      const isDipilihSiswa = jawabanSiswa?.jawaban?.includes(pilihan);

      if (isJawabanBenar && isDipilihSiswa)
        return "bg-green-500 border-green-500 text-white";
      if (isJawabanBenar && !isDipilihSiswa)
        return "bg-green-200 border-green-300 text-green-700";
      if (!isJawabanBenar && isDipilihSiswa)
        return "bg-red-500 border-red-500 text-white";
      return "bg-gray-100 border-gray-300 text-gray-700";
    } catch (err) {
      console.error("Error menentukan style checkbox:", err);
      return "bg-gray-100 border-gray-300 text-gray-700";
    }
  };

  // ✅ Error-safe checkbox icon
  const getCheckboxIcon = (pilihan) => {
    try {
      const isJawabanBenar = jawabanBenar.includes(pilihan);
      const isDipilihSiswa = jawabanSiswa?.jawaban?.includes(pilihan);

      if (isJawabanBenar && isDipilihSiswa) return "✓";
      if (isJawabanBenar && !isDipilihSiswa) return "✓";
      if (!isJawabanBenar && isDipilihSiswa) return "✗";
      return "";
    } catch (err) {
      console.error("Error menentukan ikon checkbox:", err);
      return "";
    }
  };

  return (
    <div className="space-y-5">
      {/* Header */}
      <section className="flex items-center justify-between">
        <div className="font-bold">Soal Nomor {nomor ?? "-"}</div>
        <div className="relative">
          <p className="text-gray-500 absolute top-2 right-5">/ {item.point ?? 0}</p>
          <input
            className="border p-2 rounded-md"
            style={{ width: "90px" }}
            disabled
            value={score}
          />
        </div>
      </section>

      {/* Soal */}
      <div className="p-4 rounded-md border text-justify bg-white">
        {soals.soal ? (
          htmr(
            `<div>${soals.soal.replace(
              "https://storage.devopsgeming.online",
              "https://bemysmk.smkmadinatulquran.sch.id"
            )}</div>`
          )
        ) : (
          <p className="text-gray-400 italic">Soal belum tersedia.</p>
        )}
      </div>

      {/* Pilihan */}
      {["a", "b", "c", "d", "e"].map(
        (opt) =>
          soals[opt] && (
            <div
              key={opt}
              className="flex items-start space-x-3 p-4 border rounded-lg bg-white"
            >
              <div className="flex items-center justify-center w-6 h-6 mt-1">
                <div
                  className={clsx(
                    "w-6 h-6 border-2 rounded flex items-center justify-center text-sm font-bold transition-all",
                    getCheckboxStyle(opt)
                  )}
                >
                  {getCheckboxIcon(opt)}
                </div>
              </div>
              <div className="flex-1">
                {htmr(
                  `<div>${soals[opt].replace(
                    "https://storage.devopsgeming.online",
                    "https://bemysmk.smkmadinatulquran.sch.id"
                  )}</div>`
                )}
              </div>
            </div>
          )
      )}

      {/* Legend */}
      <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
        <div className="text-sm font-semibold text-blue-800 mb-2">
          Keterangan:
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
          <LegendBox
            color="bg-green-500 border-green-500 text-white"
            text="Jawaban siswa – BENAR (dipilih siswa & sesuai kunci)"
            icon="✓"
          />
          <LegendBox
            color="bg-green-200 border-green-300 text-green-700"
            text="Kunci jawaban yang tidak dipilih siswa"
            icon="✓"
          />
          <LegendBox
            color="bg-red-500 border-red-500 text-white"
            text="Jawaban siswa – SALAH (dipilih siswa, bukan kunci)"
            icon="✗"
          />
          <LegendBox
            color="bg-gray-100 border-gray-300"
            text="Tidak dipilih siswa & bukan kunci"
          />
        </div>
      </div>
    </div>
  );
}

// ✅ Komponen kecil untuk legend agar lebih rapi
function LegendBox({ color, text, icon }) {
  return (
    <div className="flex items-center space-x-2">
      <div
        className={clsx(
          "w-4 h-4 border-2 rounded flex items-center justify-center text-xs",
          color
        )}
      >
        {icon && <span>{icon}</span>}
      </div>
      <span>{text}</span>
    </div>
  );
}

// "c,b" / ["c","b"] / "C" -> ["c","b"] (trim + lowercase, tanpa duplikat)
function keArray(v) {
  const arr = Array.isArray(v)
    ? v
    : v === null || v === undefined
    ? []
    : String(v).split(",");
  return [
    ...new Set(
      arr.map((x) => String(x ?? "").trim().toLowerCase()).filter((x) => x !== ""),
    ),
  ];
}

// ✅ Error-safe filter jawaban siswa
const handleViewJawaban = (data, id) => {
  try {
    if (!Array.isArray(data)) return {};
    return data.find((item) => item.id === id) || {};
  } catch (err) {
    console.error("Error memproses jawaban siswa:", err);
    return {};
  }
};
