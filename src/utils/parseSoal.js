// Parser teks hasil OCR menjadi soal, sesuai tipe soal yang dipilih guru.
// Dulu dikerjakan backend (POST /soal/image); sekarang seluruhnya di browser.
//
// Format teks yang dikenali (contoh):
//   Pertanyaan ... (boleh beberapa baris)
//   A. pilihan / pernyataan       (A-E, atau 1-5 untuk MTF)
//   B. ...
//   Jawaban: C            -> PG
//   Jawaban: A, C, D      -> MP
//   Jawaban: Benar        -> TF   (Benar/Salah, B/S, True/False)
//   Jawaban: B, S, B      -> MTF  (urut sesuai pernyataan)
// Untuk MTF, kunci juga boleh ditulis di akhir pernyataan: "... (Benar)" / "... - S".

const HURUF = ["A", "B", "C", "D", "E"];

// Baris pilihan berhuruf. Pemisah spasi diizinkan karena OCR sering
// kehilangan titik (sama dengan parser backend lama).
const PILIHAN_HURUF = /^\s*([A-Ea-e])\s*[.)\-:\s]\s*(.*)$/;
// Pernyataan MTF boleh juga bernomor 1-5.
const PILIHAN_NOMOR = /^\s*([1-5])\s*[.)]\s*(.*)$/;
const BARIS_JAWABAN = /^\s*(?:kunci(?:\s*jawaban)?|jawaban(?:\s*benar)?)\s*[:=\-]?\s*(.+)$/i;
// Kunci di akhir pernyataan MTF: "(Benar)", "[S]", "- Salah", "→ B"
const KUNCI_INLINE =
  /\s*(?:[([]\s*(benar|salah|true|false|b|s)\s*[)\]]|(?:-|–|—|→|=>|:)\s*(benar|salah|true|false|b|s))\s*$/i;

const nilaiTF = (token) => {
  const t = String(token || "").trim().toLowerCase();
  if (["benar", "b", "true", "t", "ya", "y"].includes(t)) return "true";
  if (["salah", "s", "false", "f", "tidak"].includes(t)) return "false";
  return null;
};

const pecahToken = (teks) =>
  String(teks || "")
    .split(/[\s,;/&|]+|\bdan\b/i)
    .map((x) => x.trim())
    .filter(Boolean);

function pecahBaris(text, { nomor = false } = {}) {
  const lines = String(text || "").replace(/\r/g, "").split("\n");
  const pertanyaan = [];
  const pilihan = []; // [{ huruf, teks }]
  let jawabanMentah = "";
  let current = null;

  for (const original of lines) {
    const line = original.trim();

    const j = line.match(BARIS_JAWABAN);
    if (j) {
      jawabanMentah = j[1].trim();
      current = null;
      continue;
    }

    const m =
      line.match(PILIHAN_HURUF) || (nomor ? line.match(PILIHAN_NOMOR) : null);
    if (m) {
      // Untuk huruf: hanya terima urutan berikutnya (A, lalu B, ...) agar
      // kalimat pertanyaan yang kebetulan diawali "a " tidak dianggap pilihan.
      const expected = pilihan.length;
      const key = m[1].toUpperCase();
      const idx = /\d/.test(key) ? Number(key) - 1 : HURUF.indexOf(key);
      if (idx === expected && expected < HURUF.length) {
        current = { huruf: HURUF[idx], teks: (m[2] || "").trim() };
        pilihan.push(current);
        continue;
      }
    }

    if (current) {
      if (line) current.teks += (current.teks ? "\n" : "") + line;
    } else {
      pertanyaan.push(original);
    }
  }

  return {
    pertanyaan: pertanyaan.join("\n").trim(),
    pilihan: pilihan.map((p) => ({ ...p, teks: p.teks.trim() })),
    jawabanMentah,
  };
}

export function parseSoal(text, tipe = "PG") {
  if (tipe === "ES" || tipe === "LV") {
    return { pertanyaan: String(text || "").trim(), pilihan: [], jawaban: "" };
  }

  if (tipe === "TF") {
    const { pertanyaan, jawabanMentah } = pecahBaris(text);
    return {
      pertanyaan,
      pilihan: [],
      jawaban: nilaiTF(pecahToken(jawabanMentah)[0]) || "",
    };
  }

  if (tipe === "MTF") {
    const { pertanyaan, pilihan, jawabanMentah } = pecahBaris(text, {
      nomor: true,
    });
    const dariBaris = pecahToken(jawabanMentah).map(nilaiTF).filter(Boolean);
    const pernyataan = pilihan.map((p, i) => {
      const inline = p.teks.match(KUNCI_INLINE);
      const teks = inline ? p.teks.replace(KUNCI_INLINE, "").trim() : p.teks;
      const kunci = (inline && nilaiTF(inline[1] || inline[2])) || dariBaris[i];
      return { huruf: p.huruf, teks, jawaban: kunci || "false" };
    });
    return {
      pertanyaan,
      pilihan: pernyataan,
      jawaban: pernyataan.map((p) => p.jawaban).join(","),
    };
  }

  const { pertanyaan, pilihan, jawabanMentah } = pecahBaris(text);
  const huruf = pecahToken(jawabanMentah)
    .map((t) => t.replace(/[^A-Ea-e]/g, "").toUpperCase())
    .filter((t) => t.length === 1);

  if (tipe === "MP") {
    return {
      pertanyaan,
      pilihan,
      jawaban: [...new Set(huruf.map((h) => h.toLowerCase()))],
    };
  }

  // PG
  return { pertanyaan, pilihan, jawaban: huruf[0] || "" };
}

// OCR di browser. Worker, core WASM dan data bahasa diunduh dari CDN
// (jsDelivr) saat pertama dipakai, lalu di-cache oleh browser.
let workerPromise = null;
let progressCb = null;

export async function ocrGambar(file, onProgress) {
  progressCb = onProgress || null;
  if (!workerPromise) {
    workerPromise = import("tesseract.js")
      .then(({ createWorker }) =>
        createWorker("eng", 1, {
          logger: (m) => progressCb && progressCb(m),
        }),
      )
      .catch((err) => {
        workerPromise = null;
        throw err;
      });
  }
  const worker = await workerPromise;
  const { data } = await worker.recognize(file);
  return data.text;
}
