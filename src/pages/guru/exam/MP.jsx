import clsx from "clsx";
import htmr from "htmr";

export default function MultipleChoiceView({ soals, jawaban, item, nomor }) {
  const jawabanSiswa = handleViewJawaban(jawaban, item.id);
  const jawabanBenar = item.jawaban


  console.log('ite', item.jawaban)
  // Hitung score berdasarkan kesesuaian jawaban
  const calculateScore = () => {
    if (!jawabanSiswa?.jawaban || !Array.isArray(jawabanSiswa.jawaban)) {
      return 0;
    }

    const jawabanSiswaArray = jawabanSiswa.jawaban;
    const jawabanBenarArray = jawabanBenar;

    // Jika jumlah jawaban tidak sama, langsung 0
    if (jawabanSiswaArray.length !== jawabanBenarArray.length) {
      return 0;
    }

    // Cek apakah semua jawaban siswa benar
    const semuaBenar = jawabanBenarArray.every(jawaban => 
      jawabanSiswaArray.includes(jawaban)
    );

    return semuaBenar ? item.point : 0;
  };

  const score = calculateScore();

  // Fungsi untuk menentukan style checkbox berdasarkan status jawaban
  const getCheckboxStyle = (pilihan) => {

     console.log("ja", jawabanBenar)

    console.log("pulihan", pilihan)
    const isJawabanBenar = jawabanBenar.includes(pilihan);

    console.log("is", isJawabanBenar)
    const isDipilihSiswa = jawabanSiswa?.jawaban?.includes(pilihan);

    if (isJawabanBenar && isDipilihSiswa) {
      return "bg-green-500 border-green-500 text-white"; // Benar dan dipilih
    } else if (isJawabanBenar && !isDipilihSiswa) {
      return "bg-green-200 border-green-300 text-green-700"; // Benar tapi tidak dipilih
    } else if (!isJawabanBenar && isDipilihSiswa) {
      return "bg-red-500 border-red-500 text-white"; // Salah tapi dipilih
    } else {
      return "bg-gray-100 border-gray-300 text-gray-700"; // Bukan jawaban benar
    }
  };

  // Fungsi untuk menentukan icon checkbox
  const getCheckboxIcon = (pilihan) => {
    const isJawabanBenar = jawabanBenar.includes(pilihan);
    const isDipilihSiswa = jawabanSiswa?.jawaban?.includes(pilihan);

    if (isJawabanBenar && isDipilihSiswa) {
      return "✓"; // Check mark untuk benar dan dipilih
    } else if (isJawabanBenar && !isDipilihSiswa) {
      return "✓"; // Check mark untuk benar tapi tidak dipilih
    } else if (!isJawabanBenar && isDipilihSiswa) {
      return "✗"; // X mark untuk salah tapi dipilih
    } else {
      return ""; // Kosong untuk bukan jawaban benar
    }
  };

  return (
    <div className="space-y-5">
      <section className="flex items-center justify-between">
        <div className="font-bold">Soal Nomor {nomor}</div>
        <div className="relative">
          <p className="text-gray-500 absolute top-2 right-5">/ {item.point}</p>
          <input
            className="border p-2 rounded-md"
            style={{ width: "90px" }}
            disabled
            value={score}
          />
        </div>
      </section>

      <div className="p-4 rounded-md border text-justify bg-white">
        {htmr(`<div>${soals.soal?.replace(
          "https://storage.devopsgeming.online",
          "https://bemysmk.smkmadinatulquran.sch.id",
        )}</div>`)}
      </div>

      <div className="space-y-3">
        {/* Pilihan A */}
        {soals.a && (
          <div className="flex items-start space-x-3 p-4 border rounded-lg bg-white">
            <div className="flex items-center justify-center w-6 h-6 mt-1">
              <div
                className={clsx(
                  "w-6 h-6 border-2 rounded flex items-center justify-center text-sm font-bold transition-all",
                  getCheckboxStyle("a")
                )}
              >
                {getCheckboxIcon("a")}
              </div>
            </div>
            <div className="flex-1">
             
              {htmr(`<div>${soals.a?.replace(
                "https://storage.devopsgeming.online",
                "https://bemysmk.smkmadinatulquran.sch.id",
              )}</div>`)}
            </div>
          </div>
        )}

        {/* Pilihan B */}
        {soals.b && (
          <div className="flex items-start space-x-3 p-4 border rounded-lg bg-white">
            <div className="flex items-center justify-center w-6 h-6 mt-1">
              <div
                className={clsx(
                  "w-6 h-6 border-2 rounded flex items-center justify-center text-sm font-bold transition-all",
                  getCheckboxStyle("b")
                )}
              >
                {getCheckboxIcon("b")}
              </div>
            </div>
            <div className="flex-1">
             
              {htmr(`<div>${soals.b?.replace(
                "https://storage.devopsgeming.online",
                "https://bemysmk.smkmadinatulquran.sch.id",
              )}</div>`)}
            </div>
          </div>
        )}

        {/* Pilihan C */}
        {soals.c && (
          <div className="flex items-start space-x-3 p-4 border rounded-lg bg-white">
            <div className="flex items-center justify-center w-6 h-6 mt-1">
              <div
                className={clsx(
                  "w-6 h-6 border-2 rounded flex items-center justify-center text-sm font-bold transition-all",
                  getCheckboxStyle("c")
                )}
              >
                {getCheckboxIcon("c")}
              </div>
            </div>
            <div className="flex-1">
            
              {htmr(`<div>${soals.c?.replace(
                "https://storage.devopsgeming.online",
                "https://bemysmk.smkmadinatulquran.sch.id",
              )}</div>`)}
            </div>
          </div>
        )}

        {/* Pilihan D */}
        {soals.d && (
          <div className="flex items-start space-x-3 p-4 border rounded-lg bg-white">
            <div className="flex items-center justify-center w-6 h-6 mt-1">
              <div
                className={clsx(
                  "w-6 h-6 border-2 rounded flex items-center justify-center text-sm font-bold transition-all",
                  getCheckboxStyle("d")
                )}
              >
                {getCheckboxIcon("d")}
              </div>
            </div>
            <div className="flex-1">
            
              {htmr(`<div>${soals.d?.replace(
                "https://storage.devopsgeming.online",
                "https://bemysmk.smkmadinatulquran.sch.id",
              )}</div>`)}
            </div>
          </div>
        )}

        {/* Pilihan E */}
        {soals.e && (
          <div className="flex items-start space-x-3 p-4 border rounded-lg bg-white">
            <div className="flex items-center justify-center w-6 h-6 mt-1">
              <div
                className={clsx(
                  "w-6 h-6 border-2 rounded flex items-center justify-center text-sm font-bold transition-all",
                  getCheckboxStyle("e")
                )}
              >
                {getCheckboxIcon("e")}
              </div>
            </div>
            <div className="flex-1">
             
              {htmr(`<div>${soals.e?.replace(
                "https://storage.devopsgeming.online",
                "https://bemysmk.smkmadinatulquran.sch.id",
              )}</div>`)}
            </div>
          </div>
        )}
      </div>

      {/* Legend Keterangan */}
      <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
        <div className="text-sm font-semibold text-blue-800 mb-2">Keterangan:</div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-green-500 border-2 border-green-500 rounded flex items-center justify-center text-white text-xs">✓</div>
            <span>Jawaban benar dan dipilih siswa</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-green-200 border-2 border-green-300 rounded flex items-center justify-center text-green-700 text-xs">✓</div>
            <span>Jawaban benar tapi tidak dipilih</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-red-500 border-2 border-red-500 rounded flex items-center justify-center text-white text-xs">✗</div>
            <span>Jawaban salah tapi dipilih</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-gray-100 border-2 border-gray-300 rounded"></div>
            <span>Bukan jawaban benar</span>
          </div>
        </div>
      </div>

      {/* Info Ringkasan */}
    
    </div>
  );
}

const handleViewJawaban = (data, id) => {
  const res = data.filter((item) => item.id === id);
  return res?.[0];
};